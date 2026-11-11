"use strict";
/* ---------- lookups and links ---------- */
const S = {}; FG.structures.forEach(s => S[s.id] = s);
const F = {}; FG.forces.forEach(f => F[f.id] = f);
const FAM = {}; FG.families.forEach(f => FAM[f.id] = f);
const hy = id => id.replace(/_/g, "-");
const unhy = h => h.replace(/-/g, "_");
const built = id => !!FG.entries[id];
const sHref = id => "index.html#" + hy(id);
const fHref = id => "forces.html#" + hy(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function chipFor(id){
  if (F[id]) { const f = F[id];
    return `<a class="chip force" href="${fHref(id)}">${esc(f.name)}</a>`; }
  const s = S[id]; if (!s) return "";
  return built(id) ? `<a class="chip" href="${sHref(id)}">${esc(s.name)}</a>`
                   : `<a class="chip draft" href="${sHref(id)}" title="Full entry in the next pass">${esc(s.name)}</a>`;
}
function evRow(refs, label){
  if (!refs || !refs.length) return "";
  return `<p class="ev"><b>${label || "Sources"}</b>${refs.map(r => FG.refs[r] ? `<a href="about.html#${r}">${FG.refs[r].cite}</a>` : "").join("<span aria-hidden='true'>·</span>")}</p>`;
}

/* ---------- editable text: keys, overrides, edit mode ---------- */
const EDITS = {};          // key -> {v, html}
const ORIG = {};           // key -> original value from the source files
let DB = null, CAN_EDIT = false, EDITING = false;
function E(key, html){ return ` data-edit="${key}"${html ? ' data-html="1"' : ""}`; }
function resolveKey(key){
  // returns [object, field] for data keys, or null for page text (dom:)
  const [kind, id, ...rest] = key.split(":"); const path = rest.join(":");
  let obj = null;
  if (kind === "fam") obj = FG.families.find(x => x.id === id);
  else if (kind === "str") obj = FG.structures.find(x => x.id === id);
  else if (kind === "frc") obj = FG.forces.find(x => x.id === id);
  else if (kind === "myth") obj = FG.myths[+id];
  else if (kind === "ent") obj = FG.entries[id];
  else if (kind === "tq") obj = FG.tool.questions.find(x => x.id === id);
  else if (kind === "tp") obj = FG.tool.presets.find(x => x.id === id);
  else return null;
  if (!obj) return null;
  const parts = path.split(".");
  for (let i = 0; i < parts.length - 1; i++){ obj = obj[parts[i]]; if (obj == null) return null; }
  return [obj, parts[parts.length - 1]];
}
function setKey(key, v){
  const r = resolveKey(key); if (!r) return;
  if (!(key in ORIG)) ORIG[key] = r[0][r[1]];
  r[0][r[1]] = v;
}
function cleanHTML(html){
  const t = document.createElement("template"); t.innerHTML = html;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) return;
      if (n.nodeType !== 1){ n.remove(); return; }
      const tag = n.tagName.toLowerCase();
      const quote = tag === "span" && n.getAttribute("class") === "assume";
      if (!quote && !["b","strong","i","em","a","br"].includes(tag)){ walk(n); n.replaceWith(...n.childNodes); return; }
      [...n.attributes].forEach(a => { if (!(tag === "a" && a.name === "href") && !(quote && a.name === "class")) n.removeAttribute(a.name); });
      if (tag === "a"){ const h = n.getAttribute("href") || ""; if (!/^(https:\/\/|[a-z]+\.html|#|evidence|forces|tool|myths|index)/i.test(h)) n.removeAttribute("href"); }
      walk(n);
    });
  };
  walk(t.content);
  return t.innerHTML.replace(/&nbsp;/g, " ").trim();
}
function applyDom(root){
  (root || document).querySelectorAll("[data-edit]").forEach(el => {
    const k = el.dataset.edit;
    if (!el.dataset.orig) el.dataset.orig = el.dataset.html ? el.innerHTML : el.textContent;
    if (k.startsWith("dom:") && EDITS[k]){
      if (!(k in ORIG)) ORIG[k] = el.dataset.orig;
      if (EDITS[k].html) el.innerHTML = cleanHTML(EDITS[k].v); else el.textContent = EDITS[k].v;
      el.dataset.orig = el.dataset.html ? el.innerHTML : el.textContent;
    }
    if (EDITING) makeEditable(el);
  });
}
async function loadEdits(){
  /* static copy (outside Claude): text changes are baked into edits.js */
  if (window.FG_EDITS) Object.entries(window.FG_EDITS).forEach(([id, x]) => { EDITS[id] = {v: x.v, html: !!x.html}; if (!id.startsWith("dom:")) setKey(id, x.v); });
  if (!(window.claude && window.claude.use)) return;
  const timeout = new Promise(res => setTimeout(() => res(null), 3000));
  const got = await Promise.race([
    window.claude.use("db").then(async db => { DB = db; if (!db) return null; return db.collection("edits").limit(1000).get(); }).catch(() => null),
    timeout
  ]);
  if (!got) return;
  got.docs.forEach(d => { const x = d.data(); if (!x || typeof x.v !== "string") return; EDITS[d.id] = {v: x.v, html: !!x.html}; if (!d.id.startsWith("dom:")) setKey(d.id, x.v); });
}
function toast(msg){
  let t = document.getElementById("edToast");
  if (!t){ t = document.createElement("div"); t.id = "edToast"; t.className = "edtoast"; t.setAttribute("role","status"); document.body.append(t); }
  t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 2600);
}
function makeEditable(el){
  if (el._ed) return; el._ed = true;
  el.setAttribute("contenteditable", el.dataset.html ? "true" : "plaintext-only");
  if (el.contentEditable !== "plaintext-only" && !el.dataset.html) el.setAttribute("contenteditable", "true");
  el.spellcheck = true;
  el.addEventListener("keydown", onEdKey); el.addEventListener("blur", onEdBlur); el.addEventListener("focus", onEdFocus);
}
function unmakeEditable(el){
  if (!el._ed) return; el._ed = false; el.removeAttribute("contenteditable");
  el.removeEventListener("keydown", onEdKey); el.removeEventListener("blur", onEdBlur); el.removeEventListener("focus", onEdFocus);
}
let FOCUSED = null;
function onEdFocus(e){ FOCUSED = e.currentTarget; const b = document.getElementById("edReset"); if (b) b.disabled = !(FOCUSED.dataset.edit in EDITS); }
function onEdKey(e){
  const el = e.currentTarget;
  if (e.key === "Escape"){ e.preventDefault(); if (el.dataset.html) el.innerHTML = el.dataset.orig; else el.textContent = el.dataset.orig; el.blur(); }
  if (e.key === "Enter" && !el.dataset.html){ e.preventDefault(); el.blur(); }
}
async function onEdBlur(e){
  const el = e.currentTarget, key = el.dataset.edit, html = !!el.dataset.html;
  const v = html ? cleanHTML(el.innerHTML) : el.textContent.replace(/\s+/g, " ").trim();
  const before = html ? cleanHTML(el.dataset.orig) : el.dataset.orig.replace(/\s+/g, " ").trim();
  if (v === before) return;
  if (!v){ if (html) el.innerHTML = el.dataset.orig; else el.textContent = el.dataset.orig; toast("Text can't be empty. Use Reset to go back to the original."); return; }
  try {
    await DB.collection("edits").doc(key).set({v, html, page: window.PAGE || "", at: new Date().toISOString()});
    EDITS[key] = {v, html};
    if (!key.startsWith("dom:")) setKey(key, v);
    document.querySelectorAll(`[data-edit="${CSS.escape(key)}"]`).forEach(o => { if (o !== el){ if (html) o.innerHTML = v; else o.textContent = v; } o.dataset.orig = html ? o.innerHTML : o.textContent; });
    if (html) el.innerHTML = v;
    el.dataset.orig = html ? el.innerHTML : el.textContent;
    toast("Saved");
  } catch (err){
    toast(err && err.code === "quota_exceeded" ? "Couldn't save: this page's storage is full." : "Couldn't save that change. Check your connection and try again.");
  }
}
async function resetFocused(){
  const el = FOCUSED; if (!el) return; const key = el.dataset.edit; if (!(key in EDITS)) return;
  try {
    await DB.collection("edits").doc(key).delete();
    delete EDITS[key];
    let orig = ORIG[key];
    if (orig == null) orig = el.dataset.orig;
    if (!key.startsWith("dom:")) setKey(key, orig);
    document.querySelectorAll(`[data-edit="${CSS.escape(key)}"]`).forEach(o => { if (o.dataset.html) o.innerHTML = orig; else o.textContent = orig; o.dataset.orig = o.dataset.html ? o.innerHTML : o.textContent; });
    toast("Back to the original text");
  } catch (err){ toast("Couldn't reset that text. Try again."); }
}
function setEditing(on){
  EDITING = on; document.documentElement.classList.toggle("editing", on);
  document.querySelectorAll("[data-edit]").forEach(el => on ? makeEditable(el) : unmakeEditable(el));
  const bar = document.getElementById("edBar");
  bar.querySelector("#edToggle").textContent = on ? "Done editing" : "Edit text";
  bar.querySelector("#edHint").hidden = !on; bar.querySelector("#edReset").hidden = !on;
}
async function initEditing(){
  if (!(window.claude && window.claude.use) || !DB) return;
  try { const u = await window.claude.use("user"); CAN_EDIT = !!(u && await u.canEdit()); } catch (e){ CAN_EDIT = false; }
  if (!CAN_EDIT) return;
  const bar = document.createElement("div"); bar.id = "edBar"; bar.className = "edbar";
  bar.innerHTML = `<span id="edHint" hidden>Click any outlined text to change it. Changes save when you click away. Esc cancels.</span><button class="btn" type="button" id="edReset" hidden disabled>Reset this text</button><button class="btn solid" type="button" id="edToggle">Edit text</button>`;
  document.body.append(bar);
  bar.querySelector("#edToggle").onclick = () => setEditing(!EDITING);
  bar.querySelector("#edReset").addEventListener("mousedown", e => e.preventDefault());
  bar.querySelector("#edReset").onclick = resetFocused;
  // in edit mode, clicking editable text inside a link edits it instead of following the link
  document.addEventListener("click", e => { if (EDITING && e.target.closest("[data-edit]") && e.target.closest("a")){ e.preventDefault(); e.stopImmediatePropagation(); } }, true);
}

