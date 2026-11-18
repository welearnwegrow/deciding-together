/* Cloudflare Worker for the field guide.
   1. Feedback (POST /): adds a row to the Notion table. Example feedback and Guide me feedback.
   2. Guide me (POST /guide): passes the page's prompt to the Claude API and returns the answer text.
   3. Transcript (POST /transcript): saves a Guide me conversation to the Notion table, if the reader left "save a copy" ticked.
   4. Visit (POST /visit): one "Visit" row per visitor per day, and one "Opened" row per structure a visitor opens that day.
      Also one "Scrolled" row per page per visitor per day: the furthest heading reached, Scroll %, Cards seen, Seconds.
      The site decides what to send once a day; this route only checks and writes it.
   Secrets (set in the Cloudflare dashboard, never in this file): NOTION_TOKEN, NOTION_DB_ID, ANTHROPIC_API_KEY.
   Variables: ALLOWED_ORIGIN, e.g. https://welearnwegrow.github.io
              GUIDE_MODEL (optional), default claude-sonnet-5-5
              GUIDE_DAILY_LIMIT (optional), default 200 answers a day; needs a KV namespace bound as GUIDE_KV to count.
              GUIDE_MAX_TOKENS (optional), default 16000. The model may think before it writes, and that thinking counts toward this limit.
              PRICE_IN, PRICE_OUT (optional): US dollars per million input / output tokens, used for the cost estimate.
                Defaults 3 and 15. Check them against current Claude API pricing for the model you use.
   Nothing identifying is stored: no IP address, no cookies, no account id. Visitor ID is a random
   string made in the reader's browser, so answers from one browser can be grouped. Visits also record
   the site the reader came from (site name only), phone/tablet/desktop, and the two-letter country Cloudflare adds.
   Guide me descriptions are sent to the Claude API to produce the answer. A transcript is kept in Notion only when the reader agrees. */
const MAX_NOTE = 280;
const REACTIONS = ["yes", "no"];
const MAX_PROMPT = 60000;

function cors(origin, allowed){
  return {
    "Access-Control-Allow-Origin": origin === allowed ? allowed : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), {status, headers: {...headers, "Content-Type": "application/json"}});

async function guide(body, env, headers){
  const prompt = String(body.prompt || "");
  /* only the guide's own prompt is accepted, so the key can't be used as a general chatbot */
  if (!prompt.startsWith('You are "Guide me", the decision guide inside') || !prompt.includes("\nCATALOGUE\n") || prompt.length > MAX_PROMPT)
    return json({error: "bad request"}, 400, headers);
  if (env.GUIDE_KV){
    const day = new Date().toISOString().slice(0, 10), key = "n:" + day;
    const n = parseInt(await env.GUIDE_KV.get(key) || "0", 10);
    if (n >= parseInt(env.GUIDE_DAILY_LIMIT || "200", 10)) return json({error: "busy"}, 429, headers);
    await env.GUIDE_KV.put(key, String(n + 1), {expirationTtl: 172800});
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
    body: JSON.stringify({model: env.GUIDE_MODEL || "claude-sonnet-5-5", max_tokens: parseInt(env.GUIDE_MAX_TOKENS || "16000", 10), messages: [{role: "user", content: prompt}]})
  });
  if (res.status === 429) return json({error: "busy"}, 429, headers);
  if (!res.ok) return json({error: "upstream"}, 502, headers);
  const d = await res.json();
  const text = (d.content || []).filter(c => c.type === "text").map(c => c.text).join("");
  const u = d.usage || {}, pin = parseFloat(env.PRICE_IN || "3"), pout = parseFloat(env.PRICE_OUT || "15");
  const cost = Math.round(((u.input_tokens || 0)*pin + (u.output_tokens || 0)*pout) / 1e6 * 10000) / 10000;
  return json({text, cost, stop: d.stop_reason || ""}, 200, headers);
}

async function transcript(body, env, headers){
  /* one row per public Guide me conversation, with its estimated cost; the text is kept only if the reader agreed */
  const consent = body.consent === true;
  const text = consent ? String(body.text || "").slice(0, 20000) : "";
  const page = String(body.page || "").slice(0, 120);
  const visitor = consent && /^[a-f0-9]{32}$/.test(String(body.visitor || "")) ? String(body.visitor) : "";
  const cost = Math.max(0, Math.min(5, Number(body.cost) || 0));
  if (consent && !text.startsWith("DESCRIPTION\n")) return new Response("Bad request", {status: 400, headers});
  const chunks = []; for (let i = 0; i < text.length && chunks.length < 90; i += 1900) chunks.push(text.slice(i, i + 1900));
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {"Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json"},
    body: JSON.stringify({
      parent: {database_id: env.NOTION_DB_ID},
      properties: {
        "Example": {title: [{text: {content: consent ? "Guide me conversation" : "Guide me conversation (not saved)"}}]},
        "Kind": {select: {name: "Guide me transcript"}},
        "Note": {rich_text: consent ? [{text: {content: text.split("\n")[1].slice(0, 1900)}}] : []},
        "Page": {rich_text: [{text: {content: page}}]},
        "Visitor ID": {rich_text: visitor ? [{text: {content: visitor}}] : []},
        "Est. cost (USD)": {number: cost},
        "Time": {date: {start: new Date().toISOString()}}
      },
      children: chunks.map(c => ({object: "block", type: "paragraph", paragraph: {rich_text: [{type: "text", text: {content: c}}]}}))
    })
  });
  return new Response(res.ok ? "ok" : "error", {status: res.ok ? 200 : 502, headers});
}

