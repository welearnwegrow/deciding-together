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
    return `- ${s.id} | ${s.name} | ${FAMN[s.family]} | ${strip(s.line)}`; }).join("\n");
  const te = TECHS.map(({stage, t}) => `- ${t.id} | ${t.name} | stage: ${stage} | ${strip(t.for)}`).join("\n");
  const fo = FORCES.map(f => `- ${f.id} | ${f.name} | ${strip(f.what)}`).join("\n");
  return `STRUCTURES (ways to make the final decision):\n${st}\n\nSHAPING METHODS (ways to prepare a proposal before deciding):\n${te}\n\nSOCIAL FORCES (pressures inside groups):\n${fo}`;
}

const SCHEMA = `{
 "ask": [string],
 "approach": {"summary": string, "steps": [{"label": string, "role": "shape" | "decide" | "fallback" | "review", "kind": "structure" | "technique" | "none", "id": string, "because": string, "how": string, "key": boolean, "loop": boolean, "until": string}]},
 "forces": [{"id": string, "effect": "helps" | "watch", "step": number, "why": string, "do": string}]
}`;

function prompt(desc, answers, allowAsk){
  return `You are "Guide me", the decision guide inside "A field guide to making decisions together". A reader has described a decision they face. Your job is to help them choose HOW to make it: who takes part, in what order, and by what rule. You do not make the decision for them.

The reader may work in any field: a school, a company, a hospital, a council, a charity, a family business. Speak about roles (the person with authority, the people affected, the people who will carry it out), using the reader's own words and details. Never assume they work in education.

HOW TO THINK (briefly; keep the answer short)
1. Judge quietly what kind of situation this is, and let it shape the steps:
   - clear: the answer is known or there is an agreed rule. One person, or a simple rule, is enough.
   - complicated: there is an answer, but it takes expertise to find. Gather independent expert judgement first.
   - complex: no one can know in advance what will work. Prefer a small trial that can be undone, with a review date. Bring in the people closest to the problem; decide by consent where commitment matters.
   - chaotic: something is going wrong now. One person acts at once, then hands the wider decision back.
2. Give a flow of 3 to 6 steps in order. Each step has: a label of 2 to 5 words; a role ("shape" prepares the decision, "decide" is the moment it is made, "fallback" only if the group gets stuck or time runs out, "review"); "because": one short clause naming the detail in their description that makes this step needed (do not start it with "Because"); "how": one or two sentences on running it, naming who takes part. Mark "key" true on exactly one step, the moment of decision. Mark "loop" true only for a step the group repeats until something is true, and say that in "until"; otherwise "until" is "". In "summary", one sentence naming the approach.
3. Name two or three social forces their details point to. "why": what in their description makes it likely. "do": one concrete thing to do. "effect": "helps" or "watch". "step": the step number where it matters most, or 0.

RULES
- Use only catalogue items, by exact id. If a step needs none, use kind "none" and id "".
- Do not invent facts about the reader. Plain words, no praise, no filler, sentences under 25 words. Be specific to their situation.
${allowAsk ? `- If one to three missing facts would change your advice (for example: can it be undone, is there a deadline, who will carry it out, who has authority, how strong the disagreement is), put those questions in "ask" and leave every other field empty. Ask only what their description does not already answer. Otherwise leave "ask" empty and answer in full.` : `- Do not ask questions. "ask" must be empty. Answer in full.`}

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
  r.approach.steps.forEach(s => { s.role = ROLE[s.role] ? s.role : "shape"; s.because = String(s.because || "").replace(/^because\s+/i, ""); s.key = s.key === true; });
  const keys = r.approach.steps.filter(s => s.key); if (keys.length !== 1){ r.approach.steps.forEach(s => s.key = false); const d = r.approach.steps.find(s => s.role === "decide"); if (d) d.key = true; }
  r.crux = String(r.crux || ""); r.rule = String(r.rule || "");
  r.forces = (r.forces || []).filter(f => f && IDS.force.has(f.id)).map(f => (f.step = Math.max(0, Math.min(r.approach.steps.length, parseInt(f.step, 10) || 0)), f));
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
const MEANS = {
  complex: ["tries something small that can be undone, not a final answer", "brings in the people closest to the problem", "sets a date to look again"],
  complicated: ["gathers independent expert judgement", "compares options against criteria agreed first", "decides once the analysis is in"],
  chaotic: ["one person acts now to steady things", "tells people what was done and why", "hands the wider decision back to the group"],
  clear: ["follows the known answer or agreed rule", "keeps it simple: one person or a set rule is enough", "checks the rule still fits this case"]
};
const SV = {
  crux: '<svg viewBox="0 0 48 48" aria-hidden="true" class="gcico"><path d="M6 20l36-8" stroke="var(--ochre-deep)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 16l-8 22h16z" fill="var(--ochre)" stroke="var(--ochre-deep)" stroke-width="2" stroke-linejoin="round"/><circle cx="24" cy="16" r="2.5" fill="var(--ink)"/></svg>',
  rule: '<svg viewBox="0 0 48 48" aria-hidden="true" class="gcico"><path d="M12 26l7 7 17-18" fill="none" stroke="var(--ink-soft)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  first: '<svg viewBox="0 0 48 48" aria-hidden="true" class="gcico"><path d="M12 42V8M12 9h22l-5 7 5 7H12" fill="none" stroke="var(--ink-soft)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12M11 6l6 6-6 6"/></svg>',
  watch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>',
  help: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12l4 4 8-9"/></svg>',
  swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11l-3-3M20 17H9l3 3"/></svg>',
  dash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" stroke-dasharray="3 3"/></svg>',
  key: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" fill="var(--ochre)" stroke="none"/></svg>'
};
const RINGS = [["is told", "Are told"], ["is consulted", "Are asked"], ["shapes the proposal", "Shape it"], ["carries it out", "Carry it out"], ["decides", "Decide"]];
function render(r){
  const steps = r.approach.steps;
  const node = (s, i) => `<li class="gnode${s.loop ? " loops" : ""}${s.key ? " key" : ""}${s.role === "fallback" ? " gfall" : ""}"><details><summary><span class="gnum">${i + 1}</span><span class="glab">${s.key ? `<em class="gkey">The decision</em>` : s.role === "fallback" ? `<em class="grole">Only if stuck</em>` : s.role === "review" ? `<em class="grole">Review</em>` : ""}<b>${esc(s.label || ROLE[s.role] || "")}</b>${s.kind === "none" ? "" : `<small>${s.kind === "structure" ? "Structure" : "Method"}: ${link(s.kind, s.id)}</small>`}${s.because ? `<span class="gbec"><i>Because</i> ${esc(s.because)}</span>` : ""}</span>${s.loop ? LOOP : ""}</summary>
      <div class="gdet">${s.how ? `<p>${esc(s.how)}</p>` : ""}${s.loop && s.until ? `<p class="guntil">Repeat until ${esc(s.until.replace(/^until\s+/i, ""))}</p>` : ""}${(r.forces.filter(f => f.step === i + 1)).map(f => `<p class="gfat">${f.effect === "helps" ? "May help here" : "Watch for here"}: ${link("force", f.id)}</p>`).join("")}</div></details></li>`;
  const help = r.forces.filter(f => f.effect === "helps"), watch = r.forces.filter(f => f.effect !== "helps");
  const fl = a => a.map(f => `<li><span class="gfn">${link("force", f.id)}${f.step ? `<span class="gfstep">step ${f.step}</span>` : ""}</span><p>${esc(f.why)}</p>${f.do ? `<p class="gdo">${esc(f.do)}</p>` : ""}</li>`).join("");
  const sec = (cls, icon, h, body) => `<section class="gsec ${cls}"><h3>${ic(icon)}<span>${h}</span></h3>${body}</section>`;
  return [
    sec("b-how", "how", "How to decide", `${r.approach.summary ? `<p class="glead">${esc(r.approach.summary)}</p>` : ""}<p class="gtip">Click a step for how to run it. ${LOOP}<span> marks a step to repeat.</span></p><ol class="gflow">${steps.map(node).join("")}</ol>`),
    r.forces.length ? sec("b-forces", "forces", "Social forces to call out", `<div class="gfcols">${watch.length ? `<div class="watch"><h4>Watch for</h4><ul>${fl(watch)}</ul></div>` : ""}${help.length ? `<div class="help"><h4>May help</h4><ul>${fl(help)}</ul></div>` : ""}</div>`) : ""
  ].join("");
}
/* the carousel: tabs, dots, buttons, swipe, arrow keys; steps open on click */
function mount(root){
  if (!root) return;
  const track = root.querySelector(".gctrack"), slides = [...track.children], tabs = root.querySelector(".gctabs"), dots = root.querySelector(".gcdots");
  const prev = root.querySelector(".gcprev"), next = root.querySelector(".gcnext");
  let cur = 0;
  slides.forEach((s, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab");
    b.innerHTML = `<span class="n">${i + 1}</span><span class="t">${s.dataset.t}</span>`; b.onclick = () => go(i); tabs.append(b); dots.append(document.createElement("i")); });
  const fit = () => { track.style.height = slides[cur].offsetHeight + "px"; };
  const mark = () => { [...tabs.children].forEach((b, i) => b.setAttribute("aria-selected", i === cur)); [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
    prev.disabled = cur === 0; next.disabled = cur === slides.length - 1; next.textContent = cur < slides.length - 1 ? slides[cur + 1].dataset.t + " →" : "End"; };
  const go = i => { cur = Math.max(0, Math.min(slides.length - 1, i)); fit(); track.scrollTo({left: slides[cur].offsetLeft - track.offsetLeft, behavior: "smooth"}); mark(); };
  prev.onclick = () => go(cur - 1); next.onclick = () => go(cur + 1);
  let t; track.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(() => { const i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur){ cur = i; mark(); fit(); } }, 90); });
  root.addEventListener("keydown", e => { if (e.target.closest("input, textarea")) return; if (e.key === "ArrowRight"){ e.preventDefault(); go(cur + 1); } if (e.key === "ArrowLeft"){ e.preventDefault(); go(cur - 1); } });
  root.querySelectorAll(".gcstep").forEach(s => { const flip = () => { s.setAttribute("aria-expanded", s.getAttribute("aria-expanded") !== "true"); fit(); };
    s.addEventListener("click", e => { if (!e.target.closest("a")) flip(); });
    s.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === s){ e.preventDefault(); flip(); } }); });
  if (window.ResizeObserver) new ResizeObserver(fit).observe(slides[0].parentNode); addEventListener("resize", fit);
  mark(); fit(); setTimeout(fit, 300);
}

/* a plain-text transcript, for Notion and the PDF */
function transcript(desc, qa, r){
  const L = [];
  L.push("DESCRIPTION", desc, "");
  if (qa && qa.length){ L.push("QUESTIONS AND ANSWERS"); qa.forEach(x => L.push("Q: " + x.q, "A: " + (x.a || "(skipped)"))); L.push(""); }
  if (r){
    const nm = s => s.kind === "structure" ? S[s.id].name : s.kind === "technique" ? (TECHS.find(x => x.t.id === s.id) || {t:{name:""}}).t.name : "";
    L.push("HOW TO DECIDE", r.approach.summary || "");
    r.approach.steps.forEach((s, i) => { L.push(`${i + 1}. ${s.label || ""}${nm(s) ? " (" + nm(s) + ")" : ""}${s.key ? " [THE DECISION]" : ""}${s.role === "fallback" ? " [only if stuck]" : ""}${s.loop ? " [repeat until " + String(s.until || "").replace(/^until\s+/i, "") + "]" : ""}`);
      if (s.because) L.push("   Because " + s.because); if (s.how) L.push("   " + s.how); });
    L.push("");
    if (r.forces.length){ L.push("SOCIAL FORCES TO CALL OUT"); r.forces.forEach(f => { const ff = FORCES.find(x => x.id === f.id); L.push(`- ${ff.name} (${f.effect === "helps" ? "may help" : "watch for"}${f.step ? ", at step " + f.step : ""}): ${f.why}${f.do ? " Do: " + f.do : ""}`); }); }
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

window.GUIDE = {prompt, ask, clean, render, mount, feedback, transcript, saveTranscript, pdf, available: async () => {
  if (window.claude && window.claude.use){ try { if (await window.claude.use("sample")) return true; } catch (e){} }
  return !!window.FG_GUIDE_URL; }};
})();