/* ---------- share: each structure, force and method has its own public link ---------- */
const PUBLIC_URL = "https://welearnwegrow.github.io/deciding-together/";
const SHARE_DIR = {s:"s", f:"f", m:"m"};
const shareURL = (k, id) => PUBLIC_URL + SHARE_DIR[k] + "/" + hy(id) + "/";
const SHARE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>';
function shareBtn(k, id, title, line){
  return `<span class="shr"><button type="button" class="shbtn" data-share="${k}" data-id="${esc(id)}" data-title="${esc(title)}" data-line="${esc(firstSentence(strip0(line || "")))}" aria-haspopup="true" aria-expanded="false">${SHARE_ICON}<span>Share</span></button><span class="shmenu" hidden></span></span>`;
}
function strip0(s){ return String(s).replace(/<[^>]+>/g, ""); }
function setShare(btn, k, id, title, line){ if (!btn) return; Object.assign(btn.dataset, {share: k, id, title, line: firstSentence(strip0(line || ""))}); }
document.addEventListener("click", async e => {
  const b = e.target.closest(".shbtn");
  document.querySelectorAll(".shmenu:not([hidden])").forEach(m => { if (!b || m !== b.nextElementSibling){ m.hidden = true; m.previousElementSibling.setAttribute("aria-expanded", "false"); } });
  if (b){ e.preventDefault(); e.stopPropagation();
    const m = b.nextElementSibling; if (!m.hidden){ m.hidden = true; b.setAttribute("aria-expanded", "false"); return; }
    const d = b.dataset, url = shareURL(d.share, d.id), text = `${d.title}${d.line ? " — " + d.line : ""}`;
    const wa = "https://wa.me/?text=" + encodeURIComponent(text + "\n" + url);
    const native = navigator.share && !(window.claude && window.claude.use);
    m.innerHTML = `<a href="${wa}" target="_blank" rel="noopener" class="wa"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.4 1.8 2.5 2.4.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.2.3.4 0 .6-.3 1.4-1 1.7-.7.3-1.6.4-3.4-.4a9 9 0 0 1-3.6-3.3c-.7-1.1-.8-2.2-.5-3z"/></svg>WhatsApp</a>
      <button type="button" class="cp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>Copy link</button>
      ${native ? `<button type="button" class="nt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>More…</button>` : ""}
      <span class="shurl" hidden>${esc(url)}</span>`;
    m.hidden = false; b.setAttribute("aria-expanded", "true");
    m.querySelector(".cp").onclick = async ev => { ev.stopPropagation(); const c = ev.currentTarget;
      try { await navigator.clipboard.writeText(url); c.lastChild.textContent = "Link copied"; }
      catch (er){ const u = m.querySelector(".shurl"); u.hidden = false; c.lastChild.textContent = "Copy this link:";
        const r = document.createRange(); r.selectNodeContents(u); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); } };
    const nt = m.querySelector(".nt"); if (nt) nt.onclick = async ev => { ev.stopPropagation(); try { await navigator.share({title: d.title, text, url}); } catch (er){} };
    return; }
  if (!e.target.closest(".shmenu")) return;
});

/* ---------- page chrome ---------- */
const PAGES = [["index.html","Structures","path"],["forces.html","Social forces","forces"],["shaping.html","Shaping proposals","shaping"],["about.html","About","about"]];
function chrome(){
  const cur = window.PAGE;
  const top = document.createElement("header"); top.className = "top";
  top.innerHTML = `<div class="wrap"><a class="brand" href="index.html"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle class="d" cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="11"/></svg>A field guide to making decisions together</a>
    <nav aria-label="Sections">${PAGES.map(p => `<a href="${p[0]}"${p[2]===cur?' aria-current="page"':''}>${p[1]}</a>`).join("")}<a class="gme" href="tool.html"${cur==="tool"?' aria-current="page"':''}><span aria-hidden="true">✦</span> Guide me</a></nav></div>`;
  document.body.prepend(top);
  const ft = document.createElement("footer"); ft.className = "site";
  ft.innerHTML = `<div class="wrap">
    <div class="fl"><a class="brand" href="index.html"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle class="d" cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="11"/></svg>A field guide to making decisions together (Education edition)</a></div>
    <div class="fr"><p><a href="assets.html">Brand assets</a> · <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener">CC BY-NC-ND 4.0</a> · 2026 <a class="wl" href="https://welearnwegrow.bio" target="_blank" rel="noopener">We Learn, We Grow</a></p>
      </div></div>`;
  document.body.append(ft);
}

/* ---------- colours from tokens ---------- */
let C = {};
function readColors(){
  const cs = getComputedStyle(document.documentElement);
  ["paper","paper-2","ink","ink-soft","ink-mute","line","ochre","sage","terra","loop-r","loop-b"].forEach(k => C[k] = cs.getPropertyValue("--"+k).trim());
}
function hex2rgb(h){ h = h.replace("#",""); if (h.length===3) h = h.split("").map(c=>c+c).join(""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)); }
function toRgb(c){ const m = /^rgb\((\d+),(\d+),(\d+)\)$/.exec(String(c).replace(/\s/g,"")); return m ? [+m[1], +m[2], +m[3]] : hex2rgb(c); }
function mix(a,b,t){ const A=toRgb(a),B=toRgb(b); return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(",")})`; }

/* ---------- causal loop diagrams ---------- */
function wrapText(str, max){
  const words = str.split(" "); const lines = []; let cur = "";
  words.forEach(w => { if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
  if (cur) lines.push(cur); return lines;
}
let cldN = 0;
function cldSVG(loop){
  const n = loop.nodes.length, W = 520, H = n === 3 ? 330 : 360, cx = W/2, cy = H/2 + 4;
  const rx = n === 3 ? 165 : 180, ry = n === 3 ? 112 : 128;
  const col = loop.tone ? (loop.tone === "good" ? "var(--good)" : "var(--bad)") : loop.type === "R" ? "var(--loop-r)" : "var(--loop-b)";
  const uid = "m" + (++cldN);
  const nodes = loop.nodes.map((t, i) => {
    const a = -Math.PI/2 + i * 2*Math.PI/n;
    const lines = wrapText(t, 19);
    return {x: cx + rx*Math.cos(a), y: cy + ry*Math.sin(a), lines, hw: Math.max(...lines.map(l=>l.length))*3.9 + 8, hh: lines.length*9 + 8};
  });
  const inside = (p, nd) => Math.abs(p[0]-nd.x) < nd.hw && Math.abs(p[1]-nd.y) < nd.hh;
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${loop.type === "R" ? "Reinforcing" : "Balancing"} loop: ${esc(loop.nodes.join(", then "))}, and back.">
  <defs><marker id="${uid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>
  <marker id="${uid}c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--terra)"/></marker></defs>`;
  nodes.forEach((a, i) => {
    const b = nodes[(i+1) % n];
    const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
    const k = n === 3 ? 0.42 : 0.5;
    const qx = mx + (mx-cx)*k, qy = my + (my-cy)*k;
    const pts = [];
    for (let s = 0; s <= 80; s++){ const t = s/80, u = 1-t;
      pts.push([u*u*a.x + 2*u*t*qx + t*t*b.x, u*u*a.y + 2*u*t*qy + t*t*b.y]); }
    let i0 = 0; while (i0 < pts.length-1 && inside(pts[i0], a)) i0++;
    let i1 = pts.length-1; while (i1 > 0 && inside(pts[i1], b)) i1--;
    const seg = pts.slice(i0+2, i1-1);
    if (seg.length < 2) return;
    const cut = loop.cut === i;
    const d = "M" + seg.map(p => p[0].toFixed(1)+","+p[1].toFixed(1)).join(" L");
    out += `<path d="${d}" fill="none" stroke="${cut ? "var(--terra)" : col}" stroke-width="1.8" ${cut ? 'stroke-dasharray="5 5"' : ""} marker-end="url(#${uid}${cut?"c":""})"/>`;
    const sp = seg[Math.floor(seg.length*0.78)];
    const ox = (sp[0]-cx), oy = (sp[1]-cy), L = Math.hypot(ox,oy) || 1;
    const lx = sp[0] + ox/L*14, ly = sp[1] + oy/L*14;
    out += `<text x="${lx.toFixed(1)}" y="${(ly+5).toFixed(1)}" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="17" font-weight="500" fill="${col}">${loop.signs[i]}</text>`;
    if (cut){ const m = seg[Math.floor(seg.length/2)];
      out += `<g transform="translate(${m[0].toFixed(1)},${m[1].toFixed(1)})"><circle r="11" fill="var(--paper)" stroke="var(--terra)" stroke-width="1.5"/><path d="M-4,-4 L4,4 M4,-4 L-4,4" stroke="var(--terra)" stroke-width="2"/></g>`; }
  });
  nodes.forEach(nd => {
    const y0 = nd.y - (nd.lines.length-1)*9 + 5;
    out += `<text text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="14.5" fill="var(--ink)">${nd.lines.map((l,j)=>`<tspan x="${nd.x.toFixed(1)}" y="${(y0 + j*18).toFixed(1)}">${esc(l)}</tspan>`).join("")}</text>`;
  });
  // loop marker
  const rr = loop.tone ? 40 : 24;
  out += `<g transform="translate(${cx},${cy})"><path d="M 0,-${rr} A ${rr} ${rr} 0 1 1 -${(rr*.92).toFixed(1)},-${(rr*.38).toFixed(1)}" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="2 3" marker-end="url(#${uid})"/>
    ${loop.tone ? (loop.type === "R" ? ["builds on","itself"] : ["keeps it","in check"]).map((w,k) => `<text y="${-2 + k*16}" text-anchor="middle" font-family="DM Sans, Arial, sans-serif" font-size="13" font-weight="500" fill="${col}">${w}</text>`).join("") : `<text y="8" text-anchor="middle" font-family="DM Serif Display, Georgia, serif" font-size="22" fill="${col}">${loop.type}</text>`}</g>`;
  return out + "</svg>";
}
function loopFigure(loop, extra){
  return `<figure class="loopfig">${cldSVG(loop)}<figcaption>${extra && /^A (reinforcing|balancing)/.test(extra) ? extra : (loop.type === "R" ? "A reinforcing loop: each turn makes the next one stronger." : "A balancing loop: each turn pulls things back toward a goal.") + (extra ? " " + extra : "")}</figcaption></figure>`;
}

/* ---------- other systems models: iceberg, fishbone, causal layered analysis ---------- */
function svgText(lines, x, y0, lh, opts){
  opts = opts || {};
  return `<text x="${x}" y="${y0}" text-anchor="${opts.anchor||"start"}" font-family="DM Sans, Arial, sans-serif" font-size="${opts.fs||14}" ${opts.w?`font-weight="${opts.w}"`:""} fill="${opts.fill||"var(--ink)"}">${lines.map((l,j)=>`<tspan x="${x}" y="${(y0+j*lh).toFixed(1)}">${esc(l)}</tspan>`).join("")}</text>`;
}
function icebergSVG(m){
  const W = 640, bandH = 96, top = 18, n = m.layers.length, H = top + bandH*n + 14;
  const cx = 190, halfW = [92, 124, 158, 190];
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Iceberg model: ${esc(m.layers.map(l=>l[0]+": "+l[1]).join(" "))}">`;
  out += `<rect x="0" y="${top+bandH-4}" width="${W}" height="${H-top-bandH+4}" fill="var(--teal)" opacity=".08"/>`;
  out += `<path d="M0 ${top+bandH-4} q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0" fill="none" stroke="var(--teal)" stroke-width="1.4"/>`;
  for (let i=0;i<n;i++){
    const y = top + i*bandH, w0 = i===0 ? 8 : halfW[i-1], w1 = halfW[i];
    out += `<path d="M${cx-w0} ${y} L${cx+w0} ${y} L${cx+w1} ${y+bandH} L${cx-w1} ${y+bandH} Z" fill="${i===0 ? "var(--paper)" : "var(--teal)"}" fill-opacity="${i===0 ? 1 : .12 + i*.1}" stroke="var(--ink)" stroke-width="1.2"/>`;
    const lines = wrapText(m.layers[i][0], i === 0 ? 13 : 18), ly = y + (i === 0 ? bandH - 12 - (lines.length - 1)*16 : bandH/2 + 6 - (lines.length - 1)*8.5);
    out += svgText(lines, cx, ly, 17, {fs:14, w:700, anchor:"middle", fill:"var(--ink)"});
    out += svgText(wrapText(m.layers[i][1], 30), 410, y + 30, 20, {fs:15.5});
  }
  return out + `</svg>`;
}
function fishboneSVG(m){
  const W = 820, H = 340, sy = 170, x0 = 20, x1 = 640;
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fishbone diagram. Outcome: ${esc(m.effect)}. Causes: ${esc(m.bones.map(b=>b[0]+": "+b[1].join(", ")).join("; "))}">`;
  out += `<line x1="${x0}" y1="${sy}" x2="${x1}" y2="${sy}" stroke="var(--ink)" stroke-width="2"/>`;
  out += `<path d="M${x1} ${sy-48} L${x1+10} ${sy-48} Q ${W-6} ${sy} ${x1+10} ${sy+48} L${x1} ${sy+48} Z" fill="var(--ochre)" fill-opacity=".22" stroke="var(--ochre-deep)" stroke-width="1.4"/>`;
  out += svgText(wrapText(m.effect, 18), x1+14, sy-22, 17, {fs:13.5, w:700});
  const xs = [210, 480];
  m.bones.forEach((b,i) => {
    const up = i%2===0, bx = xs[Math.floor(i/2)], ex = bx-100, ey = up ? sy-130 : sy+130;
    out += `<line x1="${bx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="var(--ink-soft)" stroke-width="1.4"/>`;
    out += svgText([b[0]], ex, up ? ey-10 : ey+20, 16, {fs:13, w:700, fill:"var(--label)", anchor:"middle"});
    b[1].forEach((c,k) => {
      const t = (k+1)/(b[1].length+1), px = bx + (ex-bx)*t, py = sy + (ey-sy)*t;
      out += `<line x1="${px}" y1="${py}" x2="${px+26}" y2="${py}" stroke="var(--line)" stroke-width="1.2"/>`;
      out += svgText([c], px+32, py+4, 15, {fs:13});
    });
  });
  return out + `</svg>`;
}
function chainSVG(m){
  const n = m.steps.length, W = 820, colW = W / n, top = 26, H = 168;
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Chain: ${esc(m.steps.map(st => st[0] + " says: " + st[1]).join(" Then "))}">`;
  m.steps.forEach((st, i) => {
    const x = i*colW + 12, cx = i*colW + colW/2, op = 1 - i*0.12;
    out += `<circle cx="${x+10}" cy="${top}" r="9" fill="var(--ochre)" fill-opacity="${.9 - i*.15}"/>`;
    out += svgText([st[0]], x+26, top+5, 16, {fs:13, w:700, fill:"var(--label)"});
    out += `<text x="${x}" y="${top+52}" font-family="DM Serif Display, Georgia, serif" font-size="34" fill="var(--ochre)" opacity=".55">“</text>`;
    out += svgText(wrapText(st[1], 22), x+2, top+62, 19, {fs:14.5, fill:`color-mix(in srgb, var(--ink) ${Math.round(op*100)}%, var(--ink-mute))`});
    if (i < n-1) out += `<line x1="${(i+1)*colW - 30}" y1="${top}" x2="${(i+1)*colW - 4}" y2="${top}" stroke="var(--ink-soft)" stroke-width="1.4" marker-end="url(#chArr)"/>`;
  });
  out = out.replace(">", `><defs><marker id="chArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="var(--ink-soft)"/></marker></defs>`);
  return out + `</svg>`;
}
function crowdSVG(m){
  const W = 820, H = 300, x0 = 60, x1 = 780, X = v => x0 + v * (x1 - x0), truth = .5;
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(m.rows.map(r => r.label).join(". "))}">`;
  out += `<line x1="${X(truth)}" y1="22" x2="${X(truth)}" y2="${H-20}" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 4"/>`;
  out += svgText([m.truth || "The right answer"], X(truth), 16, 14, {fs:13, w:700, anchor:"middle"});
  m.rows.forEach((r, k) => { const y = 92 + k*120, col = r.tone === "bad" ? "var(--bad)" : "var(--good)";
    out += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--line)" stroke-width="1.2"/>`;
    out += svgText([r.label], x0, y - 34, 15, {fs:13.5, w:700, fill:col});
    r.dots.forEach((v, i) => { out += `<circle cx="${X(v)}" cy="${y + ((i % 3) - 1) * 9}" r="6" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="1.2"/>`; });
    const avg = r.dots.reduce((a,b) => a+b, 0) / r.dots.length;
    out += `<path d="M${X(avg)} ${y+20} l-8 12 h16 z" fill="${col}"/>`;
    out += svgText([r.avg], X(avg), y + 48, 14, {fs:12.5, anchor:"middle", fill:col});
  });
  return out + `</svg>`;
}
function claHTML(m){
  return `<ol class="cla" aria-label="Causal layered analysis, from surface to depth">${m.layers.map((l,i)=>`<li style="--d:${i}"><span class="k">${esc(l[0])}</span><span>${l[1]}</span></li>`).join("")}</ol>`;
}
const MODEL_NAMES = {loop:"Feedback loop", iceberg:"Iceberg model", fishbone:"Fishbone diagram", cla:"Causal layered analysis", chain:"Chain"};
function modelFigure(m, loop, tone){
  if (!m) return loopFigure(loop, loop.note);
  const body = m.type === "iceberg" ? icebergSVG(m) : m.type === "fishbone" ? fishboneSVG(m) : m.type === "chain" ? chainSVG(m) : m.type === "crowd" ? crowdSVG(m) : claHTML(m);
  return `<figure class="loopfig model ${tone || ""}"><div class="mbody">${body}</div><figcaption>${m.note || ""}</figcaption></figure>`;
}

/* ---------- animation engine ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const ph = (t,a,b) => clamp((t-a)/(b-a), 0, 1);
const ease = x => x<.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2;
const lerp = (a,b,t) => a + (b-a)*t;
const VW = 800, VH = 500;
let FSK = 1, CAP = null;
const WORDLESS = true; // drawings carry no words; captions sit under the animation

function opColor(v){ // v: 0 = view A (ochre), 1 = view B (sage), null = undecided
  if (v === null || v === undefined) return C["paper-2"];
  v = clamp(v,0,1); const mid = mix(mix(C.ochre, C.sage, .5), C.paper, .35);
  return v < .5 ? mix(C.ochre, mid, v*2) : mix(mid, C.sage, (v - .5)*2);
}
function actor(g, x, y, r, o){
  o = o || {};
  g.save(); g.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.ring){ g.save(); g.setLineDash([2.5,4]); g.lineWidth = 3; g.strokeStyle = C.ochre; g.globalAlpha *= o.ring;
    g.beginPath(); g.arc(x,y,r+9,0,Math.PI*2); g.stroke(); g.restore(); }
  g.beginPath(); g.arc(x,y,r,0,Math.PI*2);
  g.fillStyle = o.empty ? "transparent" : opColor(o.v); g.fill();
  g.lineWidth = o.decider ? 3.4 : 1.4; g.strokeStyle = o.empty ? C.line : C.ink;
  if (o.empty) g.setLineDash([3,3]);
  g.stroke(); g.setLineDash([]);
  if (o.inner != null){ g.beginPath(); g.arc(x,y,r*0.38,0,Math.PI*2); g.fillStyle = opColor(o.inner); g.fill(); g.lineWidth = 1; g.strokeStyle = C.paper; g.stroke(); }
  if (o.label && !WORDLESS){ g.fillStyle = C["ink-soft"]; g.font = `${(o.fs||14)*FSK}px DM Sans, Arial, sans-serif`; g.textAlign = "center"; g.textBaseline = "top";
    String(o.label).split("\n").forEach((l,i) => g.fillText(l, x, y + r + (o.ring ? 13 : 7) + i*16*FSK)); }
  g.restore();
}
function caption(g, text, sub){
  if (WORDLESS && !CAP) return;
  if (CAP){ const k = text + "|" + (sub||""); if (CAP.dataset.k !== k){ CAP.dataset.k = k; CAP.innerHTML = `<b>${esc(text)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}`; } return; }
  g.fillStyle = C.ink; g.font = "500 17px DM Sans, Arial, sans-serif"; g.textAlign = "left"; g.textBaseline = "top";
  g.fillText(text, 24, 20);
  if (sub){ g.fillStyle = C["ink-mute"]; g.font = "14px DM Sans, Arial, sans-serif"; g.fillText(sub, 24, 44); }
}
function line(g, x1,y1,x2,y2, col, w, dash){ g.save(); g.strokeStyle = col; g.lineWidth = w||1; if (dash) g.setLineDash(dash); g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke(); g.restore(); }
function dot(g,x,y,r,col){ g.beginPath(); g.arc(x,y,r,0,Math.PI*2); g.fillStyle = col; g.fill(); }
function text(g, s, x, y, o){ if (WORDLESS) return; o=o||{}; g.fillStyle = o.col || C["ink-soft"]; g.font = `${o.w||400} ${(o.fs||14)*FSK}px ${o.serif ? "DM Serif Display, Georgia, serif" : "DM Sans, Arial, sans-serif"}`; g.textAlign = o.align||"center"; g.textBaseline = o.base||"middle"; g.fillText(s,x,y); }
function tick(g,x,y,col){ g.save(); g.strokeStyle = col; g.lineWidth = 2.4; g.beginPath(); g.moveTo(x-6,y); g.lineTo(x-1,y+5); g.lineTo(x+7,y-5); g.stroke(); g.restore(); }

const SCENES = {
  autocracy:{ P:9, hero:.22, legend:["s","d","r"], draw(g,t){
    const O = {x:400,y:150};
    const ppl = [["Principal",1],["Teacher",0],["Teacher",1],["Parent",1],["Parent",0],["Parent",1]];
    const pos = ppl.map((p,i) => ({x:130 + i*108, y:350 + (i%2)*28}));
    const dec = ease(ph(t,.06,.2));
    pos.forEach((p,i) => {
      const s = .24 + i*.06, a = ph(t,s,s+.07);
      line(g, O.x, O.y+30, p.x, p.y-28, C.line, 1.2, [3,4]);
      if (a>0 && a<1){ dot(g, lerp(O.x,p.x,a), lerp(O.y+30,p.y-28,a), 5, C.ochre); }
    });
    pos.forEach((p,i) => {
      const s = .24 + i*.06, a = ease(ph(t,s+.06,s+.1));
      const own = ppl[i][1];
      actor(g, p.x, p.y, 22, HERO ? {v: [.1,.85,.4,1,.25,.65][i]} : {v: lerp(own, 0, a), inner: a>0.5 ? own : null, label: ppl[i][0]});
    });
    actor(g, O.x, O.y, 30, {v: dec>0 ? 0 : null, decider:true, ring: dec, label:"Owner"});
    if (t < .2) caption(g, "The owner decides on a 15% fee rise alone", "He does it after a cost review, without asking the principal, teachers or parents");
    else if (t < .62) caption(g, "The rise goes out by message that evening", "The principal hears about it at the same time as the parents");
    else caption(g, "No one objects in public", "Two weeks later, twelve families ask to leave, and the principal agrees payment plans one family at a time");
  }},
  consultative:{ P:10, legend:["s","d","r"], draw(g,t){
    const H = {x:400,y:385};
    const pan = [["Head of\nmaths",0,1],["Senior\nteacher",0,1],["Parent\ngovernor",1,.8],["Student\nrep",1,.25]];
    const pos = pan.map((p,i) => ({x:160 + i*160, y:140}));
    let recv = 0, wsum = 0;
    pos.forEach((p,i) => {
      const s = .18 + i*.11, a = ph(t,s,s+.1);
      line(g, p.x, p.y+32, H.x, H.y-34, C.line, 1.2, [3,4]);
      const sz = lerp(8, 8*pan[i][2], ph(t,s-.04,s+.02));
      if (a>0 && a<1) dot(g, lerp(p.x,H.x,ease(a)), lerp(p.y+32,H.y-34,ease(a)), Math.max(2.5,sz), opColor(pan[i][1]));
      if (a>=1){ recv += pan[i][1]*pan[i][2]; wsum += pan[i][2]; }
    });
    pos.forEach((p,i) => actor(g, p.x, p.y, 24, {v: HERO ? [.05,.4,.7,1][i] : (ph(t,.02,.1)>0 ? pan[i][1] : null), label: pan[i][0], alpha: !HERO && i===3 && t>.5 ? .8 : 1}));
    const dec = ease(ph(t,.68,.78));
    const hv = wsum ? recv/wsum : null;
    actor(g, H.x, H.y, 30, {v: dec>0 ? 0 : hv, decider:true, ring: dec, label:"Head teacher"});
    if (t < .17) caption(g, "The panel forms views", "Two favour candidate B, two favour candidate C");
    else if (t < .62) caption(g, "Advice reaches the head in speaking order", "The student's view arrives small: said as “all three were good”");
    else caption(g, "The head decides", "Status shaped which advice reached the head");
  }},
  majority:{ P:11, draw(g,t){
    const seats = []; for (let r=0;r<3;r++) for (let c=0;c<8;c++) seats.push({x:150 + c*72, y:120 + r*72});
    const absent = new Set([7,15,23]);
    const votes = [0,1,0,0,1,0,1,  0,1,0,0,1,1,0,  1,0,0,1,0,1,0]; // 12 A, 9 B
    let k = 0, a = 0, b = 0;
    seats.forEach((s,i) => {
      if (absent.has(i)) { actor(g, s.x, s.y, 18, {empty:true}); return; }
      const v = votes[k], st = .1 + k*.024, on = ph(t,st,st+.02); k++;
      if (on>=1) { v ? b++ : a++; }
      const lost = t > .72 && v === 1;
      actor(g, s.x, s.y, 18, {v: on>0 ? v : null, alpha: lost ? .55 : 1});
    });
    text(g, "absent: early-shift", 654, 230, {fs:13, col:C["ink-mute"]});
    text(g, "families", 654, 247, {fs:13, col:C["ink-mute"]});
    // tally
    const x0 = 150, x1 = 654, y = 400, tot = 21;
    g.fillStyle = C["paper"]; g.fillRect(x0, y, x1-x0, 20);
    g.fillStyle = C.ochre; g.fillRect(x0, y, (x1-x0)*a/tot, 20);
    g.fillStyle = C.sage; g.fillRect(x1 - (x1-x0)*b/tot, y, (x1-x0)*b/tot, 20);
    g.strokeStyle = C.ink; g.lineWidth = 1; g.strokeRect(x0, y, x1-x0, 20);
    line(g, (x0+x1)/2, y-10, (x0+x1)/2, y+30, C.ink, 1.5, [4,3]);
    text(g, `8:30 start · ${a}`, x0, y+42, {align:"left", fs:15, col:C.ink});
    text(g, `${b} · keep 7:30`, x1, y+42, {align:"right", fs:15, col:C.ink});
    text(g, "half", (x0+x1)/2, y+42, {fs:13, col:C["ink-mute"]});
    if (t > .72){ g.save(); g.setLineDash([2.5,4]); g.strokeStyle = C.ochre; g.lineWidth = 3; g.globalAlpha = ease(ph(t,.72,.8)); g.strokeRect(x0-8, y-8, (x1-x0)*a/tot+16, 36); g.restore(); }
    if (t < .1) caption(g, "Parents gather at 3 pm", "Three families who work early shifts cannot come");
    else if (t < .72) caption(g, "Votes are cast one by one", "The bar shows the running tally against the halfway line");
    else caption(g, "8:30 passes 12–9", "The same group has now lost three calendar votes in a row");
  }},
  consent:{ P:14, draw(g,t){
    const c = {x:400, y:262}, R = 150;
    const ppl = [["Grade lead",.3],["English",0],["Science",.9],["Maths",.5],["Arts",.1],["Student",.8],["Parent",.6]];
    const pos = ppl.map((p,i) => { const a = -Math.PI/2 + i*2*Math.PI/7; return {x:c.x + R*Math.cos(a), y:c.y + R*0.82*Math.sin(a)}; });
    const r1 = [.08,.44], r2 = [.56,.86];
    const at = (u) => { const f = u*7, i = Math.floor(f)%7, j = (i+1)%7, s = ease(f - Math.floor(f));
      return {x: lerp(pos[i].x,pos[j].x,s), y: lerp(pos[i].y,pos[j].y,s), i}; };
    const dec = ease(ph(t,.88,.95));
    if (dec>0){ g.save(); g.setLineDash([2.5,5]); g.strokeStyle = C.ochre; g.lineWidth = 3; g.globalAlpha = dec; g.beginPath(); g.ellipse(c.x,c.y,R+44,R*0.82+44,0,0,Math.PI*2); g.stroke(); g.restore(); }
    pos.forEach((p,i) => {
      actor(g, p.x, p.y, 22, {v: ppl[i][1], label: ppl[i][0], decider: i===0});
      const passed1 = t > r1[0] + (r1[1]-r1[0])*(i+.5)/7, passed2 = t > r2[0] + (r2[1]-r2[0])*(i+.5)/7;
      if (i === 2 && passed1 && t < r2[1]){ // objection
        g.beginPath(); g.arc(p.x+28, p.y-24, 11, 0, Math.PI*2); g.fillStyle = C.terra; g.fill();
        text(g, "!", p.x+28, p.y-23, {col:C.paper, w:700, fs:15});
      } else if ((passed1 && t < .5) || passed2) tick(g, p.x+28, p.y-22, C.sage);
    });
    let tok = null, lbl = "P1";
    if (t < r1[0]) tok = {x:c.x, y:c.y};
    else if (t < r1[1]) tok = at(ph(t,r1[0],r1[1]));
    else if (t < .5) tok = {x: lerp(pos[0].x, c.x, ease(ph(t,.44,.5))), y: lerp(pos[0].y, c.y, ease(ph(t,.44,.5)))};
    else if (t < r2[0]) { tok = {x:c.x, y:c.y}; lbl = "P2"; }
    else if (t < r2[1]) { tok = at(ph(t,r2[0],r2[1])); lbl = "P2"; }
    else { tok = {x:c.x, y:c.y}; lbl = "P2"; }
    if (tok){ g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.4; g.fillRect(tok.x-17, tok.y-12, 34, 24); g.strokeRect(tok.x-17, tok.y-12, 34, 24); text(g, lbl, tok.x, tok.y+1, {fs:13, col:C.ink, w:500}); }
    if (t < r1[0]) caption(g, "A proposal: cap homework at 40 minutes", "Colours: each person's favourite option. They never need to match");
    else if (t < .5) caption(g, "Round 1: consent or object", "Science objects: weekly lab write-ups won't fit");
    else if (t < r2[0]) caption(g, "The proposal is amended", "Lab write-ups spread across the week");
    else if (t < .88) caption(g, "Round 2", "No reasoned objections");
    else caption(g, "Decided, with a review in six weeks", "Good enough for now, safe enough to try");
  }},
  citizens_assembly:{ P:14, hero:.6, legend:["s","d","r"], draw(g,t){
    const pool = SX.grid(6, 7, 70, 178, 26, 31);
    const pick = [3,8,11,16,19,23,26,30,33,37,40,5];
    const circ = SX.around(12, 430, 258, 88, 88);
    const board = [{x:720,y:198},{x:720,y:270},{x:720,y:342}];
    const startV = [0,1,.5,0,1,.66,.33,1,0,.66,.33,1], endV = .42;
    pool.forEach((p,i) => { if (pick.indexOf(i) < 0) actor(g, p.x, p.y, 7, {v:null, alpha:.75}); });
    const mv = ease(ph(t,.18,.32)), conv = ease(ph(t,.5,.66));
    pick.forEach((idx,k) => { const p = pool[idx], q = circ[k];
      const x = lerp(p.x,q.x,mv), y = lerp(p.y,q.y,mv), r = lerp(7,14,mv);
      const v = HERO ? rnd(k,5) : (mv > .02 ? lerp(startV[k], endV, conv) : null);
      actor(g, x, y, r, {v}); });
    SX.ring(g, 430, 258, 104, 104, HERO ? 1 : ease(ph(t,.56,.66)));
    const ra = ease(ph(t,.72,.84));
    if (!HERO && ra > 0 && ra < 1) SX.card(g, lerp(528,648,ra), 258, 34, 22);
    const bd = HERO ? 1 : ease(ph(t,.84,.94));
    board.forEach((b,i) => actor(g, b.x, b.y, 15, {v: bd > 0 ? 0 : null, decider:true, ring: i === 1 ? bd : 0}));
    if (t < .18) caption(g, "Dozens are eligible, and no one knows who will serve", "So there is no one to lobby");
    else if (t < .5) caption(g, "A lottery draws a group that matches the community", "Chosen by chance, not by who pushes hardest");
    else if (t < .72) caption(g, "They learn, hear every side, and find common ground", "Together they agree what to recommend");
    else caption(g, "The recommendation goes to the body that must act", "Which keeps the final say");
  }},
  nemawashi:{ P:16, draw(g,t){
    const Pp = {x:110, y:270};
    const vis = [["Maths\nhead",.7],["English\nhead",.4],["Club\ncoach",1],["PTA\nchair",.6]];
    const top = vis.map((p,i) => ({x:290 + i*130, y:130}));
    const nw = {x:700, y:290};
    const mt = ease(ph(t,.66,.76));                       // move into the meeting
    const row = j => ({x:130 + j*120, y:282});
    const at = (p,j) => ({x: lerp(p.x,row(j).x,mt), y: lerp(p.y,row(j).y,mt)});
    if (mt>0){ g.save(); g.globalAlpha = mt; g.strokeStyle = C.line; g.lineWidth = 1.4; g.setLineDash([4,4]);
      g.beginPath(); g.roundRect ? g.roundRect(66,214,728,148,18) : g.rect(66,214,728,148); g.stroke();
      text(g, "Staff meeting", 66, 200, {align:"left", fs:13, col:C["ink-mute"]}); g.restore(); }
    // visits
    let ver = "P1";
    vis.forEach((p,k) => {
      const s0 = .06 + k*.13, s1 = s0 + .13, q = top[k];
      if (mt === 0) line(g, Pp.x, Pp.y, q.x, q.y, C.line, 1, [2,5]);
      const out = ph(t,s0,s0+.05), back = ph(t,s1-.05,s1);
      if (k === 2 && t > s1-.05) ver = "P2";
      if (t > s0 && t < s1){
        const u = back>0 ? 1-ease(back) : ease(out);
        const x = lerp(Pp.x,q.x,u), y = lerp(Pp.y,q.y,u);
        g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.4; g.fillRect(x-17,y-12,34,24); g.strokeRect(x-17,y-12,34,24);
        text(g, k===2 && back>0 ? "P2" : (k>2 ? "P2" : "P1"), x, y+1, {fs:13, col:C.ink, w:500});
      }
    });
    if (t > .06 + 3*.13) ver = "P2";
    vis.forEach((p,k) => {
      const s0 = .06 + k*.13, conv = k === 2 ? ease(ph(t,s0+.09,s0+.11)) : ease(ph(t,s0+.05,s0+.08));
      const q = at(top[k], k+1);
      actor(g, q.x, q.y, 22, {v: lerp(p[1], 0, conv), label: p[0]});
      if (k === 2 && t > s0+.05 && t < s0+.09 && mt === 0){ g.beginPath(); g.arc(q.x+28,q.y-24,11,0,Math.PI*2); g.fillStyle = C.terra; g.fill(); text(g,"!",q.x+28,q.y-23,{col:C.paper,w:700,fs:15}); }
      if (t > s0+.09 && mt === 0) tick(g, q.x+28, q.y-22, C.sage);
    });
    // not visited
    const nq = at(nw, 5), outward = ease(ph(t,.78,.86));
    actor(g, nq.x, nq.y, 22, {v: lerp(1,0,outward), inner: outward>.5 ? 1 : null, label:"Newer\nteacher", alpha: mt>0 ? 1 : .85});
    if (mt === 0 && t > .58){ g.save(); g.globalAlpha = ph(t,.58,.62); text(g, "not visited", nw.x, nw.y-38, {fs:13, col:C.terra}); g.restore(); }
    // proposer + proposal
    const pq = at(Pp, 0), dec = ease(ph(t,.84,.9));
    actor(g, pq.x, pq.y, 26, {v:0, decider:true, ring:dec, label:"Deputy\nhead"});
    if (t < .06 || (t > .58 && mt < .3)){ const x = pq.x, y = pq.y - 52; g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.4; g.fillRect(x-17,y-12,34,24); g.strokeRect(x-17,y-12,34,24); text(g, ver, x, y+1, {fs:13, col:C.ink, w:500}); }
    if (t < .06) caption(g, "A proposal: 60-minute periods", "Before any meeting, the deputy head visits each key person");
    else if (t < .32) caption(g, "One-to-one visits", "Each concern is heard in private");
    else if (t < .45) caption(g, "The club coach objects", "The plan is changed to keep the end of the day the same");
    else if (t < .58) caption(g, "Everyone visited now supports P2", "Ticks: agreed in private");
    else if (t < .66) caption(g, "No one visits the newer teacher", "Her doubts never reach the proposal");
    else if (t < .84) caption(g, "The staff meeting", "Everyone senior has already agreed");
    else caption(g, "Approved in ten minutes", "Inner dot: a doubt that was never raised");
  }},
  quadratic:{ P:13, draw(g,t){
    const proj = ["Library hours","Sports field","Solar panels","Wellbeing room"];
    const alloc = [[2,2,2,2],[0,3,2,1],[0,0,0,4],[2,3,0,1],[0,0,0,4],[1,2,2,1],[3,1,1,1],[1,3,1,1]];
    const tot = [0,0,0,0];
    text(g, "1 vote = 1 credit · 2 = 4 · 3 = 9 · 4 = 16", 24, 74, {align:"left", fs:14, col:C["ink-mute"]});
    alloc.forEach((al,i) => {
      const st = .08 + i*.075, a = ph(t,st,st+.06);
      const y = 120 + i*44;
      const spent = al.reduce((s,v)=>s+v*v,0);
      actor(g, 50, y, 12, {v: (i===2||i===4) ? 1 : 0.5, decider: a>0 && a<1});
      for (let c=0;c<16;c++){ const used = c < spent*a; g.fillStyle = used ? C.line : C["ink-soft"]; g.fillRect(74 + c*9, y-4, 6, 8); }
      al.forEach((v,j) => tot[j] += v * a);
    });
    text(g, "16 credits each", 74, 100, {align:"left", fs:13, col:C["ink-mute"]});
    const bx = 390, unit = 21;
    const win = t > .74 ? ease(ph(t,.74,.82)) : 0;
    proj.forEach((p,j) => {
      const y = 150 + j*80;
      text(g, p, bx, y-22, {align:"left", fs:15, col:C.ink});
      g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(bx, y-8, 16*unit, 20);
      g.fillStyle = j===3 ? C.sage : C.ochre; g.fillRect(bx, y-8, tot[j]*unit, 20);
      text(g, Math.round(tot[j]) + " votes", bx + 16*unit + 10, y+2, {align:"left", fs:14, col:C["ink-soft"]});
      if (j===3 && win>0){ g.save(); g.setLineDash([2.5,4]); g.strokeStyle = C.ochre; g.lineWidth = 3; g.globalAlpha = win; g.strokeRect(bx-10, y-18, 16*unit+20, 40); g.restore(); }
    });
    if (t < .08) caption(g, "Eight voters, four projects", "Everyone gets the same 16 credits");
    else if (t < .74) caption(g, "Each extra vote on one project costs more", "Two voters spend everything on 4 votes for the wellbeing room");
    else caption(g, "Wellbeing room wins, 15 to 14", "Under one person, one vote, the sports field would have won");
  }}
};

function mountScene(canvas, id, opts){
  opts = opts || {};
  const sc = SCENES[id]; if (!sc) return null;
  const R = opts.range || [0, 1], span = Math.max(.02, R[1] - R[0]), PP = sc.P * span;
  const g = canvas.getContext("2d");
  let start = performance.now(), running = !!opts.autoplay && !reduce, raf = 0, still = opts.range ? Math.max(R[0], R[1] - .01) : .97, cssW = 800, alive = true;
  const cap = opts.cap || null;
  function size(){ const r = canvas.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); cssW = r.width || 800;
    canvas.width = Math.max(1, Math.round(cssW*d)); canvas.height = Math.max(1, Math.round(cssW*d*VH/VW)); }
  function frame(t){
    FSK = clamp(560/cssW, 1, 1.55); CAP = cap || {dataset:{}, set innerHTML(v){}};
    const s = canvas.width / VW; g.setTransform(s,0,0,s,0,0); g.clearRect(0,0,VW,VH); sc.draw(g, t);
  }
  function loop(now){
    if (!running || !alive){ raf = 0; return; }
    const t = R[0] + span * (((now - start)/1000 % PP) / PP); frame(Math.min(t, R[1] - .001)); raf = requestAnimationFrame(loop);
  }
  size(); readColors(); frame(still);
  if (running) raf = requestAnimationFrame(loop);
  const ro = new ResizeObserver(() => { if (!alive) return; size(); if (!running) frame(still); }); ro.observe(canvas);
  const btn = opts.btn;
  function setBtn(){ if (btn) btn.textContent = running ? "Pause animation" : "Play animation"; }
  if (btn){ btn.hidden = false; setBtn();
    btn.onclick = () => { running = !running; setBtn();
      if (running){ start = performance.now(); raf = requestAnimationFrame(loop); } else { frame(still); } }; }
  return { stop(){ alive = false; running = false; ro.disconnect(); }, redraw(){ readColors(); if (!running) frame(still); } };
}

/* still images: thumbnails and the downloadable PNG */
let HERO = false; /* true while drawing a still for the top image, card or PNG */
function drawStill(canvas, id){
  const sc = SCENES[id]; if (!sc) return;
  const g = canvas.getContext("2d"); const s = canvas.width / VW;
  FSK = 1; CAP = {dataset:{}, set innerHTML(v){}};
  g.setTransform(s,0,0,s,0,0); g.clearRect(0,0,VW,VH); (HERO = sc.hero != null, sc.draw(g, HERO ? sc.hero : .97), HERO = false);
}
function scenePNG(id){
  const sc = SCENES[id]; if (!sc) return Promise.resolve(null);
  readColors();
  const W = 1600, H = 1000, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = C.paper; g.fillRect(0,0,W,H);
  g.save(); g.scale(W/VW, H/VH);
  FSK = 1; CAP = {dataset:{}, set innerHTML(v){}}; (HERO = sc.hero != null, sc.draw(g, HERO ? sc.hero : .97), HERO = false); g.restore();
  return new Promise(res => c.toBlob(res, "image/png"));
}

/* ---------- the structure pop-up ---------- */
let DLG = null, DLG_SCENE = null;
function figHTML(s, e){
  return `<figure class="popfig">
        <div class="plate"><canvas id="popCv" role="img" aria-label="Drawing of ${esc(s.name)}"></canvas></div>
        <p class="cap" id="popCap" aria-live="off"></p>
        <div class="popbtns"><button class="btn" type="button" id="popPlay">Play animation</button><button class="btn" type="button" id="popPng" hidden>Download PNG</button><span class="mute" id="popMsg" style="font-size:.86rem"></span></div>
        <div class="legend"><span><i class="sw a"></i>one view</span><span><i class="sw b"></i>another view</span><span><i class="sw d"></i>holds decision power</span><span><i class="sw r"></i>decision made</span><span>${esc(e.actors)}</span></div>
      </figure>`;
}
function forceBlock(x, i, k){
  const f = F[x.f]; if (!f) return "";
  return `<div class="fblock">
      <div class="fbtxt"><p class="fbhead"><span class="chip force">${esc(f.name)}</span><span class="tag ${x.e === "hurts" ? "amp" : "damp"}">${x.e === "hurts" ? "caused trouble" : "helped"}</span></p>
        <p${E(k("forces."+i+".how"),true)}>${x.how}</p></div>
      <div class="fbfig">${modelFigure(f.model, f.loop)}</div>
    </div>`;
}
function caseHTML(kind, c, id, figure){
  const k = f => `ent:${id}:${kind}.${f}`;
  if (!c) return "";
  const fig = ""; /* case-level models removed: models live on the Social forces page */
  return `<section class="pcase ${kind}">
    <h3 class="casehead">${kind === "useful" ? "Useful when" : "Watch out for"}</h3>
    <div class="scenario"><h4${E(k("title"))}>${esc(c.title)}</h4><p${E(k("text"),true)}>${c.text}</p>${figure || ""}</div>
    <p><b>${kind === "useful" ? "Why it works:" : "What went wrong:"}</b> <span${E(k("why"),true)}>${c.why}</span></p>
    <h4 class="fhead">Social forces at work</h4>
    ${c.forces.map((x,i) => forceBlock(x, i, k)).join("")}
    ${c.together ? `<div class="together"><h4 class="fhead">How the forces worked together</h4><p${E(k("together"),true)}>${c.together}</p>${fig ? `<div class="casefig">${fig}</div>` : ""}</div>` : (fig ? `<div class="casefig">${fig}</div>` : "")}
  </section>`;
}

/* ---------- v2 layout: bullets, example carousel, forces, summary ---------- */
function sceneKey(id, kind){ const e = FG.entries[id]; if (SCENES[id + ":" + kind]) return id + ":" + kind; if (((e && e.scene) || "useful") === kind && SCENES[id]) return id; return null; }
function sceneSteps(key){
  const sc = SCENES[key]; if (!sc) return [];
  const c = document.createElement("canvas"); c.width = 80; c.height = 50; const g = c.getContext("2d");
  const out = []; let prev = null;
  const keyAt = t => { const stub = {dataset:{}, set innerHTML(v){}}; CAP = stub; FSK = 1; g.setTransform(.1,0,0,.1,0,0); try { sc.draw(g, t); } catch(err){} return stub.dataset.k || ""; };
  let tp = 0;
  for (let i = 0; i <= 300; i++){ const t = i/300*.999, k = keyAt(t);
    if (k !== prev){ let lo = tp, hi = t; /* find the exact moment the caption changes, so a step never shows the next step's first frames */
      if (i) for (let j = 0; j < 24; j++){ const m = (lo + hi)/2; if (keyAt(m) === k) hi = m; else lo = m; }
      out.push({t0: i ? hi : t, k}); prev = k; }
    tp = t; }
  CAP = null;
  out.forEach((st,i) => { st.t1 = i + 1 < out.length ? out[i+1].t0 : 1; const [a,b] = st.k.split("|"); st.cap = a || ""; st.sub = b || ""; });
  return out.filter(st => st.t1 - st.t0 > .02 && st.cap);
}
function carouselHTML(kind, c, id){
  const k = f => `ent:${id}:${kind}.${f}`, key = sceneKey(id, kind), steps = key ? sceneSteps(key) : [];
  const closeLab = kind === "useful" ? "Why it works" : "What went wrong";
  const fig = ""; /* case-level models removed: models live on the Social forces page */
  const total = steps.length + 1 + (fig ? 1 : 0), cnt = i => `<span class="stepcount" aria-hidden="true">${i+1} of ${total}</span>`;
  const slides = steps.map((st,n) => `<article class="xs anim" data-key="${key}" data-t0="${st.t0}" data-t1="${st.t1}">
        <div class="plate"><canvas role="img" aria-label="Step ${n+1} of the drawing"></canvas></div>
        <div class="txt"><p class="cap"><b>${esc(st.cap)}</b>${st.sub ? `<span>${esc(st.sub)}</span>` : ""}</p>
          <div class="stepnav">${n ? `<button class="backstep" type="button"><span aria-hidden="true">←</span> Previous</button>` : ""}<button class="nextstep" type="button">Next <span aria-hidden="true">→</span></button>${cnt(n)}</div></div>
      </article>`);
  slides.push(`<article class="xs sum one">
        <div class="txt"><p class="lab">${closeLab}</p>
          <p><span${E(k("why"),true)}>${c.why}</span>${c.together ? ` <span${E(k("together"),true)}>${c.together}</span>` : ""}</p></div>
        <div class="txt fcol"><p class="lab">Social forces</p>
          ${(c.forces || []).map((x,i) => { const f = F[x.f]; return f ? `<div class="fitem"><h5 class="fname">${fLabel(x)}${x.st ? ` <span class="st ${x.st}">${FST[x.st]}</span>` : ""}</h5><p${E(k("forces."+i+".how"),true)}>${x.how}</p></div>` : ""; }).join("")}</div>
        ${FB_ON(id) ? `<div class="fb" data-ex="${id}:${kind}"><p class="fbq">Does this example ring true?</p>
          <div class="fbb"><button type="button" data-r="yes">Rings true</button><button type="button" data-r="no">Doesn't ring true</button></div>
          <p class="fbmsg" aria-live="polite"></p>
          <form class="fbnote" hidden><label>What feels off? <span>(optional)</span><input type="text" maxlength="280" autocomplete="off"></label><button type="submit">Send</button></form></div>` : ""}
        <div class="stepnav wide">${steps.length ? `<button class="backstep" type="button"><span aria-hidden="true">←</span> Previous</button>` : ""}${fig ? `<button class="nextstep" type="button">Next <span aria-hidden="true">→</span></button>` : ""}${cnt(steps.length)}</div>
      </article>`);
  if (fig) slides.push(`<article class="xs sum tg hasfig"><div class="casefig">${fig}</div><div class="stepnav"><button class="backstep" type="button"><span aria-hidden="true">←</span> Previous</button>${cnt(total-1)}</div></article>`);
  return `<div class="excar" data-n="${slides.length}">
      <div class="exhead">
        <h4 class="extitle"${E(k("title"))}>${esc(c.title)}</h4>
      </div>
      <div class="exstage">
      <div class="track" tabindex="0" aria-label="${kind === "useful" ? "Useful when" : "Watch out for"}: the example step by step">${slides.join("")}</div>
      </div>
    </div>`;
}
function forceBlock2(x, i, k){
  const f = F[x.f]; if (!f) return "";
  const dia = x.diagram ? `<div class="fbfig">${modelFigure(f.model, f.loop)}</div>` : "";
  return `<div class="fblock${dia ? "" : " solo"}">
      <div class="fbtxt"><h5 class="fname">${esc(f.name)}</h5><p${E(k("forces."+i+".how"),true)}>${x.how}</p></div>
      ${dia}
    </div>`;
}
function caseHTML2(kind, c, id){
  const k = f => `ent:${id}:${kind}.${f}`;
  return `<section class="pcase v2 ${kind}">
    <h3 class="casehead">${kind === "useful" ? "Useful when" : "Watch out for"}</h3>
    ${c.bullets ? `<ul class="when">${c.bullets.map((b,i) => `<li${E(k("bullets."+i),true)}>${b}</li>`).join("")}</ul>` : ""}
    ${carouselHTML(kind, c, id)}
  </section>`;
}
/* Colour key under the top image: only the marks that image shows (scene.legend), else all four. */
function legendHTML(id){
  const all = {s:"a range of views", a:"one view", b:"another view", d:"holds decision power", r:"decision made"}, sc = SCENES[id];
  const keys = (sc && sc.legend) || Object.keys(all);
  return keys.map(k => `<span><i class="sw ${k}"></i>${all[k]}</span>`).join("");
}
/* Reader feedback on every example: one doc per reader at fb/<id>, readable only by the owner and editors. */
const FB_ON = id => !!FG.entries[id];
let FB_DOC = null, FB_DATA = null;
async function fbInit(root){
  const boxes = root.querySelectorAll(".fb"); if (!boxes.length) return;
  const msg = (b, t) => { const m = b.querySelector(".fbmsg"); if (m) m.textContent = t; };
  if (!(window.claude && window.claude.use)) return fbInitStatic(boxes, msg);
  try {
    if (!FB_DOC){ const db = await window.claude.use("db"), u = await window.claude.use("user"); if (!db || !u) throw 0;
      const uid = await u.id(); FB_DOC = db.doc("fb/" + uid);
      const snap = await FB_DOC.get(); FB_DATA = (snap && (snap.data ? snap.data() : snap)) || {}; }
  } catch (e){ boxes.forEach(b => b.hidden = true); return; }
  boxes.forEach(b => { const ex = b.dataset.ex, cur = (FB_DATA.ex || {})[ex];
    const mark = r => b.querySelectorAll("[data-r]").forEach(x => x.setAttribute("aria-pressed", x.dataset.r === r ? "true" : "false"));
    if (cur){ mark(cur.r); msg(b, "Thanks. You can change your answer."); }
    const save = async (r, note) => { const ex2 = Object.assign({}, FB_DATA.ex || {}); ex2[ex] = {r, note: note || "", t: new Date().toISOString()};
      try { await FB_DOC.set(Object.assign({}, FB_DATA, {ex: ex2})); FB_DATA.ex = ex2; return true; } catch (e){ msg(b, "Your feedback couldn't be saved in this view."); return false; } };
    b.querySelectorAll("[data-r]").forEach(btn => btn.addEventListener("click", async () => { const r = btn.dataset.r; mark(r);
      const f = b.querySelector(".fbnote"); f.hidden = r !== "no";
      if (await save(r)) msg(b, r === "yes" ? "Thanks." : "Thanks. Tell us what feels off, if you like."); }));
    b.querySelector(".fbnote").addEventListener("submit", async ev => { ev.preventDefault(); const v = b.querySelector(".fbnote input").value.trim();
      if (await save("no", v)) { b.querySelector(".fbnote").hidden = true; msg(b, "Thanks, noted."); } }); });
}
/* Outside Claude: send anonymous feedback to the Worker in window.FG_FEEDBACK_URL; remember answers in this browser only. */
function fbInitStatic(boxes, msg){
  const url = window.FG_FEEDBACK_URL; if (!url){ boxes.forEach(b => b.hidden = true); return; }
  let mine = {}; try { mine = JSON.parse(localStorage.getItem("fg_fb") || "{}"); } catch (e){}
  /* Anonymous visitor ID: random, made in this browser, never tied to a name or account. */
  let vid = ""; try { vid = localStorage.getItem("fg_vid") || ""; if (!/^[a-f0-9]{32}$/.test(vid)){ const r = new Uint8Array(16); crypto.getRandomValues(r); vid = Array.from(r, x => x.toString(16).padStart(2, "0")).join(""); localStorage.setItem("fg_vid", vid); } } catch (e){ vid = ""; }
  const send = async (ex, r, note) => { try { const res = await fetch(url, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({example: ex, reaction: r, note: note || "", page: location.pathname, visitor: vid})}); return res.ok; } catch (e){ return false; } };
  boxes.forEach(b => { const ex = b.dataset.ex;
    const mark = r => b.querySelectorAll("[data-r]").forEach(x => x.setAttribute("aria-pressed", x.dataset.r === r ? "true" : "false"));
    if (mine[ex]){ mark(mine[ex]); msg(b, "Thanks. You can change your answer."); }
    b.querySelectorAll("[data-r]").forEach(btn => btn.addEventListener("click", async () => { const r = btn.dataset.r; mark(r);
      b.querySelector(".fbnote").hidden = r !== "no";
      if (await send(ex, r)){ mine[ex] = r; try { localStorage.setItem("fg_fb", JSON.stringify(mine)); } catch (e){} msg(b, r === "yes" ? "Thanks." : "Thanks. Tell us what feels off, if you like."); }
      else msg(b, "Your feedback couldn't be sent. Try again later."); }));
    b.querySelector(".fbnote").addEventListener("submit", async ev => { ev.preventDefault(); const v = b.querySelector(".fbnote input").value.trim(); if (!v) return;
      if (await send(ex, "no", v)){ b.querySelector(".fbnote").hidden = true; msg(b, "Thanks, noted."); } else msg(b, "Your note couldn't be sent. Try again later."); }); });
}
const FST = {helped:"Helped", held:"Held back", hurt:"Hurt", ignored:"Ignored"};
function fLabel(x){ const f = F[x.f]; return f ? esc(f.name) : ""; }
function firstSentence(t){ const m = String(t).match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : t; }
function forceLists(e){
  const seen = {}, help = [], hurt = [];
  ["useful","risky"].forEach(kd => ((e[kd] || {}).forces || []).forEach(x => { const f = F[x.f], key = x.f + x.e; if (!f || seen[key]) return; seen[key] = 1;
    (x.e === "hurts" ? hurt : help).push(`<li><b class="fname">${fLabel(x)}</b> <span>${x.gen ? esc(x.gen) : firstSentence(x.how)}</span></li>`); }));
  if (!help.length && !hurt.length) return "";
  /* one list: forces that tend to help first, then the ones to watch, with no good/bad labels */
  return `<div class="fone"><h4>Social forces to consider</h4><ul class="flist">${help.concat(hurt).join("")}</ul><p class="fmore"><a href="forces.html">Read more about how social forces work →</a></p></div>`;
}
function summaryHTML(id, e){
  return `<section class="summary">
      <h3>In short</h3>
      <p${E(`ent:${id}:summary`,true)}>${e.summary}</p>
      ${forceLists(e)}
      ${e.tips ? `<h4>How to use it well</h4><ul class="watch">${e.tips.map((t,i) => `<li${E(`ent:${id}:tips.${i}`,true)}>${t}</li>`).join("")}</ul>` : ""}
      ${e.related ? `<h4>Related practices</h4><ul class="related">${e.related.map((r,i) => `<li><b${E(`ent:${id}:related.${i}.name`)}>${esc(r.name)}</b><p${E(`ent:${id}:related.${i}.text`,true)}>${r.text}</p>${[r.ref, r.ref2].filter(x => x && FG.refs[x]).map(x => `<a class="src" href="about.html#${x}">${FG.refs[x].cite}</a>`).join(" · ")}</li>`).join("")}</ul>` : ""}
    </section>`;
}
/* Trim empty paper above and below a drawing, keeping a margin and at most 16:10. */
function cropCanvas(c){
  try {
    const g = c.getContext("2d"), W = c.width, H = c.height, d = g.getImageData(0, 0, W, H).data;
    const p0 = [d[0], d[1], d[2]], diff = i => Math.abs(d[i]-p0[0]) + Math.abs(d[i+1]-p0[1]) + Math.abs(d[i+2]-p0[2]) > 24;
    let top = -1, bot = -1;
    for (let y = 0; y < H && top < 0; y += 2) for (let x = 0; x < W; x += 4) if (diff((y*W + x)*4)){ top = y; break; }
    for (let y = H - 1; y >= 0 && bot < 0; y -= 2) for (let x = 0; x < W; x += 4) if (diff((y*W + x)*4)){ bot = y; break; }
    if (top < 0) return c;
    const pad = Math.round(H * .09); let y0 = Math.max(0, top - pad), y1 = Math.min(H, bot + pad);
    const minH = Math.round(W * .42); if (y1 - y0 < minH){ const m = (y0 + y1) / 2; y0 = Math.max(0, Math.round(m - minH/2)); y1 = Math.min(H, y0 + minH); }
    const o = document.createElement("canvas"); o.width = W; o.height = y1 - y0;
    o.getContext("2d").drawImage(c, 0, y0, W, y1 - y0, 0, 0, W, y1 - y0); return o;
  } catch (e){ return c; }
}
let CAR_SCENES = [];
function wireCarousels(root){
  CAR_SCENES.forEach(m => m && m.stop()); CAR_SCENES = [];
  root.querySelectorAll(".excar").forEach(car => {
    const tr = car.querySelector(".track"), n = +car.dataset.n, dots = car.querySelectorAll(".dots .dot");
    let cur = -1, live = null;
    const show = i => { if (i === cur) return; cur = i; dots.forEach((d,j) => { d.classList.toggle("on", j === i); if (j === i) d.setAttribute("aria-current","step"); else d.removeAttribute("aria-current"); });
      if (live){ live.stop(); live = null; }
      const sl = tr.children[i]; if (sl) tr.style.setProperty("height", sl.offsetHeight + "px", "important");
      if (sl && sl.classList.contains("anim")){ live = mountScene(sl.querySelector("canvas"), sl.dataset.key, {range:[+sl.dataset.t0, +sl.dataset.t1], autoplay:true, cap:{dataset:{}, set innerHTML(v){}}}); CAR_SCENES.push(live); } };
    const idx = () => Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth));
    const go = d => tr.scrollTo({left: clamp(idx() + d, 0, n-1) * tr.clientWidth, behavior: "smooth"});
    const goTo = i => tr.scrollTo({left: clamp(i, 0, n-1) * tr.clientWidth, behavior: reduce ? "auto" : "smooth"});
    dots.forEach((d,i) => d.onclick = () => goTo(i));
    car.querySelectorAll(".nextstep").forEach(b => b.onclick = () => go(1));
    car.querySelectorAll(".backstep").forEach(b => b.onclick = () => go(-1));
    tr.addEventListener("scroll", () => show(idx()), {passive:true});
    tr.addEventListener("keydown", ev => { if (ev.key === "ArrowRight"){ ev.preventDefault(); go(1); } if (ev.key === "ArrowLeft"){ ev.preventDefault(); go(-1); } });
    show(0);
  });
}
function variantsHTML(id){
  const vs = FG.structures.filter(x => (FG.variantOf || {})[x.id] === id), ex = ((FG.entries[id] || {}).variants || []);
  if (!vs.length && !ex.length) return "";
  return `<section class="pcase pvars"><h3 class="casehead">Variations</h3><ul class="related">
    ${vs.map(v => `<li><b><a href="#${hy(v.id)}" data-str="${v.id}">${esc(v.name)}</a></b><p>${esc((FG.builds[v.id] || {}).adds || v.line)}</p></li>`).join("")}
    ${ex.map((r,i) => `<li><b${E(`ent:${id}:variants.${i}.name`)}>${esc(r.name)}</b><p${E(`ent:${id}:variants.${i}.text`,true)}>${r.text}</p></li>`).join("")}
  </ul></section>`;
}
function openStructure(id){
  const s = S[id]; if (!s) return;
  if (!DLG){
    DLG = document.createElement("dialog"); DLG.className = "pop"; DLG.setAttribute("aria-labelledby","popTitle");
    document.body.append(DLG);
    DLG.addEventListener("click", e => { if (e.target === DLG) DLG.close(); });
    DLG.addEventListener("close", () => { if (DLG_SCENE) DLG_SCENE.stop(); DLG_SCENE = null; CAR_SCENES.forEach(m => m && m.stop()); CAR_SCENES = []; const eb = document.getElementById("edBar"); if (eb) document.body.append(eb);
      if (location.hash.slice(1) === hy(DLG.dataset.id || "")) history.replaceState(null, "", location.pathname + location.search); });
  }
  { const eb0 = document.getElementById("edBar"); if (eb0 && eb0.parentNode === DLG) document.body.append(eb0); }
  DLG.dataset.id = id;
  const e = FG.entries[id], fam = FAM[s.family];
  DLG.innerHTML = `<div class="popin">
    <div class="pophead"><p class="kicker"><a href="index.html#group-${fam.id}" data-group="${fam.id}">${esc(fam.name)}</a></p><span class="phact">${shareBtn("s", id, s.name, s.line)}<button class="btn close" type="button" aria-label="Close">✕</button></span></div>
    <h2 id="popTitle"${E(`str:${id}:name`)}>${esc(s.name)}</h2>
    <p class="popline"${E(`str:${id}:line`)}>${esc(s.line)}</p>
    ${e && e.summary ? `<figure class="hero"><img id="popImg" alt="Drawing of ${esc(s.name)}"><figcaption class="legend">${legendHTML(id)}</figcaption></figure>
      ${caseHTML2("useful", e.useful, id)}
      ${caseHTML2("risky", e.risky, id)}
      ${summaryHTML(id, e)}`
    : e ? `${caseHTML("useful", e.useful, id, (e.scene || "useful") === "useful" ? figHTML(s, e) : "")}
      ${caseHTML("risky", e.risky, id, e.scene === "risky" ? figHTML(s, e) : "")}
      ${e.tips ? `<section class="pcase"><h3 class="casehead">How to use it well</h3><ul class="watch">${e.tips.map((t,i) => `<li${E(`ent:${id}:tips.${i}`,true)}>${t}</li>`).join("")}</ul></section>` : ""}
      ${e.related ? `<section class="pcase"><h3 class="casehead">Related practices</h3><ul class="related">${e.related.map((r,i) => `<li><b${E(`ent:${id}:related.${i}.name`)}>${esc(r.name)}</b><p${E(`ent:${id}:related.${i}.text`,true)}>${r.text}</p>${[r.ref, r.ref2].filter(x => x && FG.refs[x]).map(x => `<a class="src" href="about.html#${x}">${FG.refs[x].cite}</a>`).join(" · ")}</li>`).join("")}</ul><p class="mute" style="font-size:.86rem">These are listed, not drawn. Each is a living practice that is more than a decision rule.</p></section>` : ""}`
    : `<div class="held">${s.tier === "D"
      ? "This practice is listed but not drawn. The sources I have found so far are mostly secondary, and reducing a living or spiritual practice to coloured dots risks stripping out what defines it. I'll write it from community-authored sources."
      : "I'm writing this one next: a drawing, a case where it works, a case where it backfires, and the social forces in each."}</div>`}
    ${variantsHTML(id)}
  </div>`;
  applyDom(DLG);
  DLG.querySelector(".close").onclick = () => DLG.close();
  { const ga = DLG.querySelector(".kicker a[data-group]"); if (ga) ga.onclick = ev => { const t = document.getElementById("group-" + ga.dataset.group); if (!t) return; ev.preventDefault(); DLG.close(); t.scrollIntoView({behavior: reduce ? "auto" : "smooth", block: "start"}); }; }
  DLG.querySelectorAll(".popbuilds a[data-str], .pvars a[data-str]").forEach(ba => ba.onclick = ev => { ev.preventDefault(); openStructure(ba.dataset.str); });
  if (!DLG.open) DLG.showModal();
  fbInit(DLG);
  { const pi = DLG.querySelector(".popin"); if (pi){ pi.tabIndex = -1; pi.focus({preventScroll:true}); } }
  const eb = document.getElementById("edBar"); if (eb) DLG.append(eb);
  DLG.querySelector(".popin").scrollTop = 0; DLG.scrollTop = 0;
  if (location.hash.slice(1) !== hy(id)) history.replaceState(null, "", "#" + hy(id));
  if (e){
    if (e.summary){ wireCarousels(DLG);
      const im = DLG.querySelector("#popImg"), sc = SCENES[id];
      if (im && sc){ readColors(); const c = document.createElement("canvas"); c.width = 1600; c.height = 1000; const g = c.getContext("2d");
        g.fillStyle = C.paper; g.fillRect(0, 0, c.width, c.height); g.scale(2, 2); FSK = 1; CAP = {dataset:{}, set innerHTML(v){}}; (HERO = sc.hero != null, sc.draw(g, HERO ? sc.hero : .97), HERO = false); CAP = null;
        im.src = cropCanvas(c).toDataURL("image/png"); } }
    else DLG_SCENE = mountScene(DLG.querySelector("#popCv"), id, {cap: DLG.querySelector("#popCap"), btn: DLG.querySelector("#popPlay")});
    const pngBtn = DLG.querySelector("#popPng"), msg = DLG.querySelector("#popMsg");
    if (window.claude && window.claude.use){
      window.claude.use("downloads").then(dl => {
        if (!dl || !pngBtn || DLG.dataset.id !== id) return;
        pngBtn.hidden = false;
        pngBtn.onclick = async () => {
          msg.textContent = "";
          try { const blob = await scenePNG(id); await dl.save({filename: hy(id) + ".png", data: blob}); msg.textContent = "Saved."; }
          catch (err){ const c = err && err.code;
            if (c === "declined") msg.textContent = "";
            else if (c === "rate_limited") msg.textContent = "Another download is waiting for you. Try again in a moment.";
            else { msg.textContent = "Downloads aren't available here."; pngBtn.hidden = true; } }
        };
      }).catch(() => {});
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => { chrome(); readColors(); await loadEdits(); if (window.page) window.page(); applyDom(document); initEditing(); });
