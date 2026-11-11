/* Guide me: reads a described decision and suggests how to decide, using only this guide's structures, shaping methods and social forces.
   Inside Claude it asks Claude through the page's `sample` capability. On the public site it posts to window.FG_GUIDE_URL (a Worker route). */
(function(){
const strip = s => String(s || "").replace(/<[^>]+>/g, "");
const COST = {total: 0};
const VIS = FG.structures.filter(s => !(FG.asExample || {})[s.id] && FG.entries[s.id] && ["1","2","3","7"].includes(String(s.family)));
const FAMN = {"1":"Deciding by authority","2":"Deciding by voting","3":"Deciding by consensus","7":"No one in charge"};
const FORCES = FG.forces.filter(f => f.id !== "org_silence");
const TECHS = []; (window.SHAPING || []).forEach(st => st.techs.forEach(t => TECHS.push({stage: st.name, t})));
const IDS = {structure: new Set(VIS.map(s => s.id)), technique: new Set(TECHS.map(x => x.t.id)), force: new Set(FORCES.map(f => f.id))};

function catalogue(){
  const st = VIS.map(s => { const e = FG.entries[s.id];
    return `- ${s.id} | ${s.name} | ${FAMN[s.family]} | ${strip(s.line)} | Useful when: ${(e.useful.bullets || []).map(strip).join("; ")} | Watch out when: ${(e.risky.bullets || []).map(strip).join("; ")}`; }).join("\n");
  const te = TECHS.map(({stage, t}) => `- ${t.id} | ${t.name} | stage: ${stage} | ${strip(t.for)} | Use it when: ${strip(t.when)}`).join("\n");
  const fo = FORCES.map(f => `- ${f.id} | ${f.name} | ${strip(f.what)} | Counter: ${strip(f.counter)}`).join("\n");
  return `STRUCTURES (ways to make the final decision):\n${st}\n\nSHAPING METHODS (ways to prepare a proposal before deciding):\n${te}\n\nSOCIAL FORCES (pressures inside groups):\n${fo}`;
}

const SCHEMA = `{
 "ask": [string],
 "heard": string,
 "assumptions": [string],
 "kind": {"type": "clear" | "complicated" | "complex" | "chaotic", "why": string},
 "approach": {"summary": string, "steps": [{"label": string, "role": "shape" | "decide" | "fallback" | "review", "kind": "structure" | "technique" | "none", "id": string, "how": string, "loop": boolean, "until": string}]},
 "forces": [{"id": string, "effect": "helps" | "watch", "why": string, "do": string}],
 "people": [{"who": string, "part": "decides" | "shapes the proposal" | "is consulted" | "is told" | "carries it out", "when": string}],
 "first": [string],
 "shift": [{"if": string, "then": string}],
 "question": string
}`;

function prompt(desc, answers, allowAsk){
  return `You are "Guide me", the decision guide inside "A field guide to making decisions together". A reader has described a decision they face. Your job is to help them choose HOW to make it: who takes part, in what order, and by what rule. You do not make the decision for them.

The reader may work in any field: a school, a company, a hospital, a council, a charity, a family business. Speak about roles (the person with authority, the people affected, the people who will carry it out), using the reader's own words and details. Never assume they work in education.

HOW TO THINK
1. Judge what kind of situation this is, from their details, and say why in one or two sentences:
   - clear: the right answer is known or there is an agreed rule. One person, or a simple rule, is enough.
   - complicated: there is a right answer, but it takes expertise or analysis to find. Gather independent expert judgement before deciding.
   - complex: no one can know in advance what will work; people, causes and effects keep interacting. Prefer a small, reversible trial with a set review date over a final answer. Bring in the people closest to the problem, keep several views alive, and decide by consent ("can you live with trying this?") where commitment matters.
   - chaotic: something is going wrong now. One person acts at once to stabilise, then hands the wider decision back to the group.
   If parts of the decision fall into different kinds, say which part is which.
2. Build an approach as a flow of 4 to 7 steps in order, not a single structure: typically agreeing the purpose, gathering views or information, shaping a proposal, deciding, a fallback if the group gets stuck or time runs out, and a review. Give each step a short label of 2 to 5 words (for example "Agree the purpose", "Gather concerns", "Decide by consent"). Mark "loop" true for steps the group repeats until something is true (for example, questions until everyone understands the purpose), and say that condition in "until"; otherwise "loop" is false and "until" is "". Fit the flow to their size, time, reversibility, conflict, who has authority, who must carry it out, and anything private or unequal in the situation.
3. Name the two to four social forces most likely here, and only ones their details point to. Say what in their description makes each likely, and one concrete thing to do about it. Mark forces that could help as "helps".
4. Say who should be involved and how, and give three first steps they could take this week.
5. Say what would change this advice (for example, if the deadline moves or the decision turns out to be hard to undo).
6. End with one question for the reader to think about with the people involved.

RULES
- Recommend only items from the catalogue below, by their exact id. If a step needs no catalogue item, use kind "none" and id "".
- Do not invent facts about the reader. Where you assume something, list it in "assumptions", starting with "Assuming".
- Plain words, no jargon, no praise, no filler. Sentences under 25 words. Be specific to their situation; generic advice is a failure.
- This is a starting point for them to talk through with the people involved, not a verdict.
${allowAsk ? `- If one to three missing facts would change your advice (for example: can it be undone, is there a deadline, who will carry it out, who has authority, how strong the disagreement is), put those questions in "ask" and leave every other field empty. Ask only what their description does not already answer. Otherwise leave "ask" empty and answer in full.` : `- Do not ask questions. "ask" must be empty. Answer in full, listing anything you had to assume in "assumptions".`}

Reply with JSON only, in this shape:
${SCHEMA}

CATALOGUE
${catalogue()}

THE READER'S DECISION
${desc}
${answers && answers.length ? `\nTHEIR ANSWERS TO YOUR QUESTIONS\n${answers.map(a => `Q: ${a.q}\nA: ${a.a || "(no answer)"}`).join("\n")}` : ""}`;
}

function parse(text){
  const s = String(text || ""); const i = s.indexOf("{"), j = s.lastIndexOf("}");
  if (i < 0 || j < i) throw new Error("no json");
  return JSON.parse(s.slice(i, j + 1));
}
async function ask(p, onText){
  if (window.claude && window.claude.use){
    const sample = await window.claude.use("sample");
    if (sample){ const r = await sample(p, {modelTier: "complex", cache: false, onText}); return parse(r.text); }
  }
  const url = window.FG_GUIDE_URL; if (!url) throw Object.assign(new Error("unavailable"), {code: "unavailable"});
  const res = await fetch(url, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({prompt: p})});
  if (res.status === 429) throw Object.assign(new Error("busy"), {code: "rate_limited"});
  if (!res.ok) throw new Error("http " + res.status);
  const d = await res.json(); if (typeof d.cost === "number") COST.total += d.cost; return parse(d.text);
}
/* keep only catalogue ids the guide can link to */
function clean(r){
  r.approach = r.approach || {}; r.approach.steps = (r.approach.steps || []).filter(s => s && (s.kind === "none" || s.kind === "" || IDS[s.kind] && IDS[s.kind].has(s.id) || (s.kind = "none"))).map(s => (s.kind === "" && (s.kind = "none"), s));
  r.forces = (r.forces || []).filter(f => f && IDS.force.has(f.id));
  ["ask","assumptions","people","first","shift"].forEach(k => r[k] = Array.isArray(r[k]) ? r[k] : []);
  return r;
}
function link(kind, id){
  if (kind === "structure") return `<a href="${sHref(id)}">${esc(S[id].name)}</a>`;
  if (kind === "technique"){ const t = TECHS.find(x => x.t.id === id).t; return `<a href="shaping.html#${hy(id)}">${esc(t.name)}</a>`; }
  if (kind === "force"){ const f = FORCES.find(x => x.id === id); return `<a href="${fHref(id)}">${esc(f.name)}</a>`; }
  return "";
}
const KINDS = [["complex","Complex","No one can know in advance. Try, watch, adjust."],["complicated","Complicated","There is an answer. Experts can work it out."],["chaotic","Chaotic","Something is going wrong now. Act first."],["clear","Clear","The answer is known. Follow it."]];
const ROLE = {shape: "Shape", decide: "Decide", fallback: "If stuck", review: "Review"};
const ICON = {
  heard: '<path d="M4 5h16v10H9l-5 4z"/>',
  kind: '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/>',
  how: '<rect x="7" y="2.5" width="10" height="5" rx="1.5"/><rect x="7" y="16.5" width="10" height="5" rx="1.5"/><path d="M12 7.5v9M9.5 14l2.5 2.5 2.5-2.5"/>',
  who: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.3 1-4 3-4.4"/>',
  forces: '<path d="M4 8h12M12 4l4 4-4 4M20 16H8M12 12l-4 4 4 4"/>',
  first: '<path d="M5 12l4 4 10-10"/>',
  shift: '<path d="M4 7h11l-3-3M20 17H9l3 3"/>',
  question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7M12 17h.01"/>'
};
const ic = k => `<svg class="gic" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const LOOP = '<svg class="gloop" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>';
function render(r){
  const k = (r.kind && r.kind.type) || "";
  const grid = `<figure class="gkind" aria-label="Kind of situation: ${esc(k)}">${KINDS.map(([id, n, d]) => `<div class="${id}${id === k ? " on" : ""}"><b>${n}</b><span>${d}</span></div>`).join("")}</figure>`;
  const steps = r.approach.steps.map((s, i) => `<li class="gnode${s.loop ? " loops" : ""}"><details><summary><span class="gnum">${i + 1}</span><span class="glab"><b>${esc(s.label || ROLE[s.role] || "")}</b>${s.kind === "none" ? "" : `<small>${s.kind === "structure" ? "Structure" : "Method"}: ${link(s.kind, s.id)}</small>`}</span>${s.loop ? LOOP : ""}</summary>
      <div class="gdet"><p>${esc(s.how)}</p>${s.loop && s.until ? `<p class="guntil">Repeat until ${esc(s.until.replace(/^until\s+/i, ""))}</p>` : ""}</div></details></li>`).join("");
  const help = r.forces.filter(f => f.effect === "helps"), watch = r.forces.filter(f => f.effect !== "helps");
  const fl = a => a.map(f => `<li><span class="gfn">${link("force", f.id)}</span><p>${esc(f.why)}</p>${f.do ? `<p class="gdo">${esc(f.do)}</p>` : ""}</li>`).join("");
  const people = r.people.length ? `<table class="gpeople"><thead><tr><th>Who</th><th>Part</th><th>When</th></tr></thead><tbody>${r.people.map(p => `<tr><td>${esc(p.who)}</td><td><span class="gpart">${esc(p.part)}</span></td><td>${esc(p.when)}</td></tr>`).join("")}</tbody></table>` : "";
  const sec = (cls, icon, h, body) => `<section class="gsec ${cls}"><h3>${ic(icon)}<span>${h}</span></h3>${body}</section>`;
  return [
    sec("b-heard", "heard", "What we heard", `<p class="gbig">${esc(r.heard)}</p>${r.assumptions.length ? `<ul class="gassume">${r.assumptions.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}`),
    sec("b-kind", "kind", "What kind of situation this is", `<div class="gkwrap">${grid}<p>${esc((r.kind || {}).why || "")}</p></div>`),
    sec("b-how", "how", "How to decide", `<p class="glead">${esc(r.approach.summary || "")}</p><p class="gtip">Click a step for details. ${LOOP}<span> marks a step to repeat.</span></p><ol class="gflow">${steps}</ol>`),
    people ? sec("b-who", "who", "Who to involve", people) : "",
    r.forces.length ? sec("b-forces", "forces", "Social forces to expect", `<div class="gfcols">${watch.length ? `<div class="watch"><h4>Watch for</h4><ul>${fl(watch)}</ul></div>` : ""}${help.length ? `<div class="help"><h4>May help</h4><ul>${fl(help)}</ul></div>` : ""}</div>`) : "",
    r.first.length ? sec("b-first", "first", "First steps", `<ol class="gfirst">${r.first.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`) : "",
    r.shift.length ? sec("b-shift", "shift", "What would change this advice", `<dl class="gshift">${r.shift.map(x => `<div><dt>If ${esc(String(x.if).replace(/^if\s+/i, ""))}</dt><dd>${esc(x.then)}</dd></div>`).join("")}</dl>`) : "",
    r.question ? sec("b-q", "question", "A question to take back", `<p class="gbig">${esc(r.question)}</p>`) : ""
  ].join("");
}

