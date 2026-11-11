/* Cloudflare Worker: receives anonymous feedback from the field guide and adds a row to a Notion database.
   Secrets (set in the Cloudflare dashboard, never in this file): NOTION_TOKEN, NOTION_DB_ID.
   Variable: ALLOWED_ORIGIN, e.g. https://welearnwegrow.github.io
   Nothing identifying is stored: no IP address, no cookies, no user id. */
const MAX_NOTE = 280;
const REACTIONS = ["yes", "no"];

function cors(origin, allowed){
  return {
    "Access-Control-Allow-Origin": origin === allowed ? allowed : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env){
    const origin = request.headers.get("Origin") || "";
    const headers = cors(origin, env.ALLOWED_ORIGIN);
    if (request.method === "OPTIONS") return new Response(null, {status: 204, headers});
    if (request.method !== "POST" || origin !== env.ALLOWED_ORIGIN) return new Response("Not allowed", {status: 403, headers});

    let body;
    try { body = await request.json(); } catch (e){ return new Response("Bad request", {status: 400, headers}); }
    const example = String(body.example || "").slice(0, 80);
    const reaction = String(body.reaction || "");
    const note = String(body.note || "").slice(0, MAX_NOTE);
    const page = String(body.page || "").slice(0, 120);
    if (!/^[a-z_]+:(useful|risky)$/.test(example) || !REACTIONS.includes(reaction)) return new Response("Bad request", {status: 400, headers});

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
          "Example": {title: [{text: {content: example}}]},
          "Kind": {select: {name: "Example feedback"}},
          "Reaction": {select: {name: reaction === "yes" ? "Rings true" : "Doesn't ring true"}},
          "Note": {rich_text: note ? [{text: {content: note}}] : []},
          "Page": {rich_text: [{text: {content: page}}]},
          "Time": {date: {start: new Date().toISOString()}}
        }
      })
    });
    return new Response(res.ok ? "ok" : "error", {status: res.ok ? 200 : 502, headers});
  }
};