async function feedback(body, env, headers){
  const example = String(body.example || "").slice(0, 80);
  const reaction = String(body.reaction || "");
  const note = String(body.note || "").slice(0, MAX_NOTE);
  const page = String(body.page || "").slice(0, 120);
  const visitor = /^[a-f0-9]{32}$/.test(String(body.visitor || "")) ? String(body.visitor) : "";
  const isTool = /^tool:(answer|note)$/.test(example);
  if (isTool ? !["yes", "ok", "no"].includes(reaction) : (!/^[a-z_]+:(useful|risky)$/.test(example) || !REACTIONS.includes(reaction))) return new Response("Bad request", {status: 400, headers});
  const reactionName = isTool ? ({yes: "Really helpful", ok: "It was OK", no: "Not helpful"})[reaction] : (reaction === "yes" ? "Rings true" : "Doesn't ring true");

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      parent: {database_id: env.NOTION_DB_ID},
      properties: {
        "Example": {title: [{text: {content: isTool ? "Guide me" : example}}]},
        "Kind": {select: {name: isTool ? "Tool answers" : "Example feedback"}},
        "Reaction": {select: {name: reactionName}},
        "Note": {rich_text: note ? [{text: {content: note}}] : []},
        "Page": {rich_text: [{text: {content: page}}]},
        "Visitor ID": {rich_text: visitor ? [{text: {content: visitor}}] : []},
        "Time": {date: {start: new Date().toISOString()}}
      }
    })
  });
  return new Response(res.ok ? "ok" : "error", {status: res.ok ? 200 : 502, headers});
}

async function visit(body, env, headers, request){
  const kind = body.kind === "visit" ? "Visit" : body.kind === "open" ? "Opened" : body.kind === "scroll" ? "Scrolled" : "";
  if (!kind) return new Response("Bad request", {status: 400, headers});
  const what = String(body.example || "").slice(0, 120);
  if (kind === "Opened" && !what) return new Response("Bad request", {status: 400, headers});
  const page = String(body.page || "").slice(0, 120);
  const visitor = /^[a-f0-9]{32}$/.test(String(body.visitor || "")) ? String(body.visitor) : "";
  const from = String(body.from || "").slice(0, 120);
  const device = ["Phone", "Tablet", "Desktop"].includes(body.device) ? body.device : "";
  const country = String((request.cf && request.cf.country) || "").slice(0, 8);   /* two-letter code from Cloudflare; the IP itself is never stored */
  const rt = v => v ? [{text: {content: v}}] : [];

  const props = {
    "Example": {title: [{text: {content: kind === "Visit" ? "Visit" : (what || "Top of page")}}]},
    "Kind": {select: {name: kind}},
    "Page": {rich_text: rt(page)},
    "Visitor ID": {rich_text: rt(visitor)},
    "Came from": {rich_text: rt(from)},
    "Country": {rich_text: rt(country)},
    "Time": {date: {start: new Date().toISOString()}}
  };
  if (device) props["Device"] = {select: {name: device}};
  if (kind === "Scrolled"){
    const num = (v, max) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0; };
    props["Scroll %"] = {number: num(body.scroll, 100)};
    props["Cards seen"] = {number: num(body.cards, 500)};
    props["Seconds"] = {number: num(body.seconds, 3600)};
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {"Authorization": `Bearer ${env.NOTION_TOKEN}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json"},
    body: JSON.stringify({parent: {database_id: env.NOTION_DB_ID}, properties: props})
  });
  return new Response(res.ok ? "ok" : "error", {status: res.ok ? 200 : 502, headers});
}

export default {
  async fetch(request, env){
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env.ALLOWED_ORIGIN);
    if (request.method === "OPTIONS") return new Response(null, {status: 204, headers});
    if (request.method !== "POST" || origin !== env.ALLOWED_ORIGIN) return new Response("Not allowed", {status: 403, headers});
    let body;
    try { body = await request.json(); } catch (e){ return new Response("Bad request", {status: 400, headers}); }
    const path = new URL(request.url).pathname.replace(/\/+$/, "");
    if (path === "/guide") return guide(body, env, headers);
    if (path === "/transcript") return transcript(body, env, headers);
    if (path === "/visit") return visit(body, env, headers, request);
    return feedback(body, env, headers);
  }
};