/* a plain-text transcript, for Notion and the PDF */
function transcript(desc, qa, r){
  const L = [];
  L.push("DESCRIPTION", desc, "");
  if (qa && qa.length){ L.push("QUESTIONS AND ANSWERS"); qa.forEach(x => L.push("Q: " + x.q, "A: " + (x.a || "(skipped)"))); L.push(""); }
  if (r){
    const nm = s => s.kind === "structure" ? S[s.id].name : s.kind === "technique" ? (TECHS.find(x => x.t.id === s.id) || {t:{name:""}}).t.name : "";
    L.push("WHAT WE HEARD", r.heard); r.assumptions.forEach(a => L.push("- " + a)); L.push("");
    L.push("KIND OF SITUATION: " + ((r.kind || {}).type || ""), (r.kind || {}).why || "", "");
    L.push("HOW TO DECIDE", r.approach.summary || "");
    r.approach.steps.forEach((s, i) => L.push(`${i + 1}. ${s.label || ""}${nm(s) ? " (" + nm(s) + ")" : ""}${s.loop ? " [repeat until " + String(s.until || "").replace(/^until\s+/i, "") + "]" : ""}`, "   " + (s.how || "")));
    L.push("");
    if (r.people.length){ L.push("WHO TO INVOLVE"); r.people.forEach(p => L.push(`- ${p.who}: ${p.part}${p.when ? " (" + p.when + ")" : ""}`)); L.push(""); }
    if (r.forces.length){ L.push("SOCIAL FORCES TO EXPECT"); r.forces.forEach(f => { const ff = FORCES.find(x => x.id === f.id); L.push(`- ${ff.name} (${f.effect === "helps" ? "may help" : "watch for"}): ${f.why}${f.do ? " Do: " + f.do : ""}`); }); L.push(""); }
    if (r.first.length){ L.push("FIRST STEPS"); r.first.forEach((x, i) => L.push(`${i + 1}. ${x}`)); L.push(""); }
    if (r.shift.length){ L.push("WHAT WOULD CHANGE THIS ADVICE"); r.shift.forEach(x => L.push(`- If ${String(x.if).replace(/^if\s+/i, "")}: ${x.then}`)); L.push(""); }
    if (r.question) L.push("A QUESTION TO TAKE BACK", r.question);
  }
  return L.join("\n");
}
async function saveTranscript(text, consent){
  if (window.claude && window.claude.use){ if (!consent) return false;
    try { const db = await window.claude.use("db"), u = await window.claude.use("user"); if (!db || !u) return false;
      const doc = db.doc("fb/" + await u.id()), snap = await doc.get(), d = (snap && (snap.data ? snap.data() : snap)) || {};
      const guide = (d.guide || []).concat([{text: text.slice(0, 20000), t: new Date().toISOString()}]).slice(-20);
      await doc.set(Object.assign({}, d, {guide})); return true; } catch (e){ return false; }
  }
  const url = window.FG_FEEDBACK_URL; if (!url) return false;
  let vid = ""; try { vid = localStorage.getItem("fg_vid") || ""; } catch (e){}
  const cost = COST.total; COST.total = 0;
  try { const res = await fetch(url.replace(/\/+$/, "") + "/transcript", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(consent ? {consent: true, text: text.slice(0, 20000), visitor: vid, page: location.pathname, cost} : {consent: false, page: location.pathname, cost})}); return res.ok; } catch (e){ return false; }
}
/* PDF of the answer, made in the browser */
function loadPDF(){
  if (window.jspdf) return Promise.resolve();
  return new Promise((ok, no) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = ok; s.onerror = no; document.head.append(s); });
}
async function pdf(text){
  await loadPDF();
  const doc = new window.jspdf.jsPDF({unit: "pt", format: "a4"}), W = 595, M = 56, LH = 15;
  const plain = t => String(t).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
  let y = M + 30;
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("Guide me", M, y); y += 20;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(110);
  doc.text(plain("A field guide to making decisions together - " + new Date().toISOString().slice(0, 10)), M, y); y += 26; doc.setTextColor(30);
  plain(text).split("\n").forEach(line => {
    const head = /^[A-Z][A-Z ,:]+$/.test(line.trim()) || /^KIND OF SITUATION:/.test(line);
    doc.setFont("helvetica", head ? "bold" : "normal"); doc.setFontSize(head ? 10.5 : 10);
    const parts = line ? doc.splitTextToSize(line, W - 2*M) : [""];
    parts.forEach(pt => { if (y > 770){ doc.addPage(); y = M + 30; } doc.text(pt, M, y); y += head ? LH + 2 : LH; });
  });
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++){
    doc.setPage(i); doc.setDrawColor(200); doc.setLineWidth(.6);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(156, 106, 22);
    doc.text("Making Decisions Together Field Guide", M, 34); doc.line(M, 42, W - M, 42);
    doc.line(M, 806, W - M, 806);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(110);
    doc.text("A field guide to making decisions together (Education edition)", M, 820);
    doc.text("CC BY-NC-ND 4.0 - 2026 We Learn, We Grow - welearnwegrow.bio", M, 831);
    doc.text(`${i} of ${n}`, W - M, 820, {align: "right"});
  }
  const bytes = new Uint8Array(doc.output("arraybuffer")), name = "guide-me-" + new Date().toISOString().slice(0, 10) + ".pdf";
  if (window.claude && window.claude.use){ const dl = await window.claude.use("downloads"); if (dl){ await dl.save({filename: name, data: new Blob([bytes], {type: "application/pdf"})}); return; } }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes], {type: "application/pdf"})); a.download = name; document.body.append(a); a.click(); a.remove();
}

/* feedback on the answer: in Claude, the reader's own fb doc; outside, the Worker */
async function feedback(rx, note, kind){
  const t = new Date().toISOString();
  if (window.claude && window.claude.use){
    try { const db = await window.claude.use("db"), u = await window.claude.use("user"); if (!db || !u) return false;
      const doc = db.doc("fb/" + await u.id()), snap = await doc.get(), d = (snap && (snap.data ? snap.data() : snap)) || {};
      const tool = (d.tool || []).concat([{r: rx, note: note || "", kind, t}]).slice(-50);
      await doc.set(Object.assign({}, d, {tool})); return true; } catch (e){ return false; }
  }
  const url = window.FG_FEEDBACK_URL; if (!url) return false;
  let vid = ""; try { vid = localStorage.getItem("fg_vid") || ""; } catch (e){}
  try { const res = await fetch(url, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({kind: "tool", example: "tool:" + (kind || "answer"), reaction: rx, note: note || "", page: location.pathname, visitor: vid})}); return res.ok; } catch (e){ return false; }
}

window.GUIDE = {prompt, ask, clean, render, feedback, transcript, saveTranscript, pdf, available: async () => {
  if (window.claude && window.claude.use){ try { if (await window.claude.use("sample")) return true; } catch (e){} }
  return !!window.FG_GUIDE_URL; }};
})();
