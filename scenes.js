/* Scenes, part 0: shared helpers for the drawings. All drawings are wordless; captions sit under the animation. */
const SX = {
  card(g, x, y, w, h){ w = w || 30; h = h || 22; g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.4; g.fillRect(x-w/2, y-h/2, w, h); g.strokeRect(x-w/2, y-h/2, w, h); },
  move(g, a, b, u, col, r){ if (u > 0 && u < 1) dot(g, lerp(a.x, b.x, ease(u)), lerp(a.y, b.y, ease(u)), r || 5, col || C.ochre); },
  ring(g, x, y, rx, ry, a){ if (!(a > 0)) return; g.save(); g.setLineDash([2.5,5]); g.strokeStyle = C.ochre; g.lineWidth = 3; g.globalAlpha = a; g.beginPath(); g.ellipse(x, y, rx, ry || rx, 0, 0, Math.PI*2); g.stroke(); g.restore(); },
  around(n, cx, cy, rx, ry, off){ off = off == null ? -Math.PI/2 : off; return Array.from({length:n}, (_, i) => { const a = off + i*2*Math.PI/n; return {x: cx + rx*Math.cos(a), y: cy + (ry || rx)*Math.sin(a)}; }); },
  grid(rows, cols, x0, y0, dx, dy){ const o = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o.push({x: x0 + c*dx, y: y0 + r*dy}); return o; },
  bar(g, x, y, w, h, frac, col, back){ g.fillStyle = back || C.paper; g.fillRect(x, y, w, h); g.fillStyle = col || C.ochre; g.fillRect(x, y, w*clamp(frac,0,1), h); g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(x, y, w, h); },
  box(g, x, y, w, h, dash, col){ g.save(); g.strokeStyle = col || C.line; g.lineWidth = 1.4; if (dash) g.setLineDash(dash); g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, 14); else g.rect(x, y, w, h); g.stroke(); g.restore(); },
  flag(g, x, y, col){ g.beginPath(); g.arc(x, y, 8, 0, Math.PI*2); g.fillStyle = col || C.terra; g.fill(); },
  arrow(g, x1, y1, x2, y2, col, w){ const a = Math.atan2(y2-y1, x2-x1); line(g, x1, y1, x2, y2, col, w || 1.6); g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - 10*Math.cos(a-0.4), y2 - 10*Math.sin(a-0.4)); g.lineTo(x2 - 10*Math.cos(a+0.4), y2 - 10*Math.sin(a+0.4)); g.closePath(); g.fill(); g.restore(); }
};
/* Scenes, part 1: Command */
Object.assign(SCENES, {
  oligarchy:{ P:12, hero:.27, legend:["s","d","r"], draw(g,t){
    const core = SX.around(5, 400, 120, 48, 34);
    const fam = SX.grid(3, 10, 130, 300, 60, 52);
    const near = new Set([0,1,10,11,20]);
    const start = [0,0,.65,0,0], doubt = ease(ph(t,.1,.18));
    fam.forEach((p,i) => { if (near.has(i)) line(g, 400, 150, p.x, p.y-12, C.line, 1, [3,4]); });
    for (let k = 0; k < 6; k++){ const u = ((t*6 + k*.17) % 1); if (t < .22){ const a = core[k%5], b = core[(k+2)%5]; SX.move(g, a, b, u, C["ink-mute"], 3); } }
    const dec = ease(ph(t,.2,.26));
    SX.ring(g, 400, 120, 92, 74, dec);
    fam.forEach((p,i) => { const s = .28 + (i%10)*.012, a = ph(t,s,s+.05); if (t > .26) SX.move(g, {x:400,y:150}, p, a, C.ochre, 3.5); });
    fam.forEach((p,i) => {
      const reached = ph(t, .28 + (i%10)*.012 + .05, .28 + (i%10)*.012 + .07);
      const poor = (i%10) >= 6, fade = poor ? ease(ph(t,.62 + (i%3)*.04, .74 + (i%3)*.04)) : 0;
      actor(g, p.x, p.y, 12, HERO ? {v: rnd(i, 3)} : {v: reached > 0 ? 0 : (poor ? 1 : .5), inner: reached > 0 && poor ? 1 : null, alpha: 1 - .7*fade});
    });
    core.forEach((p,i) => actor(g, p.x, p.y, 16, {v: HERO ? [0,.3,.6,.15,.45][i] : (i === 2 ? lerp(start[i], 0, doubt) : 0), decider:true}));
    if (t < .22) caption(g, "Five friends decide over lunch", "One member's doubt about the cost goes unsaid");
    else if (t < .55) caption(g, "A new uniform for every family", "Dotted lines: the only parents the group ever hears from");
    else caption(g, "Families at the far edge drop away", "Faded circles: students missing school. Inner dots: views no one asked for");
  }},
  chain_of_command:{ P:13, hero:.8, legend:["s","d","r"], draw(g,t){
    if (HERO) g.translate(70, 0);
    // a four-level hierarchy: 1 → 2 → 4 → 8
    const lv = [[{x:330,y:70}], [210,450].map(x => ({x, y:170})), [150,270,390,510].map(x => ({x, y:270})), [120,180,240,300,360,420,480,540].map(x => ({x, y:370}))];
    const par = (l,i) => lv[l-1][Math.floor(i/2)];
    for (let l = 1; l < 4; l++) lv[l].forEach((p,i) => line(g, par(l,i).x, par(l,i).y + 14, p.x, p.y - 12, C.line, 1.4));
    // orders flow down
    for (let l = 1; l < 4; l++) lv[l].forEach((p,i) => SX.move(g, par(l,i), p, ph(t, .03 + (l-1)*.06, .09 + (l-1)*.06), C.ochre, 4));
    // a warning goes up from one technician, getting smaller and paler
    const path = [lv[3][5], lv[2][2], lv[1][1], lv[0][0]], sz = [11, 8, 5, 3];
    for (let k = 0; k < 3; k++){ const s0 = .3 + k*.12, u = ph(t, s0, s0 + .1);
      if (u > 0 && u < 1){ const a = path[k], b = path[k+1]; dot(g, lerp(a.x, b.x, ease(u)), lerp(a.y, b.y, ease(u)), lerp(sz[k], sz[k+1], u), mix(C.terra, C.line, (k + u)/3)); } }
    if (t > .26 && t < .34) SX.flag(g, path[0].x + 18, path[0].y - 16);
    const dec = ease(ph(t,.68,.74));
    lv.forEach((row,l) => row.forEach((p,i) => actor(g, p.x, p.y, [24,18,14,11][l], {v: HERO ? (l === 0 ? 0 : rnd(l*10 + i, 5)) : (t > .03 + l*.06 ? 0 : null), decider: l === 0, ring: l === 0 ? dec : 0, inner: !HERO && l === 3 && i === 5 && t > .3 ? 1 : null})));
    // the lab
    const fall = ease(ph(t,.84,.92));
    if (!HERO){ SX.box(g, 610, 250, 150, 130, null, C["ink-soft"]);
    g.save(); g.strokeStyle = C.terra; g.lineWidth = 2.4; g.beginPath();
    [[630,250],[655,266],[672,256],[698,274],[720,262],[745,278]].forEach(([x,y],i) => { const yy = y + fall*100*(i%2 ? .9 : 1); i ? g.lineTo(x, yy) : g.moveTo(x, yy); }); g.stroke(); g.restore(); }
    if (t < .28) caption(g, "Orders pass down, one level at a time", "Like a military chain of command: each person answers to the one above");
    else if (t < .66) caption(g, "A technician sends a warning up about cracks in the lab ceiling", "Red dot: the warning. Each level passes on a calmer summary");
    else if (t < .84) caption(g, "The principal hears “fine for now”", "The labs stay in full use");
    else caption(g, "Part of the ceiling falls", "The warning was there at the bottom of the chain all along");
  }},
  advice_process:{ P:13, hero:.97, legend:["s","d","r"], draw(g,t){
    const T = {x:200, y:250};
    const A = [{x:560,y:110},{x:640,y:250},{x:560,y:390}], av = HERO ? [.75, .15, .45] : [.6, 0, .3];
    const staff = SX.grid(1, 6, 130, 440, 52, 0);
    A.forEach((p,i) => line(g, T.x, T.y, p.x, p.y, C.line, 1, [3,4]));
    let tv = 1;
    A.forEach((p,i) => { const s = .1 + i*.15;
      SX.move(g, T, p, ph(t, s, s+.06), C.ink, 4);
      SX.move(g, p, T, ph(t, s+.07, s+.13), opColor(av[i]), i === 1 ? 7 : 5); });
    tv = lerp(1, .4, ease(ph(t,.33,.36))); tv = lerp(tv, 0, ease(ph(t,.38,.42)));
    A.forEach((p,i) => actor(g, p.x, p.y, 22, {v: av[i]}));
    const dec = ease(ph(t,.6,.66));
    actor(g, T.x, T.y, 28, {v: tv, decider:true, ring: dec});
    const post = ease(ph(t,.7,.78));
    if (post > 0 && !HERO){ SX.card(g, 200, 120, 60, 40); SX.move(g, T, {x:200,y:120}, ph(t,.68,.72), C.ochre, 5); }
    staff.forEach((p,i) => { const s = .78 + i*.02; if (!HERO) SX.move(g, {x:200,y:140}, p, ph(t,s,s+.06), C.ochre, 3); actor(g, p.x, p.y, 10, {v: HERO ? rnd(i, 9) : (t > s + .06 ? 0 : null)}); });
    if (t < .1) caption(g, "A teacher wants new microscopes", "Anyone can spend money, after asking for advice");
    else if (t < .55) caption(g, "She asks the people affected and the people who know", "Other science teachers, the finance officer, a student who repairs equipment");
    else if (t < .7) caption(g, "She decides", "The finance officer's advice moved her to the sturdier model");
    else caption(g, "The decision and the advice are posted", "Everyone can see who was asked and what they said");
  }}
});
/* Scenes, part 2: Counting */
function handUp(g, x, y, r, a, col){ if (a <= 0) return; const h = 22*a; line(g, x + r*.6, y - r*.6, x + r*.6, y - r - h, C.ink, 1.6); dot(g, x + r*.6, y - r - h, 4, col || C.ink); }
Object.assign(SCENES, {
  landsgemeinde:{ P:13, draw(g,t){
    const rows = 4, cols = 8, P = SX.grid(rows, cols, 190, 190, 62, 64);
    const priv = [0,0,0,0,0,0,0,0, 0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1, 1,1,0,1,1,0,1,1];
    const conform = new Set([9,11,16,18,21,25,28]);
    SX.card(g, 300, 90, 54, 34); SX.card(g, 500, 90, 54, 34);
    dot(g, 300, 90, 7, opColor(0)); dot(g, 500, 90, 7, opColor(1));
    const callA = t > .08 && t < .5, callB = t > .52 && t < .8;
    if (callA) SX.ring(g, 300, 90, 40, 28, .6); if (callB) SX.ring(g, 500, 90, 40, 28, .6);
    P.forEach((p,i) => {
      const r = Math.floor(i/cols), v = priv[i];
      const forA = v === 0 || conform.has(i), sA = .1 + r*.08, sB = .56;
      const upA = forA ? ease(ph(t, sA, sA+.05)) * (t < .5 ? 1 : 1 - ph(t,.5,.52)) : 0;
      const upB = !forA ? ease(ph(t, sB, sB+.05)) * (t < .8 ? 1 : 1 - ph(t,.8,.82)) : 0;
      const shown = forA && t > sA ? 0 : v;
      actor(g, p.x, p.y, 15, {v: t > sA && forA ? 0 : v, inner: conform.has(i) && t > sA ? 1 : null, decider: r === 0});
      handUp(g, p.x, p.y, 15, Math.max(upA, upB));
    });
    const dec = ease(ph(t,.84,.9));
    SX.ring(g, 300, 90, 46, 32, dec);
    if (t < .08) caption(g, "Two candidates. Hands will be counted by eye", "Elders sit in the front row");
    else if (t < .5) caption(g, "First candidate: hands go up row by row", "Inner dots: people who preferred the other candidate but raised their hand anyway");
    else if (t < .84) caption(g, "Second candidate: only a few hands", "Raising a hand now means standing out from the crowd");
    else caption(g, "The first candidate wins", "The count measured who followed the front row as much as who people preferred");
  }},
  supermajority:{ P:14, draw(g,t){
    const S = SX.around(15, 400, 230, 250, 120, Math.PI);
    const r1 = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0], r2 = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0];
    const v1 = ph(t,.08,.3), talk = t > .36 && t < .6, v2 = ph(t,.62,.82);
    let yes = 0;
    S.forEach((p,i) => {
      const a1 = ph(t, .08 + i*.014, .1 + i*.014), a2 = ph(t, .62 + i*.012, .64 + i*.012);
      let v = null; if (a1 > 0) v = r1[i] ? 0 : 1; if (a2 > 0) v = r2[i] ? 0 : 1;
      if (t > .6 && t < .62) v = null;
      if (v === 0) yes++;
      actor(g, p.x, p.y, 15, {v});
    });
    if (talk){ for (let k = 0; k < 6; k++){ const a = S[k*2 % 8], b = S[8 + (k % 7)], u = ((t - .36)*5 + k*.17) % 1; SX.move(g, a, b, u, C["ink-mute"], 3); } }
    const pc = {x:400, y:230}; SX.card(g, pc.x, pc.y, 44, 30);
    if (t > .5){ g.fillStyle = C.sage; g.fillRect(pc.x - 18, pc.y + 4, 36*ease(ph(t,.5,.56)), 5); }
    const bx = 220, bw = 360, by = 420;
    SX.bar(g, bx, by, bw, 18, yes/15, C.ochre);
    line(g, bx + bw*2/3, by - 10, bx + bw*2/3, by + 28, C.ink, 2, [4,3]);
    SX.ring(g, bx + bw/2, by + 9, bw/2 + 18, 24, ease(ph(t,.86,.92)));
    if (t < .08) caption(g, "A change to the founding rules needs 10 of 15 votes", "Dashed line: the two-thirds mark");
    else if (t < .36) caption(g, "First vote: 8 in favour", "A simple majority, but short of two-thirds");
    else if (t < .62) caption(g, "Supporters talk with the doubters", "The proposal changes to deal with their privacy concern");
    else if (t < .86) caption(g, "Second vote: 12 in favour", "The doubters' concern is now part of the rule");
    else caption(g, "The change passes", "With wide support, not just a narrow win");
  }},
  unanimity:{ P:12, draw(g,t){
    const c = {x:400, y:240}, S = SX.around(12, c.x, c.y, 170, 140);
    const hold = 7, press = ease(ph(t,.2,.66)), give = ease(ph(t,.66,.72));
    S.forEach((p,i) => { if (i !== hold && press > 0) line(g, p.x, p.y, lerp(p.x, S[hold].x, .8), lerp(p.y, S[hold].y, .8), C.terra, .4 + 2.4*press*(1-give), [2,4]); });
    // a clock in the middle
    g.save(); g.strokeStyle = C.line; g.lineWidth = 2; g.beginPath(); g.arc(c.x, c.y, 34, 0, Math.PI*2); g.stroke();
    g.strokeStyle = C.terra; g.lineWidth = 6; g.beginPath(); g.arc(c.x, c.y, 34, -Math.PI/2, -Math.PI/2 + Math.PI*2*clamp(t/.7,0,1)); g.stroke(); g.restore();
    S.forEach((p,i) => actor(g, p.x, p.y, 20, {v: i === hold ? lerp(1, 0, give) : 0, inner: i === hold && give > .5 ? 1 : (i === 2 && t > .4 ? .6 : null)}));
    SX.ring(g, c.x, c.y, 205, 175, ease(ph(t,.78,.86)));
    if (t < .2) caption(g, "Eleven favour one candidate, one favours another", "Every member must agree");
    else if (t < .66) caption(g, "“No one leaves until we agree”", "The clock runs, and the pressure lands on one person");
    else if (t < .78) caption(g, "She changes her vote", "“I didn't want to keep everyone”");
    else caption(g, "The record says unanimous", "Inner dots: doubts that stayed private, hers and at least one other");
  }},
  liberum_veto:{ P:13, draw(g,t){
    const c = {x:400, y:250}, S = SX.around(6, c.x, c.y, 230, 150), big = [30,24,26,22,28,24];
    S.forEach(p => line(g, p.x, p.y, c.x, c.y, C.line, 1, [3,4]));
    SX.card(g, c.x, c.y, 56, 38); g.fillStyle = C.line; for (let k = 0; k < 3; k++) g.fillRect(c.x - 20, c.y - 10 + k*8, 40, 3);
    for (let r = 0; r < 3; r++){
      const s = .08 + r*.28, inn = ph(t, s, s+.06), back = ph(t, s+.18, s+.24);
      const x = lerp(700, c.x + 70, ease(inn)), y = 60 + r*0;
      const px = back > 0 ? lerp(c.x + 70, 700, ease(back)) : x;
      if (t > s && t < s + .24){ SX.card(g, px, c.y - 90, 40, 28); g.fillStyle = [C.ochre, C.sage, C.teal][r]; g.fillRect(px - 14, c.y - 94, 28, 8); }
      S.forEach((p,i) => { const a = ph(t, s + .07 + i*.012, s + .09 + i*.012);
        if (a > 0 && t < s + .22){ if (i === 3) SX.flag(g, p.x + 30, p.y - 26); else tick(g, p.x + 30, p.y - 24, C.sage); } });
    }
    S.forEach((p,i) => actor(g, p.x, p.y, big[i], {v: i === 3 ? 1 : 0, decider: i === 3}));
    if (t < .08) caption(g, "Six districts share one bus contract", "Any one of them can block a change");
    else if (t < .9) caption(g, "New routes, later starts, a cheaper supplier", "Five agree each time. One district blocks every proposal");
    else caption(g, "After two years, the old timetable is still running", "The default, doing nothing, wins every round");
  }},
  voting_rules:{ P:14, draw(g,t){
    const groups = [{n:9, v:0},{n:8, v:1},{n:6, v:.5}], pos = [];
    groups.forEach((gr,k) => { for (let i = 0; i < gr.n; i++) pos.push({k, x: 120 + (i%3)*26, y: 120 + k*120 + Math.floor(i/3)*26}); });
    const move = ease(ph(t,.5,.64)), bx = 330, unit = 24;
    const counts = [9, 8 + 6*move, 6*(1 - move)];
    groups.forEach((gr,k) => { const y = 140 + k*120; SX.bar(g, bx, y, 23*unit*.6, 26, counts[k]/23*1.67, opColor(gr.v)); });
    pos.forEach((p,i) => {
      const tgt = p.k === 2 ? {x: p.x + 92*move, y: lerp(p.y, p.y - 120, move)} : p;
      actor(g, tgt.x, tgt.y, 10, {v: groups[p.k].v, inner: p.k === 2 && move > .5 ? .5 : null});
    });
    const first = t < .5 ? ease(ph(t,.3,.36)) : 1 - ph(t,.5,.52);
    SX.ring(g, bx + 9/23*23*unit*.6*1.67/2, 153, 120, 30, first);
    SX.ring(g, bx + 14/23*23*unit*.6*1.67/2, 273, 160, 30, ease(ph(t,.7,.76)));
    if (t < .3) caption(g, "23 ballots, three options", "Each colour is a first choice");
    else if (t < .5) caption(g, "Counted by most first choices", "The top option wins with 9");
    else if (t < .86) caption(g, "Counted by dropping the last option and moving its ballots", "Those 6 voters' next choice is the second option, which wins 14 to 9");
    else caption(g, "Same ballots, different winner", "So the rule is agreed before anyone votes");
  }},
  gram_sabha:{ P:14, draw(g,t){
    const L = {x:400, y:70};
    const front = SX.grid(1, 4, 280, 190, 80, 0), mid = SX.grid(1, 6, 210, 270, 76, 0), back = SX.grid(1, 7, 190, 350, 70, 0), edge = SX.grid(3, 2, 700, 240, 34, 50);
    front.forEach((p,i) => { line(g, p.x, p.y, L.x, L.y, C.line, 1.2); if (i) line(g, p.x, p.y, front[i-1].x, front[i-1].y, C.line, 1.2); });
    SX.card(g, 150, 70, 54, 34); SX.card(g, 650, 70, 54, 34);
    const talk = (arr, rate, s0, s1, col) => arr.forEach((p,i) => { for (let k = 0; k < rate; k++){ const u = ((t - s0)*4 + k/rate + i*.13) % 1; if (t > s0 && t < s1) SX.move(g, p, L, u, col, 3.5); } });
    talk(front, 3, .08, .7, opColor(0)); talk(mid.slice(0,2), 1, .3, .7, opColor(0)); talk([back[3]], 1, .5, .62, opColor(1));
    front.forEach(p => actor(g, p.x, p.y, 18, {v:0, decider:true}));
    mid.forEach((p,i) => actor(g, p.x, p.y, 15, {v: i < 4 ? 0 : 1}));
    back.forEach((p,i) => actor(g, p.x, p.y, 14, {v: i % 3 ? 1 : .5}));
    edge.forEach(p => actor(g, p.x, p.y, 13, {v:1, alpha:.85}));
    actor(g, L.x, L.y, 22, {v: t > .7 ? 0 : null, decider:true});
    SX.ring(g, 150, 70, 42, 30, ease(ph(t,.78,.84)));
    if (t < .08) caption(g, "Which school gets new classrooms?", "Landowners at the front, women at the back, a poorer settlement at the edge");
    else if (t < .7) caption(g, "The front row speaks first, and most", "Lines: who knows whom. The front row is linked to the leaders");
    else caption(g, "The vote follows the first speakers", "The school near the landowners wins. The settlement's children still walk 4 km");
  }}
});
/* Scenes, part 3: Consensus and consent */
function steps(g, n, cur, x0, y){ for (let i = 0; i < n; i++){ g.beginPath(); g.arc(x0 + i*34, y, 7, 0, Math.PI*2); g.fillStyle = i < cur ? C.ochre : (i === cur ? C["ochre-deep"] || C.ochre : C.paper); g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke(); if (i) line(g, x0 + (i-1)*34 + 8, y, x0 + i*34 - 8, y, C.line, 1); } }
Object.assign(SCENES, {
  holacracy:{ P:15, draw(g,t){
    const c = {x:400, y:225}, S = SX.around(7, c.x, c.y, 200, 140);
    const fac = 0, prop = 3, obj = 5, st = Math.min(5, Math.floor(t/.17));
    const turn = ((t % .17) / .17), who = Math.floor(turn*7);
    if (st >= 1 && st <= 4 && st !== 3){ const p = S[(prop + who) % 7]; SX.ring(g, p.x, p.y, 30, 30, .9); }
    if (st === 0 || st === 3){ SX.ring(g, S[prop].x, S[prop].y, 30, 30, .9); }
    SX.card(g, c.x, c.y, 50, 34);
    if (t > .6){ g.fillStyle = C.sage; g.fillRect(c.x - 20, c.y + 6, 40*ease(ph(t,.6,.66)), 5); }
    S.forEach((p,i) => {
      actor(g, p.x, p.y, 20, {v: i === obj && t < .6 ? 1 : 0, decider: i === fac});
      if (i === obj && t > .5 && t < .6) SX.flag(g, p.x + 26, p.y - 24);
      if (st >= 4 && t > .7 + i*.012 && !(i === obj && t < .6)) tick(g, p.x + 26, p.y - 22, C.sage);
    });
    SX.ring(g, c.x, c.y, 240, 180, ease(ph(t,.9,.96)));
    steps(g, 5, st, 330, 470);
    const cap = ["The proposer explains the new role", "Questions, one person at a time", "Reactions: each person once, no replies", "The proposer adjusts", "Objections: one person at a time", "Adopted in 25 minutes"];
    const sub = ["Darker outline at the top: the facilitator", "Clarifying only, no debate", "No one answers anyone else", "Using what was said", t < .6 ? "Admissions objects: her letters must stay with her team" : "The role is amended to exclude admissions letters", "Dots below: the five fixed steps"];
    caption(g, cap[st], sub[st]);
  }},
  lazy_consensus:{ P:12, draw(g,t){
    const P0 = {x:400, y:170}, S = SX.around(9, 400, 170, 290, 110, Math.PI*.05).filter((_,i) => i < 9);
    const T = SX.grid(1, 9, 140, 300, 65, 0);
    SX.card(g, P0.x, P0.y, 52, 36);
    const post = ease(ph(t,.05,.12));
    T.forEach((p,i) => { line(g, P0.x, P0.y + 18, p.x, p.y - 18, C.line, 1, [3,4]); SX.move(g, P0, p, ph(t, .08 + i*.01, .16 + i*.01), C.ink, 3); });
    [2,6].forEach((i,k) => SX.move(g, T[i], P0, ph(t, .3 + k*.12, .38 + k*.12), C.ochre, 5));
    T.forEach((p,i) => actor(g, p.x, p.y, 18, {v: t > .16 + i*.01 ? (i === 2 || i === 6 ? 0 : .35) : null}));
    const day = clamp(t/.8, 0, 1);
    for (let d = 0; d < 5; d++){ const x = 220 + d*90; g.fillStyle = day*5 > d + 1 ? C.ochre : C.paper; g.fillRect(x, 400, 80, 18); g.strokeStyle = C.line; g.strokeRect(x, 400, 80, 18); }
    actor(g, 400, 80, 22, {v:0, decider:true, ring: ease(ph(t,.84,.9))});
    if (t > .84) tick(g, P0.x + 34, P0.y - 18, C.sage);
    if (t < .16) caption(g, "“If no one objects by Friday, I'll order it”", "The proposal goes to all nine teachers");
    else if (t < .8) caption(g, "Five days to object", "Two colleagues reply with a thumbs up. No one objects");
    else caption(g, "Friday passes. The books are ordered", "Silence counted as yes, because everyone knew the rule");
  }},
  rough_consensus:{ P:13, draw(g,t){
    const S = SX.around(14, 400, 250, 300, 170, Math.PI*1.07).slice(0,14);
    const ch = {x:400, y:430}, con = [4,9];
    const look = ease(ph(t,.25,.4)), fix = ease(ph(t,.5,.6)), ok = ease(ph(t,.66,.74));
    con.forEach(i => line(g, ch.x, ch.y, S[i].x, S[i].y, C.ochre, 1 + 2*look*(1-ok), [4,4]));
    SX.card(g, 400, 250, 50, 34);
    if (fix > 0){ g.fillStyle = C.sage; g.fillRect(380, 256, 40*fix, 5); }
    S.forEach((p,i) => { const isC = con.includes(i);
      actor(g, p.x, p.y, 16, {v: isC ? lerp(1, .35, ok) : 0});
      if (isC && t > .1 && t < .66) SX.flag(g, p.x + 22, p.y - 20);
      if (isC && t > .7) tick(g, p.x + 22, p.y - 18, C.sage); });
    actor(g, ch.x, ch.y, 24, {v: null, decider:true, ring: ease(ph(t,.82,.88))});
    if (t < .1) caption(g, "Most of the group prefers the four-point scale", "No votes are counted");
    else if (t < .5) caption(g, "The chair looks at the concerns, not the numbers", "Two teachers worry it can't show small improvements");
    else if (t < .66) caption(g, "The proposal changes", "A comment box for progress notes");
    else if (t < .82) caption(g, "The two teachers can live with it", "Light colour: not their first choice, but no remaining concern");
    else caption(g, "The chair declares rough consensus", "Every concern answered, not every hand raised");
  }},
  consensus_discussion:{ P:15, draw(g,t){
    const c = {x:400, y:240}, S = SX.around(9, c.x, c.y, 220, 150);
    const need = [0, .2, .5, .8, 1, .3, .7, .1, .9];
    g.save(); g.strokeStyle = C.line; g.lineWidth = 1.4; g.beginPath(); g.arc(c.x, c.y, 62, 0, Math.PI*2); g.stroke(); g.restore();
    S.forEach((p,i) => { const s = .06 + i*.06; SX.move(g, p, c, ph(t, s, s+.06), opColor(need[i]), 6);
      if (t > s + .06){ const a0 = -Math.PI/2 + i*2*Math.PI/9; g.beginPath(); g.moveTo(c.x, c.y); g.arc(c.x, c.y, 58, a0, a0 + 2*Math.PI/9); g.closePath(); g.fillStyle = opColor(need[i]); g.globalAlpha = .9; g.fill(); g.globalAlpha = 1; } });
    S.forEach((p,i) => { actor(g, p.x, p.y, 20, {v: t > .7 ? need[i]*.4 : need[i]}); if (t > .74 + i*.012) tick(g, p.x + 26, p.y - 22, C.sage); });
    for (let d = 0; d < 3; d++){ g.beginPath(); g.arc(360 + d*40, 465, 7, 0, Math.PI*2); g.fillStyle = t > d*.28 ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.stroke(); }
    SX.ring(g, c.x, c.y, 260, 190, ease(ph(t,.88,.94)));
    if (t < .06) caption(g, "Should we trial a four-day week?", "Staff and student representatives, nine at the table");
    else if (t < .62) caption(g, "Each person says what they need first", "Childcare, planning time, projects that count. Dots below: the three meetings");
    else if (t < .88) caption(g, "A plan built from every need", "A supervised project day that counts for credit");
    else caption(g, "Everyone can support it", "Ticks: each person said yes out loud");
  }}
});
/* Scenes, part 4: Quaker practice, Indaba, Chance */
Object.assign(SCENES, {
  quaker:{ P:15, draw(g,t){
    const c = {x:400, y:250}, S = SX.around(10, c.x, c.y, 220, 160);
    const views = [null, .1, .2, 0, .9, .15, .3, 1, .1, .25];
    const speak = i => .08 + (i-1)*.055;
    for (let i = 1; i < 10; i++){ const s = speak(i), on = t > s && t < s + .03;
      if (on) SX.ring(g, S[i].x, S[i].y, 30, 30, 1);
      SX.move(g, S[i], c, ph(t, s, s + .03), opColor(views[i]), 5);
      if (t > s + .03){ const a = i*2*Math.PI/9; dot(g, c.x + 22*Math.cos(a), c.y + 22*Math.sin(a), 5, opColor(views[i])); } }
    const minute = ease(ph(t,.6,.66)), edit = ph(t,.7,.8);
    if (minute > 0){ SX.card(g, c.x, c.y, 64, 46); g.fillStyle = C.line; for (let k = 0; k < 3; k++) g.fillRect(c.x - 24, c.y - 12 + k*9, 48*minute, 3); g.fillStyle = C.sage; g.fillRect(c.x - 24, c.y + 15, 48*edit, 4); }
    if (t > .64 && t < .84){ for (let k = 0; k < 3; k++){ const r = ((t - .64)*3 + k/3) % 1; g.save(); g.globalAlpha = 1 - r; g.strokeStyle = C.ochre; g.lineWidth = 1.5; g.beginPath(); g.arc(S[0].x, S[0].y, 26 + r*60, 0, Math.PI*2); g.stroke(); g.restore(); } }
    S.forEach((p,i) => { actor(g, p.x, p.y, i ? 18 : 24, {v: i ? views[i] : null, decider: i === 0});
      if (t > .86 + i*.008 && i) tick(g, p.x + 24, p.y - 20, C.sage); });
    if (t < .08) caption(g, "The meeting begins in silence", "Dark outline: the clerk, who listens and does not argue");
    else if (t < .6) caption(g, "One person speaks, then a pause", "No one replies directly. Two teachers voice doubts");
    else if (t < .84) caption(g, "The clerk reads a draft minute aloud", "People suggest changes until the wording fits the room");
    else caption(g, "The minute is agreed", "Support for exploring a second campus, with a values group overseeing hiring");
  }},
  indaba:{ P:14, draw(g,t){
    const c = {x:400, y:250}, I = SX.around(6, c.x, c.y, 80, 64), O = SX.around(18, c.x, c.y, 290, 190, -Math.PI/2 + .17);
    const iv = [0, .2, 1, .7, .4, .9];
    for (let k = 0; k < 8; k++){ const u = ((t*5) + k*.13) % 1, a = I[k % 6], b = I[(k*2 + 1) % 6]; if (t > .06 && t < .78) SX.move(g, a, b, u, C["ink-mute"], 3); }
    [3, 9, 14].forEach((o,k) => { const s = .3 + k*.1; const u = ph(t, s, s + .07); if (u > 0 && u < 1){ const x = lerp(O[o].x, c.x, ease(u)*.7), y = lerp(O[o].y, c.y, ease(u)*.7); SX.card(g, x, y, 18, 13); } });
    [[2,.25],[5,.48]].forEach(([i,s]) => { if (t > s && t < s + .1){ SX.flag(g, I[i].x + 20, I[i].y - 18); } if (t > s + .04 && t < s + .14){ SX.card(g, I[i].x + 40, I[i].y - 18, 20, 14); g.fillStyle = C.sage; g.fillRect(I[i].x + 33, I[i].y - 20, 14, 4); } });
    const agree = ease(ph(t,.66,.76));
    I.forEach((p,i) => actor(g, p.x, p.y, 18, {v: lerp(iv[i], .2, agree)}));
    O.forEach((p,i) => { actor(g, p.x, p.y, 11, {v: null}); if (t > .84 + i*.004) tick(g, p.x + 14, p.y - 14, C.sage); });
    SX.ring(g, c.x, c.y, 118, 98, agree);
    if (t < .06) caption(g, "Six people in the centre, everyone else around them", "Two students, two teachers, two parents");
    else if (t < .66) caption(g, "Every no must come with another idea", "Red dot: an objection. Small card: the idea that comes with it. Outer cards: notes passed in");
    else if (t < .84) caption(g, "The circle agrees", "Phones in lockers during lessons, free at lunch");
    else caption(g, "The wider group endorses it", "They watched the whole conversation, so the reasons are clear");
  }},
  kleroterion:{ P:13, draw(g,t){
    const pool = SX.grid(5, 12, 70, 140, 34, 40), council = [3,4,15,16,28], drawn = [7,22,33,45,58];
    const usual = 1 - ease(ph(t,.08,.16));
    council.forEach(i => SX.ring(g, pool[i].x, pool[i].y, 16, 16, usual*.8));
    const T = SX.around(5, 640, 250, 70, 70);
    const sel = ph(t,.2,.36), mv = ease(ph(t,.38,.5));
    pool.forEach((p,i) => { const k = drawn.indexOf(i); if (k < 0){ actor(g, p.x, p.y, 10, {v:null, decider: council.includes(i) && usual > .3, alpha: .9}); } });
    drawn.forEach((idx,k) => { const p = pool[idx], q = T[k], picked = sel*5 > k;
      actor(g, lerp(p.x, q.x, mv), lerp(p.y, q.y, mv), lerp(10, 18, mv), {v: picked ? lerp(.5, [0,.3,.6,.9,.2][k], ph(t,.55,.75)) : null, ring: picked && mv === 0 ? 1 : 0}); });
    for (let d = 0; d < 4; d++){ g.beginPath(); g.arc(600 + d*28, 380, 6, 0, Math.PI*2); g.fillStyle = t > .52 + d*.06 ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.stroke(); }
    const rec = ph(t,.8,.88); if (rec > 0){ SX.card(g, lerp(640, 640, rec), lerp(250, 90, ease(rec)), 44, 30); }
    if (t > .88) SX.ring(g, 640, 90, 40, 28, ease(ph(t,.88,.94)));
    if (t < .16) caption(g, "Usually the same confident students speak for everyone", "Rings: this year's student council");
    else if (t < .5) caption(g, "Five names are drawn by lot", "No one can predict who, so no one can arrange it");
    else if (t < .8) caption(g, "They meet four times with a teacher", "Most have never been asked their opinion before");
    else caption(g, "Their ideas go into the policy", "Including a quiet room as an alternative to detention");
  }},
  venice:{ P:15, draw(g,t){
    const fac = i => (i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : .5);
    const col = (n, x, gap) => Array.from({length:n}, (_, i) => ({x, y: 250 + (i - (n-1)/2)*gap}));
    const A = col(15, 90, 26).concat(col(15, 120, 26)), B = col(10, 260, 34), Cc = col(5, 410, 48);
    A.forEach((p,i) => actor(g, p.x, p.y, 9, {v: fac(i)}));
    const s1 = ph(t,.12,.28), s2 = ph(t,.32,.46), s3 = ph(t,.5,.64);
    if (t > .06 && t < .3) SX.ring(g, 105, 250, 50, 210, .7);
    if (t > .3 && t < .48) { for (let i = 0; i < 10; i++) line(g, 130, A[i*3].y, 250, B[i].y, C.line, 1, [2,4]); }
    B.forEach((p,i) => { if (s1*10 > i) actor(g, p.x, p.y, 12, {v: fac(i*3 + (i % 3)), decider: s2 > 0 && s2*10 > i}); });
    if (t > .48 && t < .66) SX.ring(g, 260, 250, 30, 180, .7);
    Cc.forEach((p,i) => { if (s3*5 > i) actor(g, p.x, p.y, 15, {v: [.5, 0, 1, .5, .5][i]}); });
    const fin = ph(t,.68,.86);
    SX.bar(g, 520, 240, 240, 22, .64*fin, opColor(.5));
    line(g, 520 + 240*.6, 228, 520 + 240*.6, 274, C.ink, 2, [4,3]);
    actor(g, 640, 160, 22, {v: t > .86 ? .5 : null, decider:true, ring: ease(ph(t,.86,.92))});
    if (t < .12) caption(g, "Two factions have won every election for ten years", "Colours: the two factions and the unaligned");
    else if (t < .3) caption(g, "A random draw picks 30 members", "Dashed ring: chosen by lot");
    else if (t < .48) caption(g, "The 30 vote for 10", "No faction knew who would be voting");
    else if (t < .66) caption(g, "A second draw cuts them to 5, who nominate candidates", "Each random step changes whom a faction would need to pressure");
    else caption(g, "The full membership votes, needing 60%", "The winner is from neither faction, with 64%");
  }}
});
/* Scenes, part 5: Structured deliberation */
function rnd(i, k){ const x = Math.sin(i*127.1 + (k||0)*311.7)*43758.5453; return x - Math.floor(x); }
Object.assign(SCENES, {
  delphi:{ P:14, draw(g,t){
    const E8 = SX.grid(8, 1, 90, 90, 0, 46), co = {x:260, y:250};
    const truth = 404, f0 = [330, 470, 380, 520, 360, 430, 300, 450];
    const round = t < .3 ? 0 : t < .55 ? 1 : 2, shrink = [1, .5, .18][round] + (round < 2 ? 0 : 0);
    const k = round === 0 ? 1 : lerp([1,.5][round-1], shrink, ease(ph(t, round === 1 ? .3 : .55, round === 1 ? .38 : .63)));
    const mean = 405, X = v => 420 + (v - 280)*1.3;
    line(g, X(280), 420, X(540), 420, C.line, 1.4);
    E8.forEach((p,i) => { line(g, p.x, p.y, co.x, co.y, C.line, 1, [2,4]);
      const s = [.06, .3, .55][round]; SX.move(g, p, co, ph(t, s + i*.008, s + .06 + i*.008), C["ink-mute"], 3); SX.move(g, co, p, ph(t, s + .12, s + .18), C.ochre, 3);
      actor(g, p.x, p.y, 13, {v:null});
      const v = mean + (f0[i] - mean)*k, x = X(v), y = 130 + i*36;
      line(g, x, y, x, 420, C.line, .6, [1,4]); dot(g, x, y, 6, C.ink); });
    actor(g, co.x, co.y, 18, {v:null, decider:true});
    for (let r = 0; r < 3; r++){ g.beginPath(); g.arc(380 + r*30, 470, 6, 0, Math.PI*2); g.fillStyle = r <= round ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.stroke(); }
    if (t > .82){ g.save(); g.globalAlpha = ease(ph(t,.82,.88)); line(g, X(truth), 110, X(truth), 430, C.terra, 2.4, [6,4]); g.restore(); }
    if (t < .3) caption(g, "Eight people forecast alone, without names", "Dots on the right: each forecast for next year's intake");
    else if (t < .55) caption(g, "Round 2: everyone sees the range and the reasons", "Each person revises. No one knows whose forecast is whose");
    else if (t < .82) caption(g, "Round 3: the forecasts close in", "Changes follow reasons, not rank");
    else caption(g, "The actual intake", "Red dashed line: 404 students. The trust planned for 410");
  }},
  ngt:{ P:15, draw(g,t){
    const c = {x:250, y:280}, S = SX.around(10, c.x, c.y, 160, 130);
    const B = SX.grid(5, 2, 520, 110, 120, 60);
    const write = ph(t,.04,.24);
    S.forEach((p,i) => { if (t < .26 + i*.03){ SX.card(g, lerp(p.x, c.x, .35), lerp(p.y, c.y, .35), 26, 18); g.fillStyle = C.line; g.fillRect(lerp(p.x, c.x, .35) - 9, lerp(p.y, c.y, .35) - 2, 18*write, 3); } });
    S.forEach((p,i) => { const s = .26 + i*.03; SX.move(g, p, B[i], ph(t, s, s + .03), C.ink, 4); });
    const score = [3, 1, 6, 2, 1, 4, 2, 7, 1, 3], top = [7, 2, 5];
    B.forEach((q,i) => { if (t > .29 + i*.03){ SX.card(g, q.x, q.y, 96, 34); const sc = ph(t,.66,.82)*score[i]; SX.bar(g, q.x - 40, q.y + 4, 80, 6, sc/8, C.ochre, C.paper); } });
    if (t > .6 && t < .82) S.forEach((p,i) => { for (let k = 0; k < 2; k++){ const j = (i + k*3) % 10, u = ((t - .6)*4 + i*.07 + k*.3) % 1; SX.move(g, p, B[j], u, C.ochre, 2.5); } });
    top.forEach((i,k) => SX.ring(g, B[i].x, B[i].y, 62, 26, ease(ph(t,.84 + k*.02,.9 + k*.02))));
    S.forEach((p,i) => actor(g, p.x, p.y, 15, {v:null, decider: i === 0}));
    if (t < .26) caption(g, "Everyone writes ideas alone first", "Ten minutes, no talking");
    else if (t < .62) caption(g, "One idea per person, round the room", "Every idea goes on the board. No debate");
    else if (t < .84) caption(g, "Each person ranks their top five on paper", "No one sees anyone else's ranking");
    else caption(g, "The top three are funded", "A support worker's idea comes second");
  }},
  participatory_budgeting:{ P:15, draw(g,t){
    const pool = SX.grid(6, 10, 60, 120, 28, 30), com = SX.around(5, 420, 140, 46, 36);
    const P = SX.grid(1, 4, 560, 300, 0, 0).map((_,i) => ({x:560 + (i%2)*120, y: 280 + Math.floor(i/2)*110}));
    const cost = [.5, .8, .3, .6], votes = [.9, .4, .75, .3];
    [3, 17, 25, 38, 44, 52].forEach((i,k) => SX.move(g, pool[i], {x:420,y:140}, ph(t, .06 + k*.025, .12 + k*.025), C.ink, 4));
    com.forEach(p => actor(g, p.x, p.y, 12, {v:null, decider:true}));
    P.forEach((q,i) => { const a = ph(t, .3 + i*.04, .36 + i*.04); if (a > 0){ SX.move(g, {x:420,y:160}, q, a, C.ink, 4); }
      if (a >= 1){ SX.card(g, q.x, q.y, 96, 64); SX.bar(g, q.x - 40, q.y - 22, 80*cost[i], 6, 1, C.line); const v = ph(t,.55,.78)*votes[i]; SX.bar(g, q.x - 40, q.y + 12, 80, 10, v, C.ochre); } });
    if (t > .55 && t < .78) pool.forEach((p,i) => { const j = i % 4, u = ((t - .55)*3 + rnd(i)) % 1; if (rnd(i,2) < .35) SX.move(g, p, P[j], u, C.ochre, 2.5); });
    pool.forEach((p,i) => actor(g, p.x, p.y, 9, {v: t > .55 ? .3 : null}));
    [0, 2].forEach((i,k) => { const b = ease(ph(t,.82 + k*.03,.88 + k*.03)); SX.ring(g, P[i].x, P[i].y, 62, 44, b); if (b > .5){ g.fillStyle = C.sage; g.fillRect(P[i].x - 40, P[i].y - 10, 80*b, 12); } });
    if (t < .3) caption(g, "Students collect ideas from classmates", "A student steering committee gathers them");
    else if (t < .55) caption(g, "Ideas become costed proposals", "Grey bar: what each one would cost");
    else if (t < .82) caption(g, "Every student votes, by secret ballot", "Orange bars: votes so far");
    else caption(g, "The winning projects are built", "Green: built the following term");
  }},
  polis:{ P:15, draw(g,t){
    const N = 60, cl = [{x:170,y:170},{x:330,y:330},{x:150,y:380}];
    const st = SX.grid(5, 1, 640, 110, 0, 66), agreeAll = 2;
    const sort = ease(ph(t,.2,.55));
    for (let i = 0; i < N; i++){ const k = i % 3, a = rnd(i)*Math.PI*2, r = 18 + rnd(i,1)*48;
      const x0 = 80 + rnd(i,3)*420, y0 = 100 + rnd(i,4)*330, x1 = cl[k].x + r*Math.cos(a), y1 = cl[k].y + r*.8*Math.sin(a);
      const v = sort > .3 ? [0, 1, .5][k] : null;
      actor(g, lerp(x0, x1, sort), lerp(y0, y1, sort), 7, {v}); }
    if (t > .06 && t < .55) for (let k = 0; k < 6; k++){ const i = Math.floor(rnd(k, Math.floor(t*20))*N); const u = (t*20) % 1; SX.move(g, {x: 80 + rnd(i,3)*420, y: 100 + rnd(i,4)*330}, st[k % 5], u, C["ink-mute"], 2.5); }
    st.forEach((q,i) => { SX.card(g, q.x, q.y, 120, 40); [0,1,.5].forEach((v,k) => { const sh = i === agreeAll ? .85 : [.8,.2,.5][(i + k) % 3]; SX.bar(g, q.x - 50, q.y - 10 + k*8, 100, 5, sh*ph(t,.3,.6), opColor(v), C.paper); }); });
    const hi = ease(ph(t,.62,.72));
    if (hi > 0){ cl.forEach(c => line(g, c.x, c.y, st[agreeAll].x - 60, st[agreeAll].y, C.ochre, 1.6*hi, [4,4])); SX.ring(g, st[agreeAll].x, st[agreeAll].y, 76, 32, hi); }
    if (t < .2) caption(g, "300 people react to short statements", "Agree, disagree or pass. No replies to each other");
    else if (t < .6) caption(g, "The software groups people by how they vote", "Three groups appear. Bars: how much each group agrees with each statement");
    else caption(g, "It shows what every group agrees with", "“Sleep matters, and bus timing is the real obstacle”");
  }}
});
/* Scenes, part 6: Weighted and delegated votes */
Object.assign(SCENES, {
  dao_token:{ P:14, draw(g,t){
    const big = [{x:200,y:150},{x:330,y:120},{x:200,y:290}], small = SX.grid(4, 9, 430, 110, 38, 52);
    const grow = ease(ph(t,.25,.7)), fade = ease(ph(t,.55,.8));
    const P = {x:330, y:420}; SX.card(g, P.x, P.y, 56, 36);
    const rb = [34, 30, 26].map(r => r + 14*grow);
    if (t > .25 && t < .7) small.forEach((p,i) => { if (i % 4 === 0){ const u = ((t - .25)*3 + rnd(i)) % 1; SX.move(g, P, big[i % 3], u, C.ochre, 3); } });
    big.forEach((p,i) => { line(g, p.x, p.y, P.x, P.y, C.ink, 2 + 4*grow, null); });
    small.forEach((p,i) => { if (fade < .9 || i % 5 === 0) line(g, p.x, p.y, P.x, P.y, C.line, .6*(1 - fade*.8), [2,4]); });
    big.forEach((p,i) => actor(g, p.x, p.y, rb[i], {v:0, decider:true}));
    small.forEach((p,i) => actor(g, p.x, p.y, 9, {v: 1, inner: fade > .5 && i % 3 ? 1 : null, alpha: 1 - .6*fade*(i % 5 ? 1 : 0)}));
    SX.bar(g, 470, 450, 260, 16, .62 + .26*grow, C.ochre, C.sage);
    SX.ring(g, P.x, P.y, 46, 30, ease(ph(t,.84,.9)));
    if (t < .25) caption(g, "Votes count by tokens held", "Three large holders, many small ones. Bar: share of all voting power");
    else if (t < .55) caption(g, "Large holders vote themselves token rewards", "Each reward adds to their voting power");
    else if (t < .84) caption(g, "Small holders stop voting", "Their votes rarely change anything. Inner dots: disagreement no one sees");
    else caption(g, "A few wallets decide", "The course creators, who do most of the work, hold few tokens");
  }},
  liquid:{ P:14, draw(g,t){
    const M = SX.grid(5, 8, 90, 110, 52, 56), dA = 13, dB = 26, bA = {x:640, y:150}, bB = {x:640, y:350};
    const delegA = [4, 5, 12, 20, 21], delegB = [0, 1, 2, 8, 9, 10, 16, 17, 18, 24, 25, 32, 33, 34];
    const back = 18, tb = ph(t,.62,.7);
    SX.card(g, bA.x, bA.y, 70, 44); SX.card(g, bB.x, bB.y, 70, 44); dot(g, bA.x, bA.y, 8, opColor(0)); dot(g, bB.x, bB.y, 8, opColor(1));
    delegA.forEach(i => SX.arrow(g, M[i].x, M[i].y, lerp(M[i].x, M[dA].x, .82), lerp(M[i].y, M[dA].y, .82), opColor(0), 1.3));
    delegB.forEach(i => { if (i === back && tb > .5) return; SX.arrow(g, M[i].x, M[i].y, lerp(M[i].x, M[dB].x, .82), lerp(M[i].y, M[dB].y, .82), opColor(1), 1.3*(i === back ? 1 - tb : 1)); });
    const vA = ph(t,.1,.4), vB = ph(t,.3,.6);
    M.forEach((p,i) => { if (!delegA.includes(i) && i !== dA) SX.move(g, p, bA, ph(t, .1 + rnd(i)*.2, .16 + rnd(i)*.2), opColor(0), 2.5);
      if ((!delegB.includes(i) || (i === back && tb > .5)) && i !== dB) SX.move(g, p, bB, ph(t, .3 + rnd(i,2)*.2 + (i === back ? .42 : 0), .36 + rnd(i,2)*.2 + (i === back ? .42 : 0)), opColor(1), 2.5); });
    SX.move(g, M[dA], bA, ph(t,.36,.42), opColor(0), 2.5 + delegA.length*.8); SX.move(g, M[dB], bB, ph(t,.56,.62), opColor(1), 2.5 + delegB.length*.6);
    M.forEach((p,i) => actor(g, p.x, p.y, i === dA ? 18 : i === dB ? 22 - 2*tb : 10, {v: i === dA ? 0 : i === dB ? 1 : null, decider: i === dA || i === dB, ring: i === back ? (t > .62 && t < .76 ? 1 : 0) : 0}));
    if (t < .1) caption(g, "Members vote on each subject, or pass that vote on", "Arrows: votes passed to a trusted colleague, one colour per subject");
    else if (t < .62) caption(g, "Reading votes, then science votes", "A colleague who teaches science holds many science votes");
    else if (t < .8) caption(g, "One member takes her science vote back", "Votes can be withdrawn at any time");
    else caption(g, "Recommendations combine direct and delegated votes", "Delegates keep their votes only while people trust them");
  }},
  conviction:{ P:16, draw(g,t){
    const S = SX.grid(4, 5, 80, 120, 46, 70);
    const props = [{x:380, need:.3, rate:1.4, small:true}, {x:480, need:.75, rate:.9}, {x:580, need:.75, rate:.4}, {x:680, need:.75, rate:.25}];
    props.forEach((p,i) => { const base = 430, h = 300, fill = clamp(t*p.rate*(i === 1 ? (t > .4 ? 1.15 : .7) : 1), 0, 1);
      g.fillStyle = C.paper; g.fillRect(p.x - 20, base - h, 40, h); g.strokeStyle = C.line; g.strokeRect(p.x - 20, base - h, 40, h);
      const passed = fill >= p.need; g.fillStyle = passed ? C.sage : C.ochre; g.fillRect(p.x - 20, base - h*Math.min(fill, p.need + .02), 40, h*Math.min(fill, p.need + .02));
      line(g, p.x - 28, base - h*p.need, p.x + 28, base - h*p.need, C.ink, 2, [4,3]);
      if (passed) SX.ring(g, p.x, base - h*p.need, 36, 18, 1); });
    S.forEach((p,i) => { const j = i % 4, u = ((t*3) + rnd(i)) % 1; SX.move(g, p, {x: props[j].x, y: 420}, u, C.ochre, 2.5); actor(g, p.x, p.y, 12, {v:.2}); });
    if (t < .3) caption(g, "Teachers back projects with their points", "Backing builds the longer it stays. Dashed lines: thresholds");
    else if (t < .7) caption(g, "A small request passes first", "Reading-corner books: lower threshold, funded in two weeks");
    else caption(g, "The maker space passes later", "It needed more colleagues to back it over three months");
  }},
  futarchy:{ P:15, draw(g,t){
    const S = SX.grid(3, 5, 90, 130, 50, 60), weak = [10, 11, 12];
    const goal = {x:400, y:90}, A = {x:560, y:240}, B = {x:560, y:360};
    SX.card(g, goal.x, goal.y, 60, 36); line(g, goal.x - 8, goal.y + 10, goal.x - 8, goal.y - 12, C.ink, 1.6); g.fillStyle = C.ochre; g.fillRect(goal.x - 8, goal.y - 12, 16, 9);
    S.forEach((p,i) => SX.move(g, p, goal, ph(t, .04 + rnd(i)*.08, .1 + rnd(i)*.08), C.ink, 3));
    SX.ring(g, goal.x, goal.y, 44, 28, ease(ph(t,.16,.22)));
    const pa = lerp(.5, .78, ease(ph(t,.3,.62))), pb = 1 - pa;
    [A, B].forEach((q,k) => { SX.card(g, q.x, q.y, 80, 44); SX.bar(g, q.x + 60, q.y - 8, 150, 16, k ? pb : pa, opColor(k ? 1 : 0)); });
    if (t > .28 && t < .62) S.forEach((p,i) => { const toA = weak.includes(i) || rnd(i,5) < .55; const u = ((t - .28)*4 + rnd(i,6)) % 1; SX.move(g, p, toA ? A : B, u, opColor(toA ? 0 : 1), weak.includes(i) ? 5 : 3); });
    S.forEach((p,i) => actor(g, p.x, p.y, 15, {v: null, decider: weak.includes(i)}));
    SX.ring(g, A.x, A.y, 56, 32, ease(ph(t,.64,.7)));
    const out = ease(ph(t,.74,.9)); SX.bar(g, 340, 450, 300, 14, .55 + .3*out, C.sage); line(g, 340 + 300*.78, 440, 340 + 300*.78, 474, C.ink, 2, [4,3]);
    if (t < .22) caption(g, "Staff vote on the goal", "More Year 8 students reading at their age level");
    else if (t < .64) caption(g, "Then they bet points on which programme gets there", "Dark outlines: teachers who work with weak readers. They bet heavily on small groups");
    else if (t < .74) caption(g, "The school chooses the market's favourite", "The small-group programme");
    else caption(g, "By June, the share has risen", "Further than the market predicted (dashed line)");
  }}
});
/* Scenes, part 7: No one in charge */
Object.assign(SCENES, {
  polycentric:{ P:15, hero:.3, legend:["s","d"], draw(g,t){
    const H = [{x:200,y:150},{x:600,y:150},{x:200,y:360},{x:600,y:360}], hv = HERO ? [0, .35, .7, 1] : [0, .5, .9, .3];
    SX.box(g, 60, 50, 680, 410, [6,6], C.line);
    const meet = t > .45 && t < .75;
    H.forEach((h,i) => H.forEach((k,j) => { if (j > i) line(g, h.x, h.y, k.x, k.y, meet ? C.ochre : C.line, meet ? 1.6 : .8, [3,5]); }));
    if (meet){ [1,2].forEach((j,k) => SX.move(g, H[0], H[j], ph(t,.5 + k*.08,.6 + k*.08), opColor(hv[0]), 6)); }
    const adopt = ease(ph(t,.75,.85));
    H.forEach((h,i) => { const mem = SX.around(5, h.x, h.y, 70, 52);
      const v = (i === 1 || i === 2) ? lerp(hv[i], hv[0], adopt) : hv[i];
      mem.forEach((p,k) => { line(g, h.x, h.y, p.x, p.y, C.line, 1); const pulse = (Math.sin(t*20 + i + k) + 1)/2; actor(g, p.x, p.y, 10, {v: HERO ? clamp(v + (rnd(i*5 + k, 7) - .5)*.35, 0, 1) : (t > .08 ? v : null), alpha: HERO ? 1 : .7 + .3*pulse}); });
      actor(g, h.x, h.y, 18, {v, decider:true}); });
    if (t < .08) caption(g, "Four clusters under one national curriculum", "Dashed frame: the shared standards");
    else if (t < .45) caption(g, "Each cluster organises teaching its own way", "Different colours: different approaches");
    else if (t < .75) caption(g, "They meet each term to share results", "Longer science blocks are working in one cluster");
    else caption(g, "Two others try it the next year", "No one ordered it. The idea travelled through the network");
  }},
  no_structure:{ P:15, draw(g,t){
    const F = [{x:170,y:200},{x:220,y:160},{x:250,y:220},{x:200,y:260}];
    const N = [{x:420,y:120},{x:560,y:140},{x:680,y:200},{x:470,y:260},{x:620,y:300},{x:420,y:380},{x:560,y:410},{x:700,y:400}];
    F.forEach((a,i) => F.forEach((b,j) => { if (j > i) line(g, a.x, a.y, b.x, b.y, C.ink, 2.2); }));
    if (t < .3) for (let k = 0; k < 6; k++){ const u = ((t*6) + k*.2) % 1; SX.move(g, F[k % 4], F[(k+1) % 4], u, C.ochre, 3); }
    const plan = ease(ph(t,.3,.36)); if (plan > 0) SX.card(g, 300, 210, 44, 30);
    if (plan > 0){ g.fillStyle = C.ochre; g.fillRect(284, 204, 32*plan, 5); }
    N.forEach((p,i) => { const s = .4 + i*.03; if (t > s && t < s + .12){ SX.card(g, p.x + 26, p.y - 22, 20, 14); }
      const leave = i < 6 ? ease(ph(t, .62 + i*.03, .7 + i*.03)) : 0;
      actor(g, p.x, p.y, 16, {v: 1, inner: t > .55 ? 1 : null, alpha: 1 - .8*leave}); });
    F.forEach(p => actor(g, p.x, p.y, 18, {v:0}));
    SX.ring(g, 300, 210, 40, 28, ease(ph(t,.5,.56)));
    if (t < .3) caption(g, "No committee, no rules", "Thick lines: four friends who meet for coffee every week");
    else if (t < .55) caption(g, "The friends arrive with a plan already agreed", "New parents' ideas (small cards) are welcomed, then go nowhere");
    else if (t < .9) caption(g, "New parents stop coming", "Inner dots: each thinks the problem is only them");
    else caption(g, "The structure was there all along", "It was the friendship group, hidden and impossible to challenge");
  }},
  bees:{ P:16, draw(g,t){
    const hive = {x:130, y:250}, sites = [{x:560,y:110,q:.4},{x:650,y:260,q:1},{x:560,y:410,q:.6}];
    sites.forEach(s => { g.save(); g.fillStyle = mix(C.paper, C.ochre, s.q*.6); g.strokeStyle = C["ink-soft"]; g.lineWidth = 1.4; g.beginPath(); g.moveTo(s.x, s.y - 34); for (let k = 1; k <= 6; k++){ const a = -Math.PI/2 + k*Math.PI/3; g.lineTo(s.x + 34*Math.cos(a), s.y + 34*Math.sin(a)); } g.closePath(); g.fill(); g.stroke(); g.restore(); });
    const scouts = 6, firstSite = [0, 1, 2, 2, 0, 1];
    let atBest = 0;
    for (let i = 0; i < scouts; i++){
      const s1 = .05 + i*.03, back = s1 + .14, s2 = back + .12 + i*.02;
      const second = i < 4 ? 1 : firstSite[i];
      const site = t < s2 ? sites[firstSite[i]] : sites[second];
      let p;
      if (t < s1) p = hive; else if (t < s1 + .08) p = {x: lerp(hive.x, sites[firstSite[i]].x - 40, ease(ph(t, s1, s1 + .08))), y: lerp(hive.y, sites[firstSite[i]].y, ease(ph(t, s1, s1 + .08)))};
      else if (t < back) p = {x: sites[firstSite[i]].x - 40, y: sites[firstSite[i]].y};
      else if (t < back + .08) p = {x: lerp(sites[firstSite[i]].x - 40, hive.x + 40, ease(ph(t, back, back + .08))), y: lerp(sites[firstSite[i]].y, hive.y + (i - 2.5)*16, ease(ph(t, back, back + .08)))};
      else if (t < s2) { const w = Math.sin(t*120 + i)*6*sites[firstSite[i]].q; p = {x: hive.x + 40 + w, y: hive.y + (i - 2.5)*16}; }
      else { const u = ease(ph(t, s2, s2 + .08)); p = {x: lerp(hive.x + 40, site.x - 40, u), y: lerp(hive.y + (i - 2.5)*16, site.y + (i - 2.5)*8, u)}; if (u >= 1 && second === 1) atBest++; }
      actor(g, p.x, p.y, 9, {v: t > s1 + .08 ? (sites[t < s2 ? firstSite[i] : second] === sites[1] ? 0 : .6) : null});
    }
    for (let k = 0; k < 4; k++){ g.beginPath(); g.arc(700 + k*0, 200 - k*0 + 0, 0, 0, 0); }
    for (let k = 0; k < 4; k++){ dot(g, 620 + k*20, 320, 6, k < atBest ? C.ink : C.line); }
    actor(g, hive.x, hive.y, 34, {v:null, decider:true, ring: atBest >= 4 ? ease(ph(t,.82,.88)) : 0});
    if (atBest >= 4) SX.ring(g, sites[1].x, sites[1].y, 50, 50, ease(ph(t,.82,.88)));
    if (t < .2) caption(g, "Six staff each visit possible sites alone", "Shapes on the right: sites. Deeper colour: a better site");
    else if (t < .42) caption(g, "They report back, more keenly for better sites", "The wiggle: how enthusiastic each report is");
    else if (t < .82) caption(g, "Others go and see the best-sounding site", "Dots under it: staff who have checked it themselves");
    else caption(g, "Four have backed the same site. Decided", "The quorum waits for enough independent checks");
  }},
  herd:{ P:14, draw(g,t){
    const N = 40, inf = [5, 14, 27, 36], P = [];
    for (let i = 0; i < N; i++) P.push({x: 120 + (i % 8)*50 + rnd(i)*20, y: 120 + Math.floor(i/8)*58 + rnd(i,1)*20, a: rnd(i,2)*Math.PI*2});
    const align = ease(ph(t,.15,.55)), go = ease(ph(t,.55,.95));
    P.forEach((p,i) => { const isI = inf.includes(i); const near = Math.min(...inf.map(j => Math.hypot(P[j].x - p.x, P[j].y - p.y)));
      const ai = isI ? 0 : clamp(align*1.6 - near/220, 0, 1);
      const a = lerp(p.a, p.a > Math.PI ? Math.PI*2 : 0, isI ? 1 : ai), x = p.x + go*260*(isI ? 1 : clamp(ai*1.1, 0, 1)), y = p.y;
      line(g, x, y, x + 18*Math.cos(a), y + 18*Math.sin(a), C["ink-soft"], 1.6);
      actor(g, x, y, 9, {v: isI ? 0 : (ai > .6 ? .2 : null), decider: isI}); });
    SX.box(g, 680, 100, 100, 320, [4,5], C.ochre);
    if (t < .15) caption(g, "600 students need to reach the right fields", "Lines: the way each person is facing. Dark outlines: marshals with route cards");
    else if (t < .55) caption(g, "The marshals just start walking", "People nearby turn to follow them");
    else caption(g, "The crowd moves together", "No announcement. A few informed people, spread out, were enough");
  }},
  stigmergy:{ P:14, draw(g,t){
    const A = {x:110, y:250}, B = {x:690, y:250};
    const routes = [{dy:0, w:1}, {dy:-130, w:.35}, {dy:120, w:.3}];
    const use = routes.map(r => clamp(t*1.4, 0, 1) * r.w);
    const pave = ease(ph(t,.82,.9));
    routes.forEach((r,k) => { g.save(); g.strokeStyle = k === 0 && pave > 0 ? mix(C.line, C["ink-soft"], pave) : C.line; g.lineWidth = 1 + 14*use[k]*(k === 0 ? 1 : 1 - pave*.8); g.globalAlpha = .25 + .75*use[k]; g.lineCap = "round";
      g.beginPath(); g.moveTo(A.x, A.y); g.quadraticCurveTo(400, 250 + r.dy*2, B.x, B.y); g.stroke(); g.restore(); });
    for (let i = 0; i < 14; i++){ const k = rnd(i) < .2 + .5*(1 - clamp(t*1.4, 0, 1))*.6 ? (rnd(i,1) < .5 ? 1 : 2) : 0, u = ((t*3) + rnd(i,2)) % 1, dir = i % 2;
      const s = dir ? 1 - u : u, x = (1-s)*(1-s)*A.x + 2*(1-s)*s*400 + s*s*B.x, y = (1-s)*(1-s)*A.y + 2*(1-s)*s*(250 + routes[k].dy*2) + s*s*B.y;
      if (t < .82) dot(g, x, y, 4, C.ink); }
    [A, B].forEach(p => { g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.6; g.fillRect(p.x - 40, p.y - 60, 80, 120); g.strokeRect(p.x - 40, p.y - 60, 80, 120); });
    SX.ring(g, 400, 250, 300, 40, pave);
    if (t < .2) caption(g, "A new campus: lawns, no paths", "Students cross however they like");
    else if (t < .82) caption(g, "Each crossing wears the grass a little", "Worn routes get used more. The shortest gets used most");
    else caption(g, "The worn track is paved", "A path no one designed, matching how people move");
  }},
  slime_mould:{ P:15, draw(g,t){
    const S = SX.around(8, 400, 250, 280, 170, -Math.PI/2 + .3);
    const keep = new Set(["0-1","1-2","2-3","3-4","4-5","5-6","6-7","0-7","0-4","2-6"]);
    const prune = ease(ph(t,.35,.75)), grow = ease(ph(t,.25,.7));
    S.forEach((a,i) => S.forEach((b,j) => { if (j <= i) return; const k = keep.has(i + "-" + j);
      const w = k ? 1 + 5*grow*(0.5 + rnd(i*8+j)) : 1*(1 - prune);
      if (w > .05){ g.save(); g.globalAlpha = k ? 1 : (1 - prune); line(g, a.x, a.y, b.x, b.y, k ? C.ochre : C.line, w); g.restore(); }
      if (k && t > .1){ const u = ((t*2) + rnd(i,j)) % 1; SX.move(g, a, b, u, C.ink, 2.5); } }));
    S.forEach(p => actor(g, p.x, p.y, 18, {v:null, decider:true}));
    if (t < .25) caption(g, "Eight schools, a working group between every pair", "Lines: links between schools");
    else if (t < .75) caption(g, "Busy links get more support. Idle ones fade", "Moving dots: materials actually being shared");
    else caption(g, "A year later: fewer links, used weekly", "The network took the shape of how schools really work together");
  }}
});
/* Scenes, part 8: second scenes, one per example, keyed "id:kind" */
Object.assign(SCENES, {
  "autocracy:useful":{ P:10, draw(g,t){
    /* lab pairs on the base autocracy drawing: the teacher decides alone, posts the pairs, explains, students pair up */
    const D = {x:400, y:120}, n = 8;
    const home = i => ({x: 120 + i*80, y: 360 + (i % 2)*22});
    const pairAt = i => { const order = [0,3,1,6,2,4,5,7], k = order.indexOf(i), p = Math.floor(k/2); return {x: 190 + p*140 + (k % 2 ? 22 : -22), y: 370}; };
    const dec = ease(ph(t,.06,.2)), go = ph(t,.74,.92);
    for (let i = 0; i < n; i++){ const h = home(i), s = .26 + i*.025, a = ph(t, s, s + .08);
      line(g, D.x, D.y + 30, h.x, h.y - 18, C.line, 1.1, [3,4]);
      if (a > 0 && a < 1) dot(g, lerp(D.x, h.x, a), lerp(D.y + 30, h.y - 18, a), 4.5, C.ochre); }
    if (t > .52 && t < .7){ for (let k = 0; k < 3; k++){ const r = ((t - .52)*7 + k/3) % 1; g.save(); g.globalAlpha = .8*(1 - r); g.strokeStyle = C.ochre; g.lineWidth = 2; g.beginPath(); g.arc(D.x, D.y, 30 + r*240, 0, Math.PI*2); g.stroke(); g.restore(); } }
    for (let i = 0; i < n; i++){ const h = home(i), p = pairAt(i), u = ease(clamp((go - (i % 4)*.05)/.8, 0, 1));
      const friends = i < 6, v = t > .62 ? 0 : (t > .34 && friends ? 1 : null);
      actor(g, lerp(h.x, p.x, u), lerp(h.y, p.y, u), 15, {v}); }
    if (t > .94) for (let p = 0; p < 4; p++) tick(g, 190 + p*140, 410, C.sage);
    actor(g, D.x, D.y, 26, {v: dec > 0 ? 0 : null, decider:true, ring: dec});
    if (t < .26) caption(g, "Before term, the teacher plans the lab pairs alone", "She uses what she knows about who works carefully and who needs support");
    else if (t < .5) caption(g, "She posts the list before the first practical", "Some students wanted to work with their friends");
    else if (t < .74) caption(g, "At the start of the lesson she explains why", "Safety comes first, and everyone gets a partner");
    else caption(g, "The pairs work through the term's practicals", "No one is left without a partner");
  }},
  "autocracy:risky":{ P:11, draw(g,t){
    /* the head cancels swimming alone; teachers and students both feel it */
    const D = {x:400, y:110}, pool = {x:400, y:240}, P = SX.grid(1, 3, 200, 380, 60, 0), S = SX.grid(1, 4, 510, 380, 50, 0);
    const dec = ease(ph(t,.1,.3)), hit = ease(ph(t,.55,.7));
    g.save(); g.globalAlpha = 1 - .5*dec; g.fillStyle = opColor(1); g.fillRect(pool.x - 60, pool.y - 20, 120, 40); g.restore();
    if (dec > 0){ g.save(); g.globalAlpha = dec; g.strokeStyle = C.terra; g.lineWidth = 3; g.beginPath(); g.moveTo(pool.x - 60, pool.y); g.lineTo(pool.x + 60, pool.y); g.stroke(); g.restore(); }
    P.concat(S).forEach((p,i) => { actor(g, p.x, p.y, 14, {v: .5}); if (hit > 0){ g.save(); g.globalAlpha = hit; SX.flag(g, p.x + 16, p.y - 16, C.terra); g.restore(); } });
    actor(g, D.x, D.y, 22, {v: dec > 0 ? 0 : null, decider:true, ring: dec*(1 - hit)});
    if (t < .5) caption(g, "The swimming coach quits, and money is tight", "The head of activities cancels swimming for the year, alone");
    else caption(g, "Teachers and students feel it", "No one who would be affected was asked");
  }},
  "consultative:useful":{ P:12, draw(g,t){
    /* the head asks four teachers, each trials the schemes and writes a note, the notes reach her separately, she decides and explains */
    const H = {x:400, y:385}, view = [0,0,1,0];
    const pos = [0,1,2,3].map(i => ({x:160 + i*160, y:140}));
    pos.forEach((p,i) => line(g, p.x, p.y + 30, H.x, H.y - 34, C.line, 1.2, [3,4]));
    /* step 1: she asks each teacher */
    pos.forEach((p,i) => { const a = ph(t, .05 + i*.03, .15 + i*.03); if (a > 0 && a < 1) dot(g, lerp(H.x, p.x, ease(a)), lerp(H.y - 34, p.y + 30, ease(a)), 4.5, C["ink-soft"]); });
    /* step 2: each teacher trials the schemes and writes a note */
    const tried = ph(t,.28,.45);
    /* step 3: the notes travel down one at a time */
    let recv = 0, got = 0;
    pos.forEach((p,i) => { const s = .52 + i*.05, a = ph(t, s, s + .08);
      if (tried > 0 && a <= 0){ g.save(); g.globalAlpha = clamp(tried*2 - i*.2, 0, 1); SX.card(g, p.x + 34, p.y + 4, 18, 14); g.restore(); }
      if (a > 0 && a < 1){ SX.card(g, lerp(p.x + 34, H.x + 40, ease(a)), lerp(p.y + 4, H.y - 6, ease(a)), 18, 14); }
      if (a >= 1){ recv += view[i]; got++; } });
    if (got) for (let k = 0; k < got; k++) SX.card(g, H.x + 40 + k*4, H.y - 6 - k*4, 18, 14);
    pos.forEach((p,i) => actor(g, p.x, p.y, 22, {v: tried > .3 + i*.1 ? view[i] : null}));
    /* step 4: she decides and explains to everyone */
    const dec = ease(ph(t,.76,.84));
    if (t > .84 && t < .97){ for (let k = 0; k < 3; k++){ const r = ((t - .84)*7 + k/3) % 1; g.save(); g.globalAlpha = .8*(1 - r); g.strokeStyle = C.ochre; g.lineWidth = 2; g.beginPath(); g.arc(H.x, H.y, 30 + r*260, 0, Math.PI*2); g.stroke(); g.restore(); } }
    actor(g, H.x, H.y, 28, {v: dec > 0 ? 0 : (got ? recv/got : null), decider:true, ring: dec});
    if (t < .25) caption(g, "The head needs a new reading scheme for Years 1 to 3", "She tells the teachers she will decide, after hearing from each of them");
    else if (t < .5) caption(g, "Each teacher trials two schemes for a week", "They write a short note on what worked for their weakest readers");
    else if (t < .76) caption(g, "The notes reach the head before any meeting", "Each teacher's view arrives on its own, before anyone hears hers");
    else caption(g, "She chooses, and explains why at the staff meeting", "Most teachers found the chosen scheme easiest for struggling readers");
  }},
  "consultative:risky":{ P:13, draw(g,t){
    /* a rushed consultation: one letter, five days; two parents reply; the rest miss it and object once the change starts */
    const H = {x:400, y:385}, view = [1,0,1,1,0,1], replies = [1,4];
    const pos = view.map((_,i) => ({x:130 + i*108, y:140}));
    pos.forEach(p => line(g, p.x, p.y + 26, H.x, H.y - 34, C.line, 1.2, [3,4]));
    /* step 1: the proposal and the deadline */
    const prop = ease(ph(t,.04,.14));
    g.save(); g.globalAlpha = prop; SX.card(g, H.x + 52, H.y + 8, 30, 22); g.restore();
    /* steps 2-3: the window runs out */
    const win = 1 - ph(t,.27,.74);
    if (t > .2 && t < .78){ g.save(); g.strokeStyle = C.line; g.lineWidth = 6; g.lineCap = "round";
      g.beginPath(); g.moveTo(H.x - 60, H.y + 52); g.lineTo(H.x + 60, H.y + 52); g.stroke();
      g.strokeStyle = C.ochre; g.beginPath(); g.moveTo(H.x - 60, H.y + 52); g.lineTo(H.x - 60 + 120*win, H.y + 52); g.stroke(); g.restore(); }
    /* step 2: one letter goes out */
    pos.forEach((p,i) => { const a = ph(t, .27 + i*.02, .37 + i*.02); if (a > 0 && a < 1) dot(g, lerp(H.x, p.x, ease(a)), lerp(H.y - 34, p.y + 26, ease(a)), 4.5, C["ink-soft"]); });
    /* step 3: only two reply in time */
    replies.forEach((i,k) => { const p = pos[i], a = ph(t, .55 + k*.06, .65 + k*.06); if (a > 0 && a < 1) dot(g, lerp(p.x, H.x, ease(a)), lerp(p.y + 26, H.y - 34, ease(a)), 5, opColor(view[i])); });
    const missed = t > .5 && t < .8;
    /* step 4: she decides; the change starts; the others object */
    const dec = ease(ph(t,.78,.86)), late = t > .88;
    pos.forEach((p,i) => { if (replies.includes(i)) return; const a = ph(t, .9 + i*.012, .97 + i*.012); if (a > 0 && a < 1) dot(g, lerp(p.x, H.x, ease(a)), lerp(p.y + 26, H.y - 34, ease(a)), 5, opColor(view[i])); });
    pos.forEach((p,i) => { const r = replies.includes(i);
      actor(g, p.x, p.y, 20, {v: r ? (t > .55 ? view[i] : null) : (late ? view[i] : null), alpha: missed && !r ? .35 : 1}); });
    actor(g, H.x, H.y, 28, {v: dec > 0 ? 0 : (t > .7 ? 0 : null), decider:true, ring: dec});
    if (t < .25) caption(g, "The principal proposes ending school at lunchtime on Fridays", "She wants the change in place by next term");
    else if (t < .5) caption(g, "Parents get one letter and five days to reply", "There is no meeting, and nothing on childcare or cost");
    else if (t < .78) caption(g, "Only a few parents reply before the deadline", "Many working parents miss the letter or have no time to ask questions");
    else caption(g, "The change goes ahead on the replies she has", "Parents who missed the survey find out when it starts, and object");
  }},
  "oligarchy:useful":{ P:12, draw(g,t){
    /* five heads of maths score alone, compare, decide, and publish the scores to every maths teacher */
    const core = SX.around(5, 400, 120, 48, 34), fam = SX.grid(3, 10, 130, 300, 60, 52);
    const start = [0,1,0,0,1], conv = ease(ph(t,.56,.7));
    /* step 2: each scores alone */
    const score = ph(t,.27,.45);
    core.forEach((p,i) => { const a = clamp(score*2 - i*.15, 0, 1); if (a > 0 && t < .52){ g.save(); g.globalAlpha = a; SX.card(g, p.x + (p.x >= 400 ? 26 : -26), p.y + 2, 16, 12); g.restore(); } });
    /* step 3: they compare and converge */
    if (t > .5 && t < .7) for (let k = 0; k < 6; k++){ const u = ((t*6 + k*.17) % 1), a = core[k%5], b = core[(k+2)%5]; SX.move(g, a, b, u, C["ink-mute"], 3); }
    const dec = ease(ph(t,.66,.72));
    SX.ring(g, 400, 120, 92, 74, dec);
    /* step 4: scores and reasons go to every teacher */
    fam.forEach((p,i) => { const s = .76 + (i%10)*.01, a = ph(t, s, s + .06); if (a > 0 && a < 1) SX.move(g, {x:400,y:150}, p, a, C.ochre, 3.5); if (a >= 1) dot(g, p.x, p.y - 18, 3, C.ochre); });
    fam.forEach(p => actor(g, p.x, p.y, 12, {v:null}));
    core.forEach((p,i) => actor(g, p.x, p.y, 16, {v: t > .27 ? lerp(start[i], 0, conv) : null, decider:true}));
    if (t < .27) caption(g, "A national maths paper turns out harder than planned", "Five senior examiners must decide the mark that earns each grade");
    else if (t < .5) caption(g, "Each examiner reviews sample scripts alone", "They compare this year's work with work that earned each grade before");
    else if (t < .76) caption(g, "They meet and agree on the boundaries", "Statistics on how this group of students did before guide the discussion");
    else caption(g, "The boundaries are published on results day", "Every school can see where each grade began");
  }},
  "oligarchy:risky":{ P:13, draw(g,t){
    /* a small panel writes the curriculum, it goes to every school at once, many teachers struggle and families pay, and a national review follows */
    const core = SX.around(5, 400, 120, 48, 34), fam = SX.grid(3, 10, 130, 300, 60, 52);
    const hard = i => [1,4,7,9,12,16,18,21,23,26,28].includes(i);
    if (t < .24) for (let k = 0; k < 6; k++){ const u = ((t*6 + k*.17) % 1), a = core[k%5], b = core[(k+2)%5]; SX.move(g, a, b, u, C["ink-mute"], 3); }
    const dec = ease(ph(t,.18,.24));
    SX.ring(g, 400, 120, 92, 74, dec);
    if (t > .14){ g.save(); g.globalAlpha = ease(ph(t,.14,.2)); SX.card(g, 400, 196, 40, 26); g.restore(); }
    /* the curriculum reaches every school in the same moment */
    fam.forEach(p => { const a = ph(t, .3, .42); if (a > 0 && a < 1) SX.move(g, {x:400, y:210}, p, a, C["ink-soft"], 3.5); if (t >= .42) SX.card(g, p.x, p.y - 22, 12, 9); });
    const strain = t > .52;
    fam.forEach((p,i) => { const hit = strain && hard(i);
      actor(g, p.x, p.y, 12, {v: 0, alpha: hit ? .45 : 1});
      if (hit && t < .86) SX.flag(g, p.x + 11, p.y - 12); });
    /* step 4: views from schools and families travel back to the centre */
    if (t > .84) fam.forEach((p,i) => { if (!hard(i)) return; const u = ((t - .84)/.16*1.6 + i*.05) % 1; SX.move(g, p, {x:400, y:150}, u, C.sage, 3); });
    core.forEach(p => actor(g, p.x, p.y, 16, {v: 1, decider:true}));
    if (t < .26) caption(g, "An expert panel writes a new national curriculum", "Teachers are told about it but have little part in its design");
    else if (t < .5) caption(g, "It becomes compulsory in every school at once", "There is no trial in a few places first");
    else if (t < .84) caption(g, "Many teachers cannot work out how to teach it", "Parents are asked to pay for materials for the new practical work");
    else caption(g, "Years later, a national review is forced", "A working party tours the country to hear teachers and parents");
  }},
  "citizens_assembly:useful":{ P:14, draw(g,t){
    /* a parliament asks; a lottery draws residents; they hear every side, agree recommendations, and parliament answers */
    const pool = SX.grid(6, 7, 70, 178, 26, 31);
    const pick = [3,8,11,16,19,23,26,30,33,37,40,5];
    const circ = SX.around(12, 430, 258, 88, 88);
    const board = [{x:720,y:198},{x:720,y:270},{x:720,y:342}];
    const startV = [0,1,.5,0,1,.66,.33,1,0,.66,.33,1], endV = .42;
    pool.forEach((p,i) => { if (pick.indexOf(i) < 0) actor(g, p.x, p.y, 7, {v:null, alpha:.75}); });
    const mv = ease(ph(t,.2,.34)), conv = ease(ph(t,.56,.72));
    pick.forEach((idx,k) => { const st = .2 + k*.01, sel = ph(t,st,st+.02);
      const p = pool[idx], q = circ[k];
      const x = lerp(p.x,q.x,mv), y = lerp(p.y,q.y,mv), r = lerp(7,14,mv);
      const v = t < .22 ? null : (mv > .02 ? lerp(startV[k], endV, conv) : null);
      actor(g, x, y, r, {v, ring: sel > 0 && mv < .04 ? sel : 0}); });
    /* evidence cards slide in from three sides during step 3 */
    if (t > .34 && t < .58) for (let i = 0; i < 3; i++){ const a = ease(ph(t,.36+i*.03,.47+i*.03));
      if (a > 0) SX.card(g, lerp(430+(i-1)*140, 430+(i-1)*28, a), lerp(96, 258, a), 30, 20); }
    SX.ring(g, 430, 258, 106, 106, ease(ph(t,.62,.72)));
    /* recommendation travels to the board, which adopts it */
    const ra = ease(ph(t,.78,.88));
    if (ra > 0 && ra < 1) SX.card(g, lerp(528,648,ra), 258, 34, 22);
    const bd = ease(ph(t,.86,.95));
    board.forEach((b,i) => actor(g, b.x, b.y, 15, {v: bd > 0 ? 0 : null, decider:true, ring: i === 1 ? bd : 0}));
    if (t < .2) caption(g, "A regional parliament asks how schools can include every child", "By law, it must answer whatever residents recommend");
    else if (t < .34) caption(g, "A lottery draws residents to take up the question", "Matched to the region by age, gender, education and home town");
    else if (t < .56) caption(g, "Over three months they hear from people affected and from specialists", "They work in small groups, then together");
    else if (t < .78) caption(g, "They agree 31 recommendations", "Each names something that should change in schools");
    else caption(g, "Parliament answers each one in public", "A year later it reports back on what has changed");
  }},
  "citizens_assembly:risky":{ P:13, draw(g,t){
    /* a school draws students by lot to advise on phones; leadership keeps the easy points and drops the main one; next year most students drawn decline */
    const pool = SX.grid(6, 7, 70, 178, 26, 31);
    const pick = [0,2,4,6,8,10,12,14,15,17,19,21,22,24,26,28,30,32,34,35,37,39,41,1];
    const circ = SX.around(24, 430, 258, 96, 96);
    const board = [{x:720,y:198},{x:720,y:270},{x:720,y:342}];
    const startV = pick.map((_,k) => [0,1,.5,.33,.66][k % 5]), endV = .34;
    const back = ease(ph(t,.84,.9));
    const mv = ease(ph(t,.2,.34)) * (1 - back), conv = ease(ph(t,.4,.56));
    pool.forEach((p,i) => { if (pick.indexOf(i) < 0) actor(g, p.x, p.y, 7, {v:null, alpha:.75}); });
    pick.forEach((idx,k) => { const p = pool[idx], q = circ[k];
      const x = lerp(p.x,q.x,mv), y = lerp(p.y,q.y,mv), r = lerp(7,10,mv);
      const v = mv > .02 ? lerp(startV[k], endV, conv) : null;
      actor(g, x, y, r, {v, alpha: back > 0 ? .75 : 1}); });
    SX.ring(g, 430, 258, 112, 112, ease(ph(t,.48,.56)) * (1 - back));
    /* the recommendations reach leadership; most of the card is dropped, a small part kept */
    const ra = ease(ph(t,.58,.66)), cut = ease(ph(t,.68,.78));
    if (ra > 0 && t < .84){ const x = lerp(540,650,ra);
      g.save(); g.globalAlpha = 1 - .85*cut; SX.card(g, x, 258, 40, 26); g.restore();
      if (cut > 0){ g.save(); g.globalAlpha = cut; SX.card(g, 650, 230, 14, 10); SX.card(g, 650, 290, 14, 10); g.restore(); } }
    board.forEach(b => actor(g, b.x, b.y, 15, {v:null, decider:true}));
    /* next year: a new draw, and most of those drawn step back */
    if (t > .9){ const nx = [3,5,9,11,13,16,18,20,23,25,27,29,31,33,36,38,40,7,0,2,12,22,30,41];
      const a = ease(ph(t,.9,.93)), d = ease(ph(t,.94,.98));
      nx.forEach((idx,k) => { const p = pool[idx], declined = k % 4 !== 0;
        g.save(); g.globalAlpha = a * (declined ? 1 - .8*d : 1); g.strokeStyle = C.ochre; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, 11, 0, Math.PI*2); g.stroke(); g.restore(); }); }
    if (t < .2) caption(g, "A school draws 24 students by lot to advise on phones", "Leadership says it will take their recommendations seriously");
    else if (t < .4) caption(g, "Over three sessions, they hear from teachers,", "parents and a counsellor");
    else if (t < .58) caption(g, "They recommend phone-free lessons", "with phones allowed at lunch");
    else if (t < .84) caption(g, "Leadership adopts two minor points and drops the lunch rule", "It tells staff students are too young to judge their screen time");
    else caption(g, "No one explains the decision to the students", "The next year, most students drawn by lot decline to take part");
  }},
  "chain_of_command:useful":{ P:12, draw(g,t){
    g.translate(70, 0);
    /* the director decides; the plan passes down level by level; schools start the reading hour */
    const lv = [[{x:330,y:70}], [210,450].map(x => ({x, y:170})), [150,270,390,510].map(x => ({x, y:270})), [120,180,240,300,360,420,480,540].map(x => ({x, y:370}))];
    const par = (l,i) => lv[l-1][Math.floor(i/2)], at = [0, .3, .5, .74];
    for (let l = 1; l < 4; l++) lv[l].forEach((p,i) => line(g, par(l,i).x, par(l,i).y + 14, p.x, p.y - 12, C.line, 1.4));
    for (let l = 1; l < 4; l++) lv[l].forEach((p,i) => { if (t > at[l] - .04) SX.card(g, lerp(par(l,i).x, p.x, ease(ph(t, at[l] - .04, at[l] + .06))), lerp(par(l,i).y, p.y, ease(ph(t, at[l] - .04, at[l] + .06))) - 2, 14, 10); });
    const dec = ease(ph(t,.06,.18));
    lv.forEach((row,l) => row.forEach((p,i) => actor(g, p.x, p.y, [24,18,14,11][l], {v: l === 0 ? (dec > 0 ? 0 : null) : (t > at[l] + .06 ? 0 : null), decider: l === 0, ring: l === 0 ? dec : 0})));
    if (t > .9) lv[3].forEach((p,i) => { if (i !== 6) tick(g, p.x, p.y + 24, C.sage); });
    for (let l = 3; l > 0; l--) lv[l].forEach((p,i) => { const s0 = .78 + (3 - l)*.05, a = ph(t, s0, s0 + .06); if (a > 0 && a < 1 && !(l === 3 && i === 6)) SX.move(g, p, par(l,i), a, C.sage, 3); });
    if (t < .3) caption(g, "The state sets one deworming day for all its schools", "Every child gets one tablet that morning, with a mop-up day for absentees");
    else if (t < .5) caption(g, "Instructions and tablets pass down to districts and blocks", "Each level trains the next, using the same short guide");
    else if (t < .74) caption(g, "Teachers give the tablets in class", "They record each child on a standard form");
    else caption(g, "Reports travel back up the same chain", "In one state, over 30,000 schools reported back for a single round");
  }},
  "chain_of_command:risky":{ P:13, draw(g,t){
    /* a workload complaint travels up the chain, softening at each level; nothing changes; the teacher leaves */
    g.translate(70, 0);
    const lv = [[{x:330,y:70}], [210,450].map(x => ({x, y:170})), [150,270,390,510].map(x => ({x, y:270})), [120,180,240,300,360,420,480,540].map(x => ({x, y:370}))];
    const par = (l,i) => lv[l-1][Math.floor(i/2)];
    for (let l = 1; l < 4; l++) lv[l].forEach((p,i) => line(g, par(l,i).x, par(l,i).y + 14, p.x, p.y - 12, C.line, 1.4));
    const path = [lv[3][5], lv[2][2], lv[1][1], lv[0][0]], sz = [11, 8, 5, 3.5], st = [.2, .3, .52];
    for (let k = 0; k < 3; k++){ const u = ph(t, st[k], st[k] + .14);
      if (u > 0 && u < 1){ const a = path[k], b = path[k+1]; dot(g, lerp(a.x, b.x, ease(u)), lerp(a.y, b.y, ease(u)), lerp(sz[k], sz[k+1], u), mix(C.terra, C.line, (k + u)/3)); } }
    if (t > .06 && t < .22) SX.flag(g, path[0].x + 18, path[0].y - 16);
    const dec = ease(ph(t,.7,.76)), leave = ease(ph(t,.84,.94));
    lv.forEach((row,l) => row.forEach((p,i) => { const me = l === 3 && i === 5;
      if (me && leave > 0) actor(g, p.x, p.y, 11, {empty:true});
      if (me && leave >= 1) return;
      actor(g, me ? p.x + leave*90 : p.x, me ? p.y + leave*40 : p.y, [24,18,14,11][l], {v: me && t > .06 ? 1 : 0, decider: l === 0, ring: l === 0 ? dec : 0, alpha: me ? 1 - leave : 1}); }));
    if (t < .3) caption(g, "A maths teacher tells her head of department the workload is unsustainable", "She is marking late every night and covering two extra classes");
    else if (t < .52) caption(g, "The head of department tells the deputy", "It becomes “some staff are feeling stretched”");
    else if (t < .84) caption(g, "The deputy tells the principal that morale is “fine overall”", "Nothing about the timetable changes");
    else caption(g, "At the end of the year, the teacher resigns", "Her exit interview is the first time the principal hears the full story");
  }},
  "advice_process:useful":{ P:13, draw(g,t){
    /* the teacher asks three people who know, decides, and posts the decision and the advice */
    const T = {x:200, y:250}, A = [{x:560,y:110},{x:640,y:250},{x:560,y:390}], av = [1, 0, 1];
    const staff = SX.grid(1, 6, 130, 440, 52, 0);
    A.forEach(p => line(g, T.x, T.y, p.x, p.y, C.line, 1, [3,4]));
    A.forEach((p,i) => { const s = .26 + i*.08; SX.move(g, T, p, ph(t, s, s + .05), C.ink, 4); SX.move(g, p, T, ph(t, s + .05, s + .1), opColor(av[i]), i === 1 ? 7 : 5); });
    const tv = t < .5 ? 1 : lerp(1, 0, ease(ph(t,.5,.56)));
    A.forEach((p,i) => actor(g, p.x, p.y, 22, {v: t > .26 + i*.08 ? av[i] : null}));
    const dec = ease(ph(t,.56,.64));
    actor(g, T.x, T.y, 28, {v: t > .06 ? tv : null, decider:true, ring: dec});
    const post = ease(ph(t,.76,.82));
    if (post > 0){ SX.card(g, 200, 120, 60, 40); SX.move(g, T, {x:200,y:120}, ph(t,.74,.78), C.ochre, 5); }
    staff.forEach((p,i) => { const s = .84 + i*.015; SX.move(g, {x:200,y:140}, p, ph(t,s,s+.05), C.ochre, 3); actor(g, p.x, p.y, 10, {v: t > s + .05 ? 0 : null}); });
    if (t < .26) caption(g, "A biology teacher wants 15 new microscopes", "Any teacher can spend money, after asking for advice");
    else if (t < .5) caption(g, "She asks a science colleague, the finance officer and a student", "The student repairs lab equipment");
    else if (t < .76) caption(g, "She chooses the mid-range model", "The finance officer warned that the cheaper one breaks often");
    else caption(g, "She posts the decision and the advice on the staff board", "Anyone can see who she asked and what they said");
  }},
  "advice_process:risky":{ P:13, draw(g,t){
    /* the principal asks only her close team; the people most affected are never asked; suspensions rise */
    const T = {x:220, y:200}, A = [{x:330,y:110},{x:360,y:220},{x:320,y:320}], far = [{x:620,y:110},{x:680,y:230},{x:620,y:350}];
    const kids = SX.grid(1, 9, 120, 440, 64, 0), flagged = [2, 5, 7];
    A.forEach(p => line(g, T.x, T.y, p.x, p.y, C.line, 1, [3,4]));
    A.forEach((p,i) => { const s = .28 + i*.06; SX.move(g, T, p, ph(t, s, s + .05), C.ink, 4); SX.move(g, p, T, ph(t, s + .05, s + .1), C.ochre, 5); });
    A.forEach((p,i) => actor(g, p.x, p.y, 20, {v: t > .26 ? 0 : null}));
    far.forEach((p,i) => actor(g, p.x, p.y, 20, {v: t > .52 ? 1 : null, alpha: t > .52 ? 1 : .5}));
    const dec = ease(ph(t,.66,.72));
    actor(g, T.x, T.y, 28, {v: t > .06 ? 0 : null, decider:true, ring: dec});
    kids.forEach((p,i) => { const s = .76 + i*.01; SX.move(g, T, p, ph(t, s, s + .05), C.ochre, 3);
      actor(g, p.x, p.y, 11, {v: t > s + .05 ? 0 : null}); if (flagged.includes(i) && t > .86) SX.flag(g, p.x + 12, p.y - 14); });
    if (t < .26) caption(g, "A principal needs a new behaviour policy", "She will decide after asking for advice");
    else if (t < .52) caption(g, "She asks her two deputies and the network's behaviour lead", "All three already share her view of discipline");
    else if (t < .76) caption(g, "No one asks the special education coordinator, teachers or parents", "The people most affected are outside her usual circle");
    else caption(g, "Suspensions rise", "Students with special educational needs are suspended at twice the rate of others");
  }},
  "polycentric:useful":{ P:15, draw(g,t){
    /* four clusters under shared standards each teach their own way, meet, and an idea spreads */
    const H = [{x:200,y:150},{x:600,y:150},{x:200,y:360},{x:600,y:360}], hv = [0, 1, 1, 1];
    SX.box(g, 60, 50, 680, 410, [6,6], C.line);
    const meet = t > .5 && t < .76;
    H.forEach((h,i) => H.forEach((k,j) => { if (j > i) line(g, h.x, h.y, k.x, k.y, meet ? C.ochre : C.line, meet ? 1.6 : .8, [3,5]); }));
    if (meet){ [1,2].forEach((j,k) => SX.move(g, H[0], H[j], ph(t,.54 + k*.08,.64 + k*.08), opColor(hv[0]), 6)); }
    const adopt = ease(ph(t,.78,.88));
    H.forEach((h,i) => { const mem = SX.around(5, h.x, h.y, 70, 52);
      const v = (i === 1 || i === 2) ? lerp(hv[i], hv[0], adopt) : hv[i];
      mem.forEach(p => { line(g, h.x, h.y, p.x, p.y, C.line, 1); actor(g, p.x, p.y, 10, {v: t > .26 ? v : null}); });
      actor(g, h.x, h.y, 18, {v: t > .26 ? v : null, decider:true}); });
    if (t < .26) caption(g, "Four school clusters share one national curriculum", "It sets what students must learn, not how to teach it");
    else if (t < .5) caption(g, "Each cluster organises teaching its own way", "One runs project weeks, another teaches in longer blocks");
    else if (t < .76) caption(g, "They meet each term to share results", "Longer blocks are helping with science practicals in one cluster");
    else caption(g, "Two other clusters try longer blocks the next year", "No one ordered it. The idea travelled between the clusters");
  }},
  "polycentric:risky":{ P:14, draw(g,t){
    /* a VP sets a shared test policy; each head of department plans within it; week 9 piles up; each assumes someone else owns the total */
    const VP = {x:400, y:62}, H = [{x:200,y:170},{x:400,y:170},{x:600,y:170}], vs = [.15,.85,.5];
    const wk = k => ({x: 160 + k*53, y: 350});
    const plan = [[1,8,8],[4,8,8],[6,8]];
    H.forEach(h => line(g, VP.x, VP.y, h.x, h.y, C.line, 1, [3,5]));
    const rule = ease(ph(t,.06,.16)); if (rule > 0){ g.save(); g.globalAlpha = rule; SX.card(g, VP.x + 46, VP.y, 30, 22); g.restore(); }
    /* the year-10 calendar: ten weeks */
    line(g, 140, 372, 660, 372, C.line, 1.4);
    for (let k = 0; k < 10; k++){ const w = wk(k); line(g, w.x, 368, w.x, 376, C.line, 1.2); g.save(); g.fillStyle = C.ink; g.globalAlpha = .55; g.font = "500 12px DM Sans, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(k + 1), w.x, 392); g.restore(); }
    /* tests placed by each department, one after another */
    const pile = Array(10).fill(0); let n = 0;
    plan.forEach((ws,i) => ws.forEach((k,j) => { const st = .22 + n*.03, u = ease(ph(t, st, st + .05)); n++;
      if (u <= 0) return; const slot = pile[k]++, dst = {x: wk(k).x, y: 352 - slot*16};
      g.save(); g.fillStyle = opColor(vs[i]); g.strokeStyle = C.ink; g.lineWidth = 1;
      const x = lerp(H[i].x, dst.x, u), y = lerp(H[i].y + 20, dst.y, u); g.fillRect(x - 13, y - 6, 26, 12); g.strokeRect(x - 13, y - 6, 26, 12); g.restore(); }));
    /* students under week 9 get tired */
    const tired = ease(ph(t,.52,.64));
    for (let i = 0; i < 6; i++){ const x = 524 + i*24, y = 440; actor(g, x, y, 8, {v:null, alpha:.8});
      if (tired > 0){ g.save(); g.globalAlpha = tired; SX.flag(g, x, y - 14, C.terra); g.restore(); } }
    /* each head starts towards week 9, then turns back */
    H.forEach((h,i) => { const a = ph(t, .72 + i*.04, .84 + i*.04); if (a > 0 && a < 1){ const u = a < .5 ? a*2*.4 : (1 - a)*2*.4; dot(g, lerp(h.x, wk(8).x, u), lerp(h.y, 300, u), 5, C.ochre); } });
    actor(g, VP.x, VP.y, 16, {v:null, decider:true});
    H.forEach((h,i) => actor(g, h.x, h.y, 16, {v: vs[i], decider:true}));
    if (t > .9){ g.save(); g.strokeStyle = C.terra; g.lineWidth = 2; g.setLineDash([3,4]); g.strokeRect(wk(8).x - 26, 262, 52, 104); g.restore(); }
    if (t < .22) caption(g, "The VP of academics sets a shared assessment policy", "At most two tests per subject a term, dates published two weeks ahead");
    else if (t < .5) caption(g, "Each head of department plans their own test calendar", "Every department stays within the rules");
    else if (t < .72) caption(g, "In week 9, Year 10 has five tests in three days", "Teachers in every subject notice tired, anxious students");
    else if (t < .9) caption(g, "Each head sees the other departments carrying on", "and assumes someone else is handling the overall load");
    else caption(g, "No one owns the whole calendar", "The next term, it happens again");
  }}
});
/* Scenes, part: Voting by number, new format (main drawings, then the example animations on the same base) */
const VB = {
  seats(){ const o = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) o.push({x:150 + c*72, y:130 + r*72}); return o; },
  tally(g, parts, y, ringIdx, ringA){ /* parts: [{n, v}] drawn left to right as one bar against the halfway line */
    const x0 = 150, x1 = 654, tot = parts.reduce((a,p) => a + p.n, 0) || 1; let x = x0;
    g.fillStyle = C.paper; g.fillRect(x0, y, x1 - x0, 20);
    parts.forEach((p,i) => { const w = (x1 - x0)*p.n/Math.max(tot, 1); g.fillStyle = opColor(p.v); g.fillRect(x, y, w, 20);
      if (i === ringIdx && ringA > 0){ g.save(); g.setLineDash([2.5,4]); g.strokeStyle = C.ochre; g.lineWidth = 3; g.globalAlpha = ringA; g.strokeRect(x - 6, y - 6, w + 12, 32); g.restore(); }
      x += w; });
    g.strokeStyle = C.ink; g.lineWidth = 1; g.strokeRect(x0, y, x1 - x0, 20);
    line(g, (x0 + x1)/2, y - 10, (x0 + x1)/2, y + 30, C.ink, 1.5, [4,3]);
  },
  semi(){ return SX.around(15, 400, 236, 250, 120, Math.PI); },
  bar23(g, frac, ringA){ const bx = 220, bw = 360, by = 420; SX.bar(g, bx, by, bw, 18, frac, C.ochre);
    line(g, bx + bw*2/3, by - 10, bx + bw*2/3, by + 28, C.ink, 2, [4,3]); SX.ring(g, bx + bw/2, by + 9, bw/2 + 18, 24, ringA); },
  rk: [{n:9, v:0},{n:6, v:1},{n:8, v:.5}],
  rkSlot(k, j){ const i = VB.rk[k].n + j; return {x: 120 + (i%3)*26, y: 120 + k*120 + Math.floor(i/3)*26}; },
  rkDots(){ const pos = []; VB.rk.forEach((gr,k) => { for (let i = 0; i < gr.n; i++) pos.push({k, i, x: 120 + (i%3)*26, y: 120 + k*120 + Math.floor(i/3)*26}); }); return pos; },
  rkBars(g, counts, ringK, ringA){ const bx = 330, unit = 14; counts.forEach((n,k) => { SX.bar(g, bx, 140 + k*120, 23*unit, 26, n/23, opColor(VB.rk[k].v));
      if (k === ringK) SX.ring(g, bx + 23*unit/2, 153 + k*120, 23*unit/2 + 30, 30, ringA); });
    line(g, bx + 23*unit/2, 110, bx + 23*unit/2, 410, C.ink, 1.2, [4,3]); },
  oa(n){ n = n || 30; const o = [], rows = n <= 12 ? [6,6] : [9,10,11];
    let k = 0; rows.forEach((c,r) => { for (let j = 0; j < c && k < n; j++, k++) o.push({x: 400 + (j - (c - 1)/2)*(n <= 12 ? 62 : 50), y: (n <= 12 ? 290 : 230) + r*(n <= 12 ? 80 : 70)}); }); return o; },
  gs(){ return {L:{x:400, y:70}, front:SX.grid(1, 4, 280, 190, 80, 0), mid:SX.grid(1, 6, 210, 270, 76, 0), back:SX.grid(1, 7, 190, 350, 70, 0), edge:SX.grid(3, 2, 700, 240, 34, 50)}; }
};
Object.assign(SCENES, {
  majority:{ P:11, hero:.97, legend:["s","r"], draw(g,t){
    const S = VB.seats(), votes = S.map((_,i) => [0,1,0,0,1,0,0,1, 0,0,1,0,1,0,0,1, 0,1,0,0,1,0,0,1][i]);
    let a = 0, b = 0;
    S.forEach((s,i) => { const st = .1 + i*.026, on = HERO ? 1 : ph(t, st, st + .02); if (on >= 1) votes[i] ? b++ : a++;
      actor(g, s.x, s.y, 18, {v: on > 0 ? (HERO ? (votes[i] ? .65 + rnd(i,7)*.35 : rnd(i,7)*.4) : votes[i]) : null}); });
    VB.tally(g, [{n:a, v:0},{n:b, v:1}], 400, 0, HERO ? 1 : ease(ph(t,.8,.88)));
    if (t < .1) caption(g, "Everyone votes", "Each vote counts the same");
    else if (t < .8) caption(g, "Votes are counted one by one", "The option with more than half wins");
    else caption(g, "More than half chose the first option", "It is adopted");
  }},
  "majority:useful":{ P:15, draw(g,t){
    /* students propose, campaign, vote on Student Day, and the winning project is built */
    const S = VB.seats(), cards = [{x:250, y:52},{x:400, y:52},{x:550, y:52}], choice = S.map((_,i) => [0,2,1,0,2,0,1,0,0,0,0,1,2,0,1,0,2,0,1,0,0,2,0,0][i]);
    cards.forEach((c,k) => { const a = ease(ph(t, .04 + k*.05, .1 + k*.05)); if (a > 0){ g.save(); g.globalAlpha = a; SX.card(g, c.x, c.y, 54, 32); g.restore(); } });
    if (t > .22 && t < .45) for (let k = 0; k < 8; k++){ const u = ((t - .22)*5 + k*.13) % 1, s = S[(k*7) % 24], c = cards[k % 3]; SX.move(g, c, s, u, C["ink-mute"], 3); }
    const vote = i => ph(t, .47 + i*.009, .49 + i*.009);
    const vv = [0, .5, 1];
    let n = [0,0,0];
    S.forEach((s,i) => { const on = vote(i); if (on >= 1) n[choice[i]]++; actor(g, s.x, s.y, 18, {v: on > 0 ? vv[choice[i]] : null}); });
    VB.tally(g, [{n:n[0], v:0},{n:n[1], v:.5},{n:n[2], v:1}], 400, 0, ease(ph(t,.72,.8)));
    SX.ring(g, cards[0].x, cards[0].y, 42, 28, ease(ph(t,.74,.8)));
    if (t > .84) tick(g, cards[0].x + 34, cards[0].y - 18, C.sage);
    if (t < .22) caption(g, "Students write proposals to improve their school", "The school sets aside part of its budget");
    else if (t < .45) caption(g, "They campaign for their ideas", "Classmates talk them over in the breaks");
    else if (t < .72) caption(g, "On voting day, everyone votes", "Each student has one vote");
    else caption(g, "The winning project is built that year", "A losing idea can try again next year");
  }},
  "majority:risky":{ P:14, draw(g,t){
    /* a school tax vote in a special election: few turn out, more than half of them say no, the measure fails */
    const S = VB.seats(), came = new Set([1,6,10,13,19,22]), v = {1:1,6:1,10:0,13:1,19:0,22:1};
    let a = 0, b = 0;
    S.forEach((s,i) => { if (!came.has(i)){ actor(g, s.x, s.y, 18, {empty:true, alpha: t > .18 ? .9 : .4}); return; }
      const on = ph(t, .44 + [...came].indexOf(i)*.03, .46 + [...came].indexOf(i)*.03); if (on >= 1) v[i] ? b++ : a++;
      actor(g, s.x, s.y, 18, {v: on > 0 ? v[i] : null}); });
    VB.tally(g, [{n:a, v:0},{n:b, v:1}], 400, 1, ease(ph(t,.74,.82)));
    if (t < .18) caption(g, "A school district puts a tax to voters in a special election", "No other election is on the ballot that day");
    else if (t < .44) caption(g, "Few people turn out", "Most who do are older residents without children in school");
    else if (t < .74) caption(g, "More than half of those who vote say no", "Many families with children did not vote");
    else caption(g, "The measure fails", "A small group has decided school funding for everyone");
  }},
  supermajority:{ P:14, hero:.97, legend:["s","r"], draw(g,t){
    const S = VB.semi(); let yes = 0;
    S.forEach((p,i) => { const a = HERO ? 1 : ph(t, .1 + i*.03, .12 + i*.03); const y1 = i < 11;
      if (a >= 1 && y1) yes++; actor(g, p.x, p.y, 15, {v: a > 0 ? (HERO ? (y1 ? rnd(i,3)*.35 : .7 + rnd(i,3)*.3) : (y1 ? 0 : 1)) : null}); });
    SX.card(g, 400, 236, 44, 30);
    VB.bar23(g, yes/15, HERO ? 1 : ease(ph(t,.62,.7)));
    if (t < .1) caption(g, "A proposal needs two-thirds of the votes", "More than half is not enough");
    else if (t < .62) caption(g, "Votes are cast", "Supporters need to win over doubters");
    else caption(g, "Eleven of fifteen vote yes", "The proposal passes with wide support");
  }},
  "supermajority:useful":{ P:15, draw(g,t){
    /* a club of 12 needs 8 votes for a trip; the first vote gets 7; the no voters explain; the plan changes; 11 say yes */
    const S = SX.around(12, 400, 236, 250, 120, Math.PI), r1 = i => i < 7, r2 = i => i < 11;
    const talk = t > .26 && t < .52;
    let yes = 0;
    S.forEach((p,i) => { let v = null;
      if (t < .26){ const a = ph(t, .05 + i*.011, .06 + i*.011); if (a > 0) v = r1(i) ? 0 : 1; }
      else if (t >= .74){ const a = ph(t, .74 + i*.01, .75 + i*.01); if (a > 0) v = r2(i) ? 0 : 1; }
      else v = r1(i) ? .2 : lerp(1, .45, ease(ph(t,.52,.7)));
      if (v === 0) yes++;
      actor(g, p.x, p.y, 16, {v}); });
    const c = {x:400, y:236}; SX.card(g, c.x, c.y, 44, 30);
    if (talk) for (let k = 0; k < 5; k++){ const u = ((t - .26)*4 + k*.2) % 1; SX.move(g, S[7 + k], c, u, C["ink-mute"], 3); }
    if (t > .52){ g.fillStyle = C.sage; g.fillRect(c.x - 18, c.y + 4, 36*ease(ph(t,.52,.6)), 5); }
    const frac = t < .26 ? yes/12 : t < .74 ? 7/12 : yes/12;
    VB.bar23(g, frac, ease(ph(t,.88,.94)));
    if (t < .26) caption(g, "A club of 12 votes on where to go for its field trip", "The trip needs 8 votes. The first plan gets 7");
    else if (t < .52) caption(g, "The five who voted no explain why", "The ticket costs too much for some, and one student can't go on the rides");
    else if (t < .74) caption(g, "The club changes the plan", "They choose a cheaper place with something for everyone");
    else caption(g, "Second vote: 11 of 12 say yes", "The whole club goes on the trip");
  }},
  "supermajority:risky":{ P:14, draw(g,t){
    /* 54% vote yes, the bar is two-thirds, the minority wins, the repairs wait */
    const S = VB.semi(), y = i => i < 8; let yes = 0;
    S.forEach((p,i) => { const a = ph(t, .2 + i*.015, .22 + i*.015); if (a >= 1 && y(i)) yes++; actor(g, p.x, p.y, 15, {v: a > 0 ? (y(i) ? 0 : 1) : null}); });
    const c = {x:400, y:236}; SX.card(g, c.x, c.y, 44, 30);
    const crack = ease(ph(t,.66,.8));
    if (crack > 0){ g.save(); g.strokeStyle = C.terra; g.lineWidth = 2; g.globalAlpha = crack; g.beginPath(); g.moveTo(c.x - 10, c.y - 15); g.lineTo(c.x - 2, c.y - 3); g.lineTo(c.x - 8, c.y + 4); g.lineTo(c.x + 4, c.y + 15); g.stroke(); g.restore(); }
    VB.bar23(g, yes/15, 0);
    if (t > .5) SX.flag(g, 220 + 360*2/3 + 18, 410);
    if (t > .84) [0,1,2].forEach(k => { const a = ease(ph(t, .84 + k*.03, .87 + k*.03)); if (a > 0){ g.save(); g.globalAlpha = a; SX.card(g, 640 + k*30, 120, 20, 14); g.restore(); } });
    if (t < .2) caption(g, "A district asks voters to fund repairs to a crumbling school", "The bond needs two-thirds to pass");
    else if (t < .5) caption(g, "54% vote yes", "A clear majority, but short of two-thirds");
    else if (t < .66) caption(g, "The bond fails", "The 46% who voted no have won");
    else if (t < .84) caption(g, "The repairs wait", "The building keeps getting worse");
    else caption(g, "The district must run the vote again", "Each attempt costs time and money");
  }},
  voting_rules:{ P:14, hero:.97, legend:["s","r"], draw(g,t){
    const pos = VB.rkDots(), move = HERO ? 1 : ease(ph(t,.5,.64));
    const counts = [9 + 2*move, 6*(1 - move), 8 + 4*move];
    VB.rkBars(g, counts, 2, HERO ? 1 : ease(ph(t,.7,.76)));
    pos.forEach(p => { const tr = p.k === 1, to = p.i < 4 ? 2 : 0, sl = tr ? VB.rkSlot(to, to === 2 ? p.i : p.i - 4) : p;
      const tgt = tr ? {x: lerp(p.x, sl.x, move), y: lerp(p.y, sl.y, move)} : p;
      actor(g, tgt.x, tgt.y, 10, {v: HERO ? (p.k === 0 ? rnd(p.i,4)*.3 : p.k === 2 ? .35 + rnd(p.i,4)*.3 : .7 + rnd(p.i,4)*.3) : VB.rk[p.k].v, inner: tr && move > .5 ? VB.rk[to].v : null}); });
    if (t < .3) caption(g, "Voters rank the options in order", "First choices are counted first");
    else if (t < .5) caption(g, "No option has more than half", "The last option drops out");
    else if (t < .86) caption(g, "Its ballots move to each voter's next choice", "The count runs until one option has a majority");
    else caption(g, "The winner has support from more than half", "Counted across every round");
  }},
  "voting_rules:useful":{ P:15, draw(g,t){
    /* several students run; students rank them; the last drops out and its ballots move; the winner ends with just over half */
    const pos = VB.rkDots(), move = ease(ph(t,.5,.66)), shown = ph(t,.22,.3);
    const counts = [9 + 2*move, 6*(1 - move), 8 + 4*move].map(n => n*Math.max(shown, t < .22 ? 0 : 1));
    VB.rkBars(g, counts, 2, ease(ph(t,.74,.8)));
    pos.forEach(p => { const tr = p.k === 1, to = p.i < 4 ? 2 : 0, sl = tr ? VB.rkSlot(to, to === 2 ? p.i : p.i - 4) : p;
      const tgt = tr ? {x: lerp(p.x, sl.x, move), y: lerp(p.y, sl.y, move)} : p;
      actor(g, tgt.x, tgt.y, 10, {v: t < .22 ? null : VB.rk[p.k].v, inner: tr && move > .5 ? VB.rk[to].v : null}); });
    if (t < .22) caption(g, "Several students run for student president", "In past elections, the winner often had less than half the votes");
    else if (t < .5) caption(g, "Students rank the candidates in order", "First choices are counted first, and no one has more than half");
    else if (t < .74) caption(g, "The candidate with the fewest first choices drops out", "Those ballots move to each student's next choice");
    else caption(g, "The winner ends with just over half", "She was not first on the most ballots at the start");
  }},
  "voting_rules:risky":{ P:15, draw(g,t){
    /* centre squeeze: the option almost everyone ranks second has the fewest first choices, drops out first, and a polarising option wins */
    const pos = VB.rkDots(), shown = ph(t,.06,.18), second = ph(t,.3,.42), move = ease(ph(t,.52,.66)), last = t > .8;
    const counts = [9 + 4*move, 6*(1 - move), 8 + 2*move].map(n => n*Math.min(1, shown*1.2));
    VB.rkBars(g, counts, t < .52 ? 1 : 0, t < .52 ? ease(ph(t,.22,.3)) : ease(ph(t,.7,.76)));
    pos.forEach(p => { const tr = p.k === 1, to = p.i < 4 ? 0 : 2, sl = tr ? VB.rkSlot(to, to === 0 ? p.i : p.i - 4) : p;
      const tgt = tr ? {x: lerp(p.x, sl.x, move), y: lerp(p.y, sl.y, move)} : p;
      const inner = tr ? (move > .5 ? VB.rk[to].v : null) : (second > 0 && !last ? VB.rk[1].v : null);
      actor(g, tgt.x, tgt.y, 10, {v: shown > 0 ? VB.rk[p.k].v : null, inner, alpha: last && p.k === 2 ? .45 : 1}); });
    if (t < .22) caption(g, "The student council picks one end-of-year event from three", "Students rank sports day, a talent show and a picnic");
    else if (t < .52) caption(g, "The picnic has the fewest first choices and drops out", "Yet almost every student ranked it second");
    else if (t < .8) caption(g, "Its ballots move on, and sports day wins 13 to 10", "It is the first choice of fewer than half the students");
    else caption(g, "Eight students get the event they ranked last", "Nearly all of them would have been happy with the picnic");
  }},
  gram_sabha:{ P:14, hero:.97, legend:["s","d","r"], draw(g,t){
    /* a chaired, minuted meeting: last minutes read, report on what was done, discussion of needs, agreement shown by raised hands, minutes recorded */
    const room = VB.oa(), C0 = {x:400, y:70}, chair = {x:330, y:70};
    SX.card(g, C0.x + 10, C0.y, 44, 30); g.fillStyle = C.line; for (let k = 0; k < 3; k++) g.fillRect(C0.x - 6, C0.y - 8 + k*7, 32, 2.5);
    const rep = t > .2 && t < .4, talk = t > .4 && t < .68, conv = ease(ph(t,.5,.68)), up = ease(ph(t,.7,.8));
    if (rep && !HERO) room.forEach((p,i) => { const u = ph(t, .2 + (i % 10)*.012, .3 + (i % 10)*.012); SX.move(g, chair, p, u, C["ink-soft"], 3); });
    if (talk && !HERO) room.forEach((p,i) => { if (i % 3 === 0){ const u = ((t - .4)*3.5 + i*.07) % 1; SX.move(g, p, C0, u, C["ink-mute"], 3); } });
    const start = i => [0,.5,1][i % 3];
    room.forEach((p,i) => { const v = HERO ? rnd(i,21)*.45 : (t > .1 ? lerp(start(i), .15, conv) : null);
      actor(g, p.x, p.y, 14, {v, decider:true});
      handUp(g, p.x, p.y, 14, (rnd(i,23) < .62 ? 1 : 0)*(HERO ? 1 : up*(t < .94 ? 1 : 1 - ph(t,.94,.98)))); });
    actor(g, chair.x, chair.y, 18, {v: null});
    SX.ring(g, C0.x + 10, C0.y, 40, 28, HERO ? 1 : ease(ph(t,.84,.9)));
    if (t < .2) caption(g, "Everyone affected meets, with a chair and a note-taker", "The minutes of the last meeting are read out");
    else if (t < .4) caption(g, "Those in charge report on what was done and spent", "Everyone hears the same account");
    else if (t < .7) caption(g, "People discuss their needs and the plans", "Anyone can speak, and views move closer");
    else caption(g, "The room agrees, and many hands go up to show it", "No one counts. The agreement goes into the minutes");
  }},
  "gram_sabha:useful":{ P:15, draw(g,t){
    /* a department of 12 meets openly on a budget cut; the options and costs are shared; they agree by show of hands; the head carries it out and reports back */
    const room = VB.oa(12), H = {x:400, y:70}, cards = [320, 400, 480];
    const shown = ph(t,.04,.16), talk = t > .26 && t < .52, hands = ph(t,.54,.68), act = ph(t,.78,.9);
    cards.forEach((x,k) => { g.save(); g.globalAlpha = k === 1 && t > .66 ? 1 : (t > .66 ? .3 : shown); SX.card(g, x, 150, 34, 24); g.restore(); });
    if (t > .16 && t < .52) room.forEach((p,i) => { const u = ph(t, .16 + i*.008, .24 + i*.008); SX.move(g, {x:400, y:150}, p, u, C["ink-soft"], 3.5); });
    if (talk) room.forEach((p,i) => { if (i % 2 === 0){ const u = ((t - .26)*4 + i*.09) % 1; SX.move(g, p, {x:cards[i % 3], y:150}, u, C["ink-mute"], 3); } });
    const view = [0,0,1,0,.5,0,0,1,0,0,.5,0];
    room.forEach((p,i) => { actor(g, p.x, p.y, 16, {v: t > .16 ? lerp(view[i], view[i] > .7 ? .45 : 0, ease(ph(t,.44,.54))) : null, decider:true});
      handUp(g, p.x, p.y, 16, hands*(t < .78 ? 1 : 1 - ph(t,.78,.82))); });
    SX.ring(g, 400, 150, 34, 26, ease(ph(t,.68,.74)));
    if (t > .78 && t < .9) SX.move(g, {x:400, y:150}, H, act, C.ochre, 5);
    actor(g, H.x, H.y, 20, {v: t > .74 ? 0 : null});
    if (t < .26) caption(g, "The department must cut its budget by a tenth", "The head brings every option, with its cost, to a meeting of all twelve teachers");
    else if (t < .54) caption(g, "Each teacher can question and argue for what matters", "Everyone hears the same figures and the same reasons");
    else if (t < .78) caption(g, "The department reaches agreement, and hands go up to show it", "Drop the new textbooks, keep small-group support");
    else caption(g, "The head carries out the decision", "She reports back at the next meeting on what changed");
  }},
  "gram_sabha:risky":{ P:15, draw(g,t){
    /* an open meeting on a wellbeing concern: staff cannot share the facts, rumour fills the gap, students are named, the rule misses the problem */
    const room = VB.oa(), C0 = {x:400, y:70}, st = [room[2], room[4], room[6]];
    SX.card(g, C0.x, C0.y, 44, 30);
    const hidden = ph(t,.24,.34), rumour = t > .48 && t < .74, vote = ph(t,.76,.86);
    st.forEach((p,i) => { g.save(); g.globalAlpha = hidden; SX.card(g, p.x, p.y - 34, 18, 14); g.fillStyle = C.ink; g.fillRect(p.x - 9, p.y - 37, 18, 6); g.restore(); });
    if (rumour) for (let k = 0; k < 9; k++){ const a = room[(k*5) % room.length], b = room[(k*11 + 3) % room.length], u = ((t - .48)*5 + k*.11) % 1; SX.move(g, a, b, u, C.terra, 3); }
    const named = [12, 15], quiet = [9, 20, 27];
    room.forEach((p,i) => { const v = t > .1 ? [0,.5,1][i % 3] : null;
      actor(g, p.x, p.y, 14, {v: t > .74 ? 0 : v, decider:true, alpha: quiet.includes(i) && t > .86 ? .3 : 1});
      if (named.includes(i) && t > .56 && t < .86) SX.flag(g, p.x + 16, p.y - 18); });
    SX.ring(g, C0.x, C0.y, 40, 28, ease(vote));
    if (t < .24) caption(g, "Parents and staff meet openly about complaints over a teacher", "Anyone can speak, and the meeting aims to agree what to do");
    else if (t < .48) caption(g, "The head knows what happened but cannot say", "The facts are about one member of staff and must stay private");
    else if (t < .76) caption(g, "The room fills the gap with rumour", "The teacher is named in front of everyone");
    else caption(g, "The meeting agrees steps that miss the problem", "The parents who complained stop coming");
  }}
});
/* Show of hands vote and Liberum veto, new format */
const SH = { room(){ return SX.grid(4, 8, 183, 190, 62, 62); }, front(i){ return i < 8; } };
const LV = { ring(n){ return SX.around(n, 400, 240, n > 4 ? 220 : 170, n > 4 ? 150 : 130); } };
Object.assign(SCENES, {
  landsgemeinde:{ P:13, hero:.62, legend:["s","d","r"], draw(g,t){
    /* everyone in one place; the proposal is read; hands go up in the open; the count is made on the spot */
    const P = SH.room(), yes = i => (i*5) % 8 < 5, C0 = {x:400, y:80};
    SX.card(g, C0.x, C0.y, 50, 32);
    const talk = t > .2 && t < .45, up = ease(ph(t,.48,.58)), count = ph(t,.62,.8);
    if (talk && !HERO) P.forEach((p,i) => { if (i % 5 === 0){ const u = ((t - .2)*4 + i*.05) % 1; SX.move(g, p, C0, u, C["ink-mute"], 3); } });
    P.forEach((p,i) => { const v = HERO ? (yes(i) ? rnd(i,31)*.35 : .65 + rnd(i,31)*.35) : (t > .1 ? (yes(i) ? 0 : 1) : null);
      actor(g, p.x, p.y, 14, {v, decider:true});
      handUp(g, p.x, p.y, 14, (HERO ? 1 : up*(t < .86 ? 1 : 1 - ph(t,.86,.9)))*(yes(i) ? 1 : 0)); });
    if (!HERO && count > 0 && count < 1){ const k = Math.floor(count*32); if (P[k]) SX.ring(g, P[k].x, P[k].y - 14, 22, 26, .8); }
    SX.ring(g, C0.x, C0.y, 46, 30, HERO ? 1 : ease(ph(t,.82,.88)));
    if (t < .2) caption(g, "Everyone who will vote gathers in one place", "No one votes from home or in private");
    else if (t < .48) caption(g, "The proposal is read out and debated", "Everyone hears the same case");
    else if (t < .82) caption(g, "Hands go up, and the count is made on the spot", "Everyone can see how everyone else votes");
    else caption(g, "The result is known before anyone leaves", "No ballots, no waiting");
  }},
  "landsgemeinde:useful":{ P:15, draw(g,t){
    /* weekly school meeting: a student proposes a rule change; both sides speak; hands up, counted; the rule takes effect */
    const P = SH.room(), C0 = {x:400, y:80}, prop = 27, yes = i => (i*3) % 7 < 4, staff = [2, 5, 13];
    SX.card(g, C0.x, C0.y, 50, 32);
    SX.move(g, P[prop], C0, ph(t,.06,.18), C.ochre, 5);
    if (t > .26 && t < .5) [prop, 10, 20, 4].forEach((i,k) => { const u = ((t - .26)*4 + k*.25) % 1; SX.move(g, P[i], C0, u, C["ink-mute"], 3.5); });
    const up = ease(ph(t,.52,.6));
    P.forEach((p,i) => { actor(g, p.x, p.y, staff.includes(i) ? 16 : 13, {v: t > .3 ? (yes(i) ? 0 : 1) : null, decider:true});
      handUp(g, p.x, p.y, 14, up*(yes(i) ? 1 : 0)*(t < .76 ? 1 : 1 - ph(t,.76,.8))); });
    const count = ph(t,.6,.74); if (count > 0 && count < 1){ const k = Math.floor(count*32); if (P[k]) SX.ring(g, P[k].x, P[k].y - 14, 22, 26, .8); }
    SX.ring(g, C0.x, C0.y, 46, 30, ease(ph(t,.74,.8)));
    if (t > .82) P.forEach((p,i) => { const u = ph(t, .82 + (i % 8)*.01, .88 + (i % 8)*.01); SX.move(g, C0, p, u, C.ochre, 3); });
    if (t < .24) caption(g, "One pitch is closed for repairs, and older students take the other", "A student proposes alternate days for younger and older students");
    else if (t < .52) caption(g, "Those for and against make their case", "Students and staff hear the same arguments");
    else if (t < .76) caption(g, "Hands go up, and the chair counts them", "One person, one vote, students and staff alike");
    else caption(g, "Alternate days start that week", "Anyone who lost can bring it back to a later meeting");
  }},
  "landsgemeinde:risky":{ P:15, draw(g,t){
    /* a class votes by hand for a lesson by the sea; two students who cannot go keep their hands down and say nothing */
    const P = SH.room(), H = {x:400, y:80}, priv = i => (i === 14 || i === 30 ? 1 : 0);
    const follow = new Set(), keep = new Set([14,30]);
    SX.card(g, H.x + 60, H.y, 44, 28);
    actor(g, H.x, H.y, 20, {v:0, decider:true});
    P.forEach((p,i) => { const r = Math.floor(i/8), s = .3 + r*.1, raise = priv(i) === 0 || follow.has(i);
      const up = raise && !keep.has(i) ? ease(ph(t, s, s + .06))*(t < .82 ? 1 : 1 - ph(t,.82,.86)) : 0;
      const quietly = t > .86 && follow.has(i);
      actor(g, p.x, p.y, 14, {v: t > .06 ? (up > 0 || (t > .82 && raise && !keep.has(i)) ? 0 : priv(i)) : null, inner: follow.has(i) && t > s ? 1 : null, decider:true, alpha: quietly ? .5 : 1});
      handUp(g, p.x, p.y, 14, up); });
    SX.ring(g, H.x + 60, H.y, 40, 26, ease(ph(t,.74,.8)));
    if (t < .3) caption(g, "Tired after a sports weekend, the class asks for an easy lesson", "The teacher proposes the waves lesson by the sea, or problems in small groups");
    else if (t < .55) caption(g, "Hands go up for the sea", "Two students keep their hands down and say nothing");
    else if (t < .82) caption(g, "The sea wins by a wide margin", "The two cannot go, for medical reasons");
    else caption(g, "The teacher cannot leave them alone", "The outing is called off at the door");
  }},
  liberum_veto:{ P:13, hero:.6, legend:["s","d"], draw(g,t){
    /* six members around a proposal; five say yes; one says no; the proposal stops */
    const S = LV.ring(6), C0 = {x:400, y:240}, blk = 3;
    S.forEach(p => line(g, p.x, p.y, C0.x, C0.y, C.line, 1, [3,4]));
    SX.card(g, C0.x, C0.y, 54, 36);
    S.forEach((p,i) => { const a = HERO ? 1 : ph(t, .2 + i*.05, .24 + i*.05);
      actor(g, p.x, p.y, 22, {v: HERO ? (i === blk ? .85 + rnd(i,41)*.15 : rnd(i,41)*.35) : (t > .1 ? (i === blk ? 1 : 0) : null), decider:true});
      if (a > 0){ if (i === blk) SX.flag(g, p.x + 28, p.y - 24); else tick(g, p.x + 28, p.y - 22, C.sage); } });
    const stop = HERO ? 1 : ease(ph(t,.6,.7));
    if (stop > 0){ g.save(); g.globalAlpha = stop; g.strokeStyle = C.terra; g.lineWidth = 3; line(g, C0.x - 22, C0.y - 14, C0.x + 22, C0.y + 14, C.terra, 3); g.restore(); }
    if (t < .2) caption(g, "A proposal needs every member to agree", "Each member holds a veto");
    else if (t < .6) caption(g, "Five say yes, and one says no", "No reasons or alternatives are required");
    else caption(g, "The single no stops the proposal", "Nothing changes until every member agrees");
  }},
  "liberum_veto:useful":{ P:13, draw(g,t){
    /* six families are asked about a class photo; five agree, one says no without giving reasons; the photo is not posted */
    const S = LV.ring(6), C0 = {x:400, y:240}, blk = 4;
    S.forEach(p => line(g, p.x, p.y, C0.x, C0.y, C.line, 1, [3,4]));
    SX.card(g, C0.x, C0.y, 54, 40);
    const photo = 1 - ease(ph(t,.62,.7));
    if (photo > 0){ g.save(); g.globalAlpha = photo; [-14,0,14].forEach(dx => dot(g, C0.x + dx, C0.y - 2, 5, C["ink-soft"])); g.restore(); }
    if (t > .7){ g.save(); g.globalAlpha = ease(ph(t,.7,.8)); g.strokeStyle = C.sage; g.lineWidth = 2; g.beginPath(); g.moveTo(C0.x - 18, C0.y + 10); g.lineTo(C0.x - 4, C0.y - 6); g.lineTo(C0.x + 6, C0.y + 4); g.lineTo(C0.x + 18, C0.y - 10); g.stroke(); g.restore(); }
    S.forEach((p,i) => { const a = ph(t, .22 + i*.05, .26 + i*.05);
      actor(g, p.x, p.y, 22, {v: t > .1 ? (i === blk ? 1 : 0) : null, decider:true});
      if (a > 0){ if (i === blk) SX.flag(g, p.x + 28, p.y - 24); else tick(g, p.x + 28, p.y - 22, C.sage); } });
    if (t < .2) caption(g, "The school wants to post a class photo on its website", "It goes up only if no family objects");
    else if (t < .6) caption(g, "Five families agree, and one says no", "No one asks for a reason");
    else caption(g, "The photo is not posted", "The school uses a picture of the class's work instead");
  }},
  "liberum_veto:risky":{ P:15, draw(g,t){
    /* nine members can each veto a grant; two who oppose testing say no each round; no discussion; the deadline passes */
    const S = LV.ring(9), C0 = {x:400, y:240}, blk = [2, 6];
    S.forEach(p => line(g, p.x, p.y, C0.x, C0.y, C.line, 1, [3,4]));
    SX.card(g, C0.x, C0.y, 54, 36);
    for (let r = 0; r < 3; r++){ const s0 = .18 + r*.18;
      S.forEach((p,i) => { const a = ph(t, s0 + i*.008, s0 + .02 + i*.008); if (a > 0 && t < s0 + .15){ if (blk.includes(i)) SX.flag(g, p.x + 26, p.y - 22); else tick(g, p.x + 26, p.y - 20, C.sage); } }); }
    for (let d = 0; d < 3; d++){ g.beginPath(); g.arc(366 + d*34, 470, 7, 0, Math.PI*2); g.fillStyle = t > .18 + d*.18 ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke(); }
    const dl = ph(t,.76,.84); if (dl > 0){ g.save(); g.globalAlpha = dl; line(g, C0.x - 22, C0.y - 14, C0.x + 22, C0.y + 14, C.terra, 3); g.restore(); }
    S.forEach((p,i) => actor(g, p.x, p.y, 20, {v: t > .06 ? (blk.includes(i) ? 1 : 0) : null, decider:true}));
    if (t < .18) caption(g, "A community school is offered a grant with testing requirements", "Any one member can block accepting it");
    else if (t < .36) caption(g, "Two members who oppose testing say no", "They need not give reasons, and no middle way is sought");
    else if (t < .76) caption(g, "The vote is held again, and again", "Dots below: each round. The same two say no each time");
    else caption(g, "The grant deadline passes", "The school loses money most members wanted");
  }}
});
/* Unanimous consensus with discussion, new format */
const CD = { ring(n){ return SX.around(n, 400, 240, n > 6 ? 220 : 170, n > 6 ? 150 : 130); } };
Object.assign(SCENES, {
  consensus_discussion:{ P:14, hero:.97, legend:["s","d","r"], draw(g,t){
    /* each person adds what they need; one plan is built from every need; everyone can support it */
    const c = {x:400, y:240}, S = CD.ring(9), need = [0, .2, .5, .8, 1, .3, .7, .1, .9];
    g.save(); g.strokeStyle = C.line; g.lineWidth = 1.4; g.beginPath(); g.arc(c.x, c.y, 62, 0, Math.PI*2); g.stroke(); g.restore();
    S.forEach((p,i) => { const s = .06 + i*.05; if (!HERO) SX.move(g, p, c, ph(t, s, s + .05), opColor(need[i]), 6);
      if (HERO || t > s + .05){ const a0 = -Math.PI/2 + i*2*Math.PI/9; g.beginPath(); g.moveTo(c.x, c.y); g.arc(c.x, c.y, 58, a0, a0 + 2*Math.PI/9); g.closePath(); g.fillStyle = opColor(need[i]); g.globalAlpha = .9; g.fill(); g.globalAlpha = 1; } });
    S.forEach((p,i) => { actor(g, p.x, p.y, 20, {v: HERO ? need[i]*.6 : (t > .7 ? need[i]*.4 : need[i]), decider:true}); if (HERO || t > .74 + i*.012) tick(g, p.x + 26, p.y - 22, C.sage); });
    SX.ring(g, c.x, c.y, 260, 190, HERO ? 1 : ease(ph(t,.88,.94)));
    if (t < .52) caption(g, "Each person says what they need", "Anyone who objects explains why");
    else if (t < .88) caption(g, "The group builds one plan from every need", "It keeps talking until everyone can support it");
    else caption(g, "Everyone can support the plan", "No one is outvoted");
  }},
  "consensus_discussion:useful":{ P:14, draw(g,t){
    /* four co-teachers; three propose moving the weekly test; one objects because her group would miss it; they find a slot that suits all four */
    const S = CD.ring(4), C0 = {x:400, y:240}, blk = 2;
    g.save(); g.strokeStyle = C.line; g.lineWidth = 1.4; g.beginPath(); g.arc(C0.x, C0.y, 62, 0, Math.PI*2); g.stroke(); g.restore();
    SX.card(g, C0.x, C0.y, 50, 34);
    if (t > .5){ g.fillStyle = C.sage; g.fillRect(C0.x - 18, C0.y + 5, 36*ease(ph(t,.5,.58)), 5); }
    if (t > .5 && t < .72) for (let k = 0; k < 6; k++){ const u = ((t - .5)*5 + k*.17) % 1; SX.move(g, S[k % 4], S[(k + 2) % 4], u, C["ink-mute"], 3); }
    S.forEach((p,i) => { const a1 = ph(t, .22 + i*.04, .26 + i*.04), a2 = ph(t, .74 + i*.03, .78 + i*.03);
      actor(g, p.x, p.y, 24, {v: t > .1 ? (i === blk && t < .72 ? 1 : 0) : null, decider:true});
      if (t < .5 && a1 > 0){ if (i === blk) SX.flag(g, p.x + 30, p.y - 26); else tick(g, p.x + 30, p.y - 24, C.sage); }
      if (a2 > 0) tick(g, p.x + 30, p.y - 24, C.sage); });
    SX.ring(g, C0.x, C0.y, 210, 170, ease(ph(t,.88,.94)));
    if (t < .2) caption(g, "Four teachers share one class and its routine", "Any change needs all four to support it");
    else if (t < .5) caption(g, "Three want to move the weekly test to Monday", "One objects: her Monday group would miss it");
    else if (t < .72) caption(g, "They talk it through and look for another slot", "Thursday works for every group");
    else caption(g, "All four support the change", "No group of students loses out");
  }},
  "consensus_discussion:risky":{ P:14, draw(g,t){
    /* six students, three ideas, all must agree; each pair holds its ground; the deadline arrives */
    const S = SX.around(6, 400, 200, 170, 110), pair = [1,2,2,1,0,0], ideas = [{x:290,y:200},{x:400,y:200},{x:510,y:200}], vs = [0,.5,1];
    const pick = ease(ph(t,.14,.26)), dl = ph(t,.2,.8), rush = ease(ph(t,.82,.92));
    ideas.forEach((p,k) => { g.save(); g.globalAlpha = 1 - .7*rush; g.fillStyle = opColor(vs[k]); g.fillRect(p.x - 26, p.y - 18, 52, 36); g.strokeStyle = C.ink; g.lineWidth = 1.2; g.strokeRect(p.x - 26, p.y - 18, 52, 36); g.restore(); });
    S.forEach((p,i) => { const q = ideas[pair[i]]; if (pick > 0) line(g, p.x, p.y, lerp(p.x, q.x, pick), lerp(p.y, q.y, pick), opColor(vs[pair[i]]), 2, [3,4]); actor(g, p.x, p.y, 15, {v: pick > .1 ? vs[pair[i]] : null}); });
    for (let m = 0; m < 4; m++){ const a = ph(t, .3 + m*.12, .36 + m*.12); if (a > 0 && a < 1) S.forEach((p,i) => SX.move(g, p, S[(i + 3) % 6], a, C["ink-mute"], 3)); }
    SX.bar(g, 280, 410, 240, 14, dl, C.terra);
    if (rush > 0){ g.save(); g.globalAlpha = rush; g.fillStyle = opColor(0); g.fillRect(374, 330, 26, 34); g.fillStyle = opColor(1); g.fillRect(400, 330, 26, 34); g.strokeStyle = C.ink; g.lineWidth = 1.2; g.strokeRect(374, 330, 52, 34); g.restore(); }
    if (t < .14) caption(g, "Six students enter a competition, with two weeks to the deadline", "They will go ahead only when everyone supports one idea");
    else if (t < .3) caption(g, "Each pair backs a different idea", "A water filter, a garden app, an air sensor");
    else if (t < .8) caption(g, "Every meeting goes over the same ground", "Each pair has already put hours into its own idea (bar: time left)");
    else caption(g, "Three days before the deadline, they still disagree", "They submit a rushed mix of two ideas");
  }}
});
/* Dot voting and Score voting */
const DV = {
  cols(n){ const w = n > 5 ? 82 : 130; return Array.from({length:n}, (_, k) => ({x: 400 + (k - (n - 1)/2)*w, y: 430})); },
  slot(col, k){ return {x: col.x + ((k % 3) - 1)*13, y: col.y - 30 - Math.floor(k/3)*13}; },
  people(n){ if (n <= 10) return SX.grid(1, n, 400 - (n - 1)*24, 80, 48, 0); const h = Math.ceil(n/2); return SX.grid(2, h, 400 - (h - 1)*26, 60, 52, 46).slice(0, n); },
  run(g, t, P, cols, plan, t0, t1){ /* plan: list of [person, col] in placing order; returns counts */
    const cnt = cols.map(() => 0), N = plan.length;
    plan.forEach(([pi, ci], k) => { const s = t0 + (t1 - t0)*k/N, u = HERO ? 1 : ph(t, s, s + .04); if (u <= 0) return;
      const to = DV.slot(cols[ci], cnt[ci]); cnt[ci]++;
      if (u < 1) dot(g, lerp(P[pi].x, to.x, ease(u)), lerp(P[pi].y + 14, to.y, ease(u)), 5, C.ochre); else dot(g, to.x, to.y, 5, C.ochre); });
    return cnt; },
  base(g, cols){ cols.forEach(c => SX.card(g, c.x, c.y, 40, 22)); }
};
const SV = {
  rows(n, top, gap){ return Array.from({length:n}, (_, k) => ({y: top + k*gap})); },
  scale(g, y, steps){ const x0 = 300, w = 400; line(g, x0, y, x0 + w, y, C.line, 1.4); for (let s = 0; s < steps; s++){ const x = x0 + w*s/(steps - 1); line(g, x, y - 4, x, y + 4, C.line, 1.4); } },
  x(v, steps){ return 300 + 400*v/(steps - 1); },
  hist(g, y, ratings, steps, a, r){ const cnt = Array(steps).fill(0); r = r || 5;
    ratings.forEach((v, i) => { const k = cnt[v]++; const x = SV.x(v, steps) + ((k % 2) ? r + 1 : -(r + 1)), yy = y - 10 - Math.floor(k/2)*(2*r + 2);
      if (a > i/ratings.length) dot(g, x, yy, r, opColor(v/(steps - 1) < .5 ? 1 - v/(steps - 1) : 1 - v/(steps - 1))); }); },
  median(ratings){ const s = ratings.slice().sort((a,b) => a - b), n = s.length; return n % 2 ? s[(n - 1)/2] : (s[n/2 - 1] + s[n/2])/2; },
  avg(ratings){ return ratings.reduce((a,b) => a + b, 0)/ratings.length; },
  num(g, s, x, y, o){ o = o || {}; g.save(); g.fillStyle = o.col || C.ink; g.font = `${o.w || 500} ${o.fs || 15}px DM Sans, Arial, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, x, y); g.restore(); },
  table(g, R, o){ /* rows: options; columns: voters (or groups with weights) */
    const cols = R[0].length, W = o.weights || R[0].map(() => 1), n = W.reduce((a,b) => a + b, 0);
    const cw = o.weights ? 120 : Math.min(54, 440/cols), x0 = 400 - (cols*cw + 3*80)/2, rh = Math.min(76, 320/R.length), y0 = 250 - (R.length*rh)/2 + 20;
    /* voter heads */
    for (let c = 0; c < cols; c++){ const x = x0 + c*cw + cw/2; actor(g, x, y0 - 34, o.weights ? 14 : 11, {v:null});
      if (o.weights) SV.num(g, "×" + W[c], x, y0 - 62, {fs:17, col:C["ink-soft"]}); }
    ["Total","Average","Median"].forEach((h,k) => SV.num(g, h, x0 + cols*cw + k*80 + 40, y0 - 34, {fs:15, w:500, col: (o.hl === "avg" && k === 1) || (o.hl === "med" && k === 2) ? C.ink : C["ink-mute"]}));
    R.forEach((row, r) => { const y = y0 + r*rh;
      g.fillStyle = C.paper; g.fillRect(x0 - 26, y + 3, cols*cw + 3*80 + 26, rh - 6);
      g.fillStyle = [C.ochre, C.sage, C.terra, C["ink-soft"]][r % 4]; g.fillRect(x0 - 22, y + rh/2 - 9, 10, 18);
      row.forEach((v, c) => { const x = x0 + c*cw; if (o.fill <= c) return; const a = clamp(o.fill - c, 0, 1);
        g.save(); g.globalAlpha = a; g.fillStyle = mix(C.paper, C.ochre, v/o.max*.85); g.fillRect(x + 2, y + 5, cw - 4, rh - 10);
        SV.num(g, String(v), x + cw/2, y + rh/2, {fs:19}); g.restore(); });
      const tot = row.reduce((s,v,c) => s + v*W[c], 0), flat = []; row.forEach((v,c) => { for (let k = 0; k < W[c]; k++) flat.push(v); });
      const av = tot/n, md = SV.median(flat), xs = x0 + cols*cw;
      if (o.sums > 0){ g.save(); g.globalAlpha = o.sums; SV.num(g, String(tot), xs + 40, y + rh/2, {fs:19}); g.restore(); }
      if (o.avg > 0){ g.save(); g.globalAlpha = o.avg; SV.num(g, av.toFixed(1), xs + 120, y + rh/2, {fs:20, w: o.hl === "avg" ? 700 : 500, col: o.hl === "avg" ? C.ink : C["ink-soft"]}); g.restore(); }
      if (o.med > 0){ g.save(); g.globalAlpha = o.med; SV.num(g, String(md), xs + 200, y + rh/2, {fs:20, w: o.hl === "med" ? 700 : 500, col: o.hl === "med" ? C.ink : C["ink-soft"]}); g.restore(); }
    });
    line(g, x0 + cols*cw + 2, y0 - 50, x0 + cols*cw + 2, y0 + R.length*rh, C.line, 1.2);
    if (o.ring > 0){ const y = y0 + o.win*rh + rh/2; SX.ring(g, 400, y, (cols*cw + 3*80)/2 + 30, rh/2 + 4, o.ring); }
  },
  mark(g, x, y, col){ g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x, y + 6); g.lineTo(x - 7, y + 18); g.lineTo(x + 7, y + 18); g.closePath(); g.fill(); g.restore(); }
};
Object.assign(SCENES, {
  dot_voting:{ P:13, hero:.97, legend:["d","r"], draw(g,t){
    const P = DV.people(10), cols = DV.cols(4);
    const prefs = [[0,0,1],[1,1,1],[0,2,3],[1,2,2],[3,3,3],[0,1,2],[1,1,0],[2,3,0],[1,0,1],[2,2,1]];
    const plan = []; for (let r = 0; r < 3; r++) prefs.forEach((p,i) => plan.push([i, p[r]]));
    DV.base(g, cols);
    P.forEach((p,i) => actor(g, p.x, p.y, 15, {v:null, decider:true}));
    const cnt = DV.run(g, t, P, cols, plan, .12, .78);
    const win = cnt.indexOf(Math.max(...cnt));
    SX.ring(g, cols[win].x, cols[win].y - 60, 40, 80, HERO ? 1 : ease(ph(t,.84,.9)));
    if (t < .12) caption(g, "Everyone gets the same number of dots", "Here, three each");
    else if (t < .8) caption(g, "People place their dots", "All on one option, or spread across several");
    else caption(g, "The option with the most dots wins", "The height of each pile shows how strongly people feel");
  }},
  "dot_voting:useful":{ P:15, draw(g,t){
    const P = DV.people(12), cols = DV.cols(8), plan = [];
    for (let r = 0; r < 5; r++) for (let i = 0; i < 12; i++){ const c = [1,5,1,2,5,1,5,0,1,6,5,3][(i + r*5) % 12]; plan.push([i, (c + (r === 4 ? i % 8 : 0)) % 8]); }
    DV.base(g, cols);
    P.forEach(p => actor(g, p.x, p.y, 14, {v:null, decider:true}));
    const cnt = DV.run(g, t, P, cols, plan, .14, .7);
    const ord = cnt.map((c,k) => [c,k]).sort((a,b) => b[0] - a[0]);
    [ord[0][1], ord[1][1]].forEach(k => SX.ring(g, cols[k].x, cols[k].y - 50, 34, 72, ease(ph(t,.76,.84))));
    if (t < .14) caption(g, "Eight priorities on the wall, two can be funded", "Each teacher gets five dots");
    else if (t < .72) caption(g, "Teachers place their dots before any discussion", "Some spread them, some put several on one priority");
    else caption(g, "The two priorities with the most dots go into the plan", "The piles show where support is wide and strong");
  }},
  "dot_voting:risky":{ P:15, draw(g,t){
    const P = DV.people(16), cols = DV.cols(4), plan = [];
    for (let r = 0; r < 5; r++) for (let i = 0; i < 16; i++){ if (i < 6) plan.push([i, 0]); else plan.push([i, r < 2 ? 2 : [1,3][(i + r) % 2]]); }
    DV.base(g, cols);
    P.forEach((p,i) => actor(g, p.x, p.y, 14, {v:null, decider:true, ring: i < 6 && t > .1 && t < .8 ? .6 : 0}));
    const cnt = DV.run(g, t, P, cols, plan, .14, .74);
    SX.ring(g, cols[0].x, cols[0].y - 70, 34, 90, ease(ph(t,.8,.86)));
    if (t < .14) caption(g, "A student council chooses its fundraiser", "Each student gets five dots");
    else if (t < .4) caption(g, "Six friends put all five dots on one option", "Ten others spread theirs, two each on the option most of them like");
    else if (t < .8) caption(g, "The stacked pile grows fastest", "Later voters see it and add to it");
    else caption(g, "The friends' option wins, 30 dots to 20", "Six students outweighed ten");
  }},
  score_voting:{ P:13, hero:.97, legend:["s","r"], draw(g,t){
    const R = [[1,2,2,3,1,0],[4,3,3,4,3,4],[5,0,5,0,5,1]];
    const T = HERO ? 1 : t, cols = R[0].length;
    SV.table(g, R, {max:5, fill: HERO ? cols : clamp((T - .08)/.5, 0, 1)*cols, sums: HERO ? 1 : ph(T,.6,.66), avg: HERO ? 1 : ph(T,.66,.72), med: HERO ? 1 : ph(T,.72,.78), win: 1, hl:"med", ring: HERO ? 1 : ease(ph(t,.84,.9))});
    if (t < .08) caption(g, "Each row is an option, each column a voter", "Everyone rates every option, here from 0 to 5");
    else if (t < .6) caption(g, "Each voter fills in a rating for every option", "Darker cells: higher ratings");
    else if (t < .84) caption(g, "Add up each row, then find its average and middle rating", "The middle rating is the median");
    else caption(g, "The option with the best rating wins", "The second option: rated well by almost everyone");
  }},
  "score_voting:useful":{ P:15, draw(g,t){
    const R = [[1,2,1,2,2,1,0,2,1,2],[3,3,3,2,3,3,4,3,3,3],[4,0,4,0,4,4,0,0,4,1],[2,1,2,2,3,2,1,2,2,1]], cols = 10;
    SV.table(g, R, {max:4, fill: clamp((t - .1)/.45, 0, 1)*cols, sums: ph(t,.58,.62), avg: ph(t,.62,.66), med: ph(t,.66,.72), win: 1, hl:"med", ring: ease(ph(t,.82,.88))});
    if (t < .1) caption(g, "Ten council members grade four playground designs", "From 0 (reject) to 4 (excellent)");
    else if (t < .58) caption(g, "One design has passionate fans and strong critics", "Another is graded 3, good, by almost everyone");
    else if (t < .82) caption(g, "Each design's middle grade is worked out", "The divisive design's middle grade is pulled down by its critics");
    else caption(g, "The design graded good by almost everyone wins", "Few people are unhappy with the result");
  }},
  "score_voting:risky":{ P:15, draw(g,t){
    const R = [[5,2],[0,4],[0,2]], W = [3,6];
    SV.table(g, R, {max:5, weights:W, fill: clamp((t - .12)/.34, 0, 1)*2, sums: ph(t,.48,.52), avg: ph(t,.52,.58), med: ph(t,.8,.86), win: t < .8 ? 0 : 1, hl: t < .8 ? "avg" : "med", ring: t > .6 && t < .8 ? ease(ph(t,.6,.66)) : ease(ph(t,.88,.94))});
    if (t < .12) caption(g, "Nine directors rate three candidates for head of school", "From 0 to 5; the best average rating wins");
    else if (t < .48) caption(g, "Three give their favourite 5 and the others 0", "The other six give the second candidate a 4");
    else if (t < .8) caption(g, "On the average, the first candidate wins, 3.0 to 2.7", "The favourite of three directors");
    else caption(g, "The middle rating would have chosen the second candidate", "Most of the board rated that candidate highly");
  }}
});
/* Weighted voting and Conviction voting */
const WV = {
  row(ws){ const tot = ws.reduce((a,b) => a + b, 0), gap = 24; let x = 400 - (ws.reduce((a,w) => a + 2*WV.r(w), 0) + gap*(ws.length - 1))/2; return ws.map(w => { const r = WV.r(w), p = {x: x + r, y: 160, r, w}; x += 2*r + gap; return p; }); },
  r(w){ return 12 + 9*Math.sqrt(w); },
  bar(g, yes, no, tot, ringA){ const bx = 220, bw = 360, by = 400; g.fillStyle = C.paper; g.fillRect(bx, by, bw, 22);
    g.fillStyle = opColor(0); g.fillRect(bx, by, bw*yes/tot, 22); g.fillStyle = opColor(1); g.fillRect(bx + bw - bw*no/tot, by, bw*no/tot, 22);
    g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(bx, by, bw, 22); line(g, bx + bw/2, by - 10, bx + bw/2, by + 32, C.ink, 1.5, [4,3]);
    SX.ring(g, bx + bw/2, by + 11, bw/2 + 18, 26, ringA); },
  vote(g, t, P, votes, t0, t1, alpha){ let yes = 0, no = 0;
    P.forEach((p,i) => { const s = t0 + (t1 - t0)*i/P.length, u = HERO ? 1 : ph(t, s, s + .06);
      if (u > 0 && u < 1) dot(g, lerp(p.x, 400, ease(u)), lerp(p.y + p.r, 400, ease(u)), 4 + p.w, opColor(votes[i]));
      if (u >= 1){ if (votes[i] === 0) yes += p.w; else no += p.w; }
      actor(g, p.x, p.y, p.r, {v: u > 0 ? votes[i] : null, decider:true, alpha: alpha ? alpha(i) : 1}); });
    return [yes, no]; }
};
const CVt = {
  level(fn, t, lam){ let c = 0; const n = 120, dt = t/n; for (let k = 0; k < n; k++){ const s = fn(k*dt); c += (s - lam*c)*dt; } return c; },
  bars(n){ return Array.from({length:n}, (_, k) => ({x: 400 + (k - (n - 1)/2)*130, y: 430})); },
  draw(g, b, lvl, thr, maxH){ const h = maxH*Math.min(lvl, 1.15), w = 34;
    g.fillStyle = C.paper; g.fillRect(b.x - w/2, b.y - maxH*1.15, w, maxH*1.15); g.strokeStyle = C.line; g.lineWidth = 1; g.strokeRect(b.x - w/2, b.y - maxH*1.15, w, maxH*1.15);
    g.fillStyle = lvl >= thr ? opColor(1) : C.ochre; g.fillRect(b.x - w/2, b.y - h, w, h);
    line(g, b.x - w/2 - 6, b.y - maxH*thr, b.x + w/2 + 6, b.y - maxH*thr, C.ink, 1.5, [4,3]); }
};
Object.assign(SCENES, {
  dao_token:{ P:13, hero:.97, legend:["s","d","r"], draw(g,t){
    const ws = [6,3,2,1,1,1], P = WV.row(ws), votes = [0,1,0,1,1,0];
    SX.card(g, 400, 300, 40, 26);
    const [y, n] = WV.vote(g, t, P, HERO ? votes.map((v,i) => v ? .7 + rnd(i,51)*.3 : rnd(i,51)*.3) : votes, .12, .7);
    WV.bar(g, y, n, 14, HERO ? 1 : ease(ph(t,.8,.88)));
    if (t < .12) caption(g, "Bigger circles hold more weight", "Each vote counts in proportion to what the voter holds or represents");
    else if (t < .78) caption(g, "Everyone votes", "Three small voters say no, but together they weigh less than one large voter");
    else caption(g, "The weighted total decides", "Yes wins by weight, though more voters said no");
  }},
  "dao_token:useful":{ P:14, draw(g,t){
    const ws = [6,2,1,1,1], P = WV.row(ws), votes = [0,0,0,1,1];
    SX.card(g, 400, 300, 40, 26);
    const [y, n] = WV.vote(g, t, P, votes, .28, .7);
    WV.bar(g, y, n, 11, ease(ph(t,.8,.88)));
    if (t < .28) caption(g, "Five schools share bus routes", "Each school's vote counts in proportion to its pupils");
    else if (t < .54) caption(g, "The largest school, with most pupils on buses, backs new routes", "Two small schools want to keep the old ones");
    else caption(g, "The new routes pass on weight", "More pupils gain than lose, and every school had its say");
  }},
  "dao_token:risky":{ P:15, draw(g,t){
    const ws = [7,2,2,1], P = WV.row(ws), votes = [0,1,1,1], fade = ease(ph(t,.74,.86));
    SX.card(g, 400, 300, 40, 26);
    let tot = [0,0];
    for (let r = 0; r < 3; r++){ const s0 = .1 + r*.2; if (t > s0 && t < s0 + .2){ const sub = (t - s0)/.2; tot = WV.vote(g, sub, P, votes, .05, .6); } }
    if (t >= .7) P.forEach((p,i) => actor(g, p.x, p.y, p.r, {v: votes[i], decider:true, alpha: i ? 1 - .7*fade : 1}));
    for (let d = 0; d < 3; d++){ g.beginPath(); g.arc(366 + d*34, 470, 7, 0, Math.PI*2); g.fillStyle = t > .25 + d*.2 ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke(); }
    WV.bar(g, t >= .7 ? 7 : tot[0], t >= .7 ? 5 : tot[1], 12, t > .7 ? .6 : 0);
    if (t < .1) caption(g, "Four schools share a budget, with votes weighted by pupils", "One school has more than half the pupils");
    else if (t < .7) caption(g, "Proposal after proposal goes the large school's way", "Dots below: each vote. It wins without any other school");
    else caption(g, "The small schools stop coming to meetings", "Their concerns no longer reach the table");
  }},
  conviction:{ P:14, hero:.97, legend:["r"], draw(g,t){
    const B = CVt.bars(3), thr = [.5, .9, .55], P = SX.grid(1, 12, 400 - 11*24, 70, 48, 0);
    const pick = (i, x) => x < .45 ? [0,1,2,0,1,0,2,1,0,1,2,0][i] : [0,0,2,0,1,0,0,1,0,0,2,0][i];
    const fn = k => x => P.reduce((a,_,i) => a + (pick(i, x) === k ? 1 : 0), 0)/12*5;
    const T = HERO ? 1 : t;
    B.forEach((b,k) => { const L = CVt.level(fn(k), T, 5); CVt.draw(g, b, L, thr[k], 240); if (L >= thr[k]) SX.ring(g, b.x, b.y - 140, 40, 150, HERO ? 1 : ease(ph(t,.82,.9))); });
    P.forEach((p,i) => { const k = pick(i, T); actor(g, p.x, p.y, 13, {v:null, decider:true}); if (!HERO && t > .05) line(g, p.x, p.y + 13, B[k].x, B[k].y - 290, C.line, .8, [2,4]); });
    if (t < .45) caption(g, "People place their support on the proposals they want", "Each proposal's support builds up the longer it stays");
    else if (t < .82) caption(g, "People can move their support at any time", "Support that moves away fades gradually");
    else caption(g, "A proposal passes once its built-up support crosses its line", "Proposals that ask for more need a higher line");
  }},
  "conviction:useful":{ P:16, draw(g,t){
    const B = CVt.bars(3), thr = [.8, .8, .8], P = SX.grid(1, 12, 400 - 11*24, 70, 48, 0);
    /* 0 ban in assessed work, 1 allow for drafting, 2 allow with disclosure */
    const pick = (i, x) => { if (x < .2) return [0,1,1,2,0,1,2,1,0,1,2,1][i]; if (x < .38) return [0,0,0,2,0,0,2,0,0,1,2,0][i]; const shift = Math.floor(clamp((x - .38)/.4, 0, 1)*12); return i < shift ? 2 : [0,1,1,2,0,1,2,1,0,1,2,1][i]; };
    const fn = k => x => P.reduce((a,_,i) => a + (pick(i, x) === k ? 1 : 0), 0)/12*6;
    B.forEach((b,k) => { const L = CVt.level(fn(k), t, 6); CVt.draw(g, b, L, thr[k], 240); if (k === 2 && L >= thr[k]) SX.ring(g, b.x, b.y - 140, 40, 150, ease(ph(t,.84,.9))); });
    P.forEach((p,i) => { const k = pick(i, t); actor(g, p.x, p.y, 13, {v: [1, .5, 0][k], decider:true}); line(g, p.x, p.y + 13, B[k].x, B[k].y - 290, C.line, .8, [2,4]); });
    if (t < .2) caption(g, "Teachers can back one of three AI policies at any time", "Ban it in assessed work, allow it for drafting, or allow it with disclosure");
    else if (t < .38) caption(g, "After a news story, support swings to a ban", "The swing fades within weeks and never reaches the line");
    else if (t < .84) caption(g, "Over a term, support builds steadily for disclosure", "Teachers move their support as they try the tools");
    else caption(g, "Disclosure crosses the line and is adopted", "Teachers can keep moving their support if views change again");
  }},
  "conviction:risky":{ P:15, draw(g,t){
    const B = CVt.bars(3), thr = [.72, .6, .6], P = SX.grid(1, 12, 400 - 11*24, 70, 48, 0);
    const pick = i => [0,0,1,0,0,2,0,0,0,1,0,0][i];
    const fn = k => x => P.reduce((a,_,i) => a + (pick(i) === k ? 1 : 0), 0)/12*3.5;
    const gone = ease(ph(t,.3,.42));
    B.forEach((b,k) => { const L = CVt.level(fn(k), t, 3); CVt.draw(g, b, L, thr[k], 240); if (k === 0 && L >= thr[k]) SX.ring(g, b.x, b.y - 140, 40, 150, ease(ph(t,.86,.92))); });
    P.forEach((p,i) => { const k = pick(i), lost = pick(i) === 0 && i % 3 !== 0;
      actor(g, p.x, p.y, 13, {v: t > .55 && lost ? 1 : 0, decider:true, alpha: 1 - .6*gone*(lost ? 1 : 0)}); line(g, p.x, p.y + 13, B[k].x, B[k].y - 290, C.line, .8, [2,4]); });
    if (t < .3) caption(g, "Students place support on club proposals all year", "A club is funded once its support builds past its line");
    else if (t < .55) caption(g, "In September, most students back a film club", "Then they stop opening the app");
    else if (t < .86) caption(g, "Their support keeps counting and building", "Their interest has moved on, but their support has not");
    else caption(g, "The film club is funded in spring", "Few of its backers still want it");
  }}
});
/* Rough or lazy consensus, Consensus with a fallback, Sociocratic consent, Indaba */
const CS = {
  circle(g, c, r){ g.save(); g.strokeStyle = C.line; g.lineWidth = 1.4; g.beginPath(); g.arc(c.x, c.y, r || 62, 0, Math.PI*2); g.stroke(); g.restore(); },
  meetings(g, n, t, starts){ for (let d = 0; d < n; d++){ g.beginPath(); g.arc(400 - (n - 1)*17 + d*34, 470, 7, 0, Math.PI*2); g.fillStyle = t > starts[d] ? C.ink : C.paper; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke(); } },
  amend(g, c, a){ if (a > 0){ g.fillStyle = C.sage; g.fillRect(c.x - 18, c.y + 5, 36*a, 5); } },
  rough(g, t, o){ /* o: con (indices with concerns), hero */
    const S = SX.around(12, 400, 220, 240, 150, Math.PI*1.08).slice(0, 12), ch = {x:400, y:430}, c = {x:400, y:220};
    const look = ease(ph(t,.25,.4)), fix = ease(ph(t,.5,.6)), ok = o.hero ? 1 : ease(ph(t,.66,.74));
    o.con.forEach(i => line(g, ch.x, ch.y, S[i].x, S[i].y, C.ochre, 1 + 2*look*(1 - ok), [4,4]));
    SX.card(g, c.x, c.y, 50, 34); CS.amend(g, c, o.hero ? 1 : fix);
    S.forEach((p,i) => { const isC = o.con.includes(i);
      actor(g, p.x, p.y, 16, {v: o.hero ? (isC ? .45 + rnd(i,61)*.2 : rnd(i,61)*.3) : (t > .06 ? (isC ? lerp(1, .4, ok) : 0) : null)});
      if (!o.hero && isC && t > .1 && t < .66) SX.flag(g, p.x + 22, p.y - 20);
      if (o.hero || (isC && t > .7)) tick(g, p.x + 22, p.y - 18, C.sage); });
    actor(g, ch.x, ch.y, 22, {v:null, decider:true, ring: o.hero ? 1 : ease(ph(t,.82,.88))});
  }
};
Object.assign(SCENES, {
  rough_consensus:{ P:13, hero:.97, legend:["s","d","r"], draw(g,t){
    CS.rough(g, t, {con:[3,8], hero:HERO});
    if (t < .25) caption(g, "Most of the group supports the proposal", "No one counts votes");
    else if (t < .5) caption(g, "The chair looks at the concerns, not the numbers", "Two people still have a concern");
    else if (t < .82) caption(g, "The proposal changes to answer the concern", "The two can now live with it");
    else caption(g, "The chair declares rough consensus", "Every concern answered, not every hand raised");
  }},
  "rough_consensus:useful":{ P:14, draw(g,t){
    CS.rough(g, t, {con:[3,8], hero:false});
    actor(g, 452, 430, 16, {v:null, decider:true});
    if (t < .25) caption(g, "A student–teacher council agreed the homework policy over a term", "Now it proposes one change: no homework in the two weeks before exams");
    else if (t < .5) caption(g, "Most agree straight away. Two Year 11 teachers have a concern", "Their coursework deadlines fall in those weeks");
    else if (t < .82) caption(g, "The co-chairs ask whether the concern can be answered", "Coursework deadlines move a week earlier");
    else caption(g, "The two teachers can live with it", "The co-chairs declare rough consensus. No vote is taken");
  }},
  "rough_consensus:risky":{ P:14, draw(g,t){
    /* the chair declares consensus while a student's concern is still open; the problem returns in summer */
    const S = SX.around(12, 400, 220, 240, 150, Math.PI*1.08).slice(0, 12), ch = {x:400, y:430}, c = {x:400, y:220}, stu = 9;
    const early = ease(ph(t,.42,.5)), hush = ease(ph(t,.5,.62)), heat = ease(ph(t,.66,.8)), redo = ease(ph(t,.86,.94));
    line(g, ch.x, ch.y, S[stu].x, S[stu].y, C.ochre, 1 + 2*ease(ph(t,.22,.3))*(1 - early), [4,4]);
    SX.card(g, c.x, c.y, 50, 34); CS.amend(g, c, redo);
    S.forEach((p,i) => { const isS = i === stu;
      actor(g, p.x, p.y, isS ? 13 : 16, {v: t > .06 ? (isS ? 1 : 0) : null, inner: isS && hush > .5 ? 1 : null});
      if (isS && t > .2 && t < .5) SX.flag(g, p.x + 20, p.y - 18);
      if (!isS && t > .14 && t < .66) tick(g, p.x + 22, p.y - 18, C.sage);
      if (heat > 0 && i % 2 === 0){ g.save(); g.globalAlpha = heat; SX.flag(g, p.x + 20, p.y - 18, C.terra); g.restore(); } });
    actor(g, ch.x, ch.y, 22, {v:null, decider:true, ring: early*(1 - heat)});
    if (t < .2) caption(g, "A student–teacher council discusses blazers all year round", "Most members agree quickly");
    else if (t < .42) caption(g, "One student raises a concern", "Some classrooms have no fans and get very hot in summer");
    else if (t < .66) caption(g, "Keen to finish, the chair declares rough consensus", "The concern is never answered, and the student doesn't press it");
    else if (t < .86) caption(g, "In June, complaints pile up from hot classrooms", "Dots: the concern returns, much bigger");
    else caption(g, "The rule is rewritten mid-term", "Rough consensus needs every concern answered, not most people agreeing");
  }},
  consensus_fallback:{ P:14, hero:.97, legend:["s","d","r"], draw(g,t){
    const c = {x:400, y:220}, S = CD.ring(9).map(p => ({x:p.x, y:p.y - 20})), blk = 6;
    CS.circle(g, c); SX.card(g, c.x, c.y, 50, 34);
    if (!HERO && t > .1 && t < .55) for (let k = 0; k < 6; k++){ const u = ((t - .1)*5 + k*.17) % 1; SX.move(g, S[(k*2) % 9], c, u, C["ink-mute"], 3); }
    CS.amend(g, c, HERO ? 1 : ease(ph(t,.3,.45)));
    CS.meetings(g, 3, HERO ? 1 : t, [.1, .3, .55]);
    const vote = HERO ? 1 : ph(t,.62,.78);
    S.forEach((p,i) => { actor(g, p.x, p.y, 18, {v: HERO ? (i === blk ? .85 : rnd(i,71)*.35) : (t > .06 ? (i === blk ? 1 : (t > .45 ? 0 : [0,.5,.3][i % 3])) : null), decider:true});
      if (vote > i/9) { if (i === blk) SX.flag(g, p.x + 22, p.y - 20); else tick(g, p.x + 22, p.y - 18, C.sage); } });
    VB.bar23(g, vote > 0 ? Math.min(vote*9, 8)/9 : 0, HERO ? 1 : ease(ph(t,.84,.9)));
    if (t < .1) caption(g, "The group agrees a deadline and a fallback first", "If it can't agree in time, a two-thirds vote decides");
    else if (t < .55) caption(g, "It works toward consensus", "Concerns change the proposal. Dots below: meetings");
    else if (t < .84) caption(g, "At the deadline, one person still objects", "The group switches to the fallback vote");
    else caption(g, "Eight of nine vote yes, clearing two-thirds", "The proposal passes");
  }},
  "consensus_fallback:useful":{ P:15, draw(g,t){
    const c = {x:400, y:220}, S = CD.ring(9).map(p => ({x:p.x, y:p.y - 20})), blk = 6;
    CS.circle(g, c); SX.card(g, c.x, c.y, 50, 34);
    if (t > .14 && t < .55) for (let k = 0; k < 6; k++){ const u = ((t - .14)*5 + k*.17) % 1; SX.move(g, S[(k*2) % 9], c, u, C["ink-mute"], 3); }
    CS.amend(g, c, ease(ph(t,.34,.48)));
    CS.meetings(g, 3, t, [.14, .34, .55]);
    const vote = ph(t,.62,.78);
    S.forEach((p,i) => { actor(g, p.x, p.y, 18, {v: t > .06 ? (i === blk ? 1 : (t > .48 ? 0 : [0,.5,.3][i % 3])) : null, decider:true});
      if (vote > i/9){ if (i === blk) SX.flag(g, p.x + 22, p.y - 20); else tick(g, p.x + 22, p.y - 18, C.sage); } });
    VB.bar23(g, vote > 0 ? Math.min(vote*9, 8)/9 : 0, ease(ph(t,.84,.9)));
    if (t < .14) caption(g, "A leadership team must choose next year's timetable model", "They agree to vote, needing two-thirds, if they can't agree in three meetings");
    else if (t < .55) caption(g, "Two meetings answer most concerns", "The plan changes to protect practical lessons");
    else if (t < .84) caption(g, "At the third meeting, one member still objects", "The team takes the fallback vote");
    else caption(g, "Eight of nine vote yes", "The objecting member accepts the result");
  }},
  "consensus_fallback:risky":{ P:14, draw(g,t){
    /* club heads agree a safety rule by fallback vote; the three outvoted don't carry it out */
    const c = {x:400, y:220}, S = CD.ring(9).map(p => ({x:p.x, y:p.y - 20})), con = [2, 5, 7];
    CS.circle(g, c); SX.card(g, c.x, c.y, 50, 34);
    CS.meetings(g, 1, t, [.12]);
    const vote = ph(t,.4,.6), after = ease(ph(t,.72,.84));
    S.forEach((p,i) => { const isC = con.includes(i);
      actor(g, p.x, p.y, 18, {v: t > .06 ? (isC ? 1 : 0) : null, decider:true});
      if (isC && t > .16 && t < .4) SX.flag(g, p.x + 22, p.y - 20);
      if (vote > i/9 && t < .72){ if (isC) SX.flag(g, p.x + 22, p.y - 20); else tick(g, p.x + 22, p.y - 18, C.sage); }
      if (t >= .72){ if (isC) NX.cross(g, p.x + 22, p.y - 20, after); else tick(g, p.x + 22, p.y - 18, C.sage); } });
    if (t < .72) VB.bar23(g, vote > 0 ? Math.min(vote*9, 6)/9 : 0, ease(ph(t,.62,.68)));
    if (t < .16) caption(g, "Nine club heads must agree a safety rule for late pick-up", "If they can't agree in one meeting, they will vote");
    else if (t < .4) caption(g, "Three heads have concerns", "Their clubs end after dark, and the rule is hard to run there");
    else if (t < .72) caption(g, "The vote passes the rule, six to three", "The concerns are noted, not answered");
    else caption(g, "The three heads don't carry it out", "A safety rule only works if everyone follows it");
  }},
  consent:{ P:14, hero:.97, legend:["s","r"], draw(g,t){
    const c = {x:400, y:230}, S = CD.ring(7), obj = 4;
    CS.circle(g, c); SX.card(g, c.x, c.y, 50, 34);
    const r1 = clamp((t - .1)/.3, 0, 1), r2 = clamp((t - .55)/.3, 0, 1);
    const turn = t < .4 ? Math.floor(r1*7) : t > .55 && t < .85 ? Math.floor(r2*7) : -1;
    if (!HERO && turn >= 0 && turn < 7) SX.ring(g, S[turn].x, S[turn].y, 30, 30, .9);
    CS.amend(g, c, HERO ? 1 : ease(ph(t,.42,.52)));
    S.forEach((p,i) => { const in1 = t > .1 + .3*i/7 && t < .42, in2 = t > .55 + .3*i/7;
      actor(g, p.x, p.y, 20, {v: HERO ? rnd(i,81)*.4 : (t > .06 ? (i === obj && t < .5 ? 1 : 0) : null)});
      if (HERO || in2) tick(g, p.x + 26, p.y - 22, C.sage); else if (in1){ if (i === obj) SX.flag(g, p.x + 26, p.y - 24); else tick(g, p.x + 26, p.y - 22, C.sage); } });
    SX.ring(g, c.x, c.y, 230, 180, HERO ? 1 : ease(ph(t,.88,.94)));
    if (t < .1) caption(g, "A proposal goes round the circle", "Each person answers in turn: consent, or a reasoned objection");
    else if (t < .42) caption(g, "One person objects, with a reason", "The objection is used to improve the proposal");
    else if (t < .55) caption(g, "The proposal is amended", "Then it goes round again");
    else if (t < .88) caption(g, "Second round: no objections", "Everyone can live with it, and it is safe to try");
    else caption(g, "The proposal is adopted, with a review date", "It can be changed when the review comes");
  }},
  "consent:useful":{ P:15, draw(g,t){
    const c = {x:400, y:230}, S = CD.ring(7), obj = 4;
    CS.circle(g, c); SX.card(g, c.x, c.y, 50, 34);
    const r1 = clamp((t - .14)/.28, 0, 1), r2 = clamp((t - .58)/.26, 0, 1);
    const turn = t < .42 ? Math.floor(r1*7) : t > .58 && t < .84 ? Math.floor(r2*7) : -1;
    if (turn >= 0 && turn < 7) SX.ring(g, S[turn].x, S[turn].y, 30, 30, .9);
    CS.amend(g, c, ease(ph(t,.44,.54)));
    S.forEach((p,i) => { const in1 = t > .14 + .28*i/7 && t < .44, in2 = t > .58 + .26*i/7;
      actor(g, p.x, p.y, 20, {v: t > .06 ? (i === obj && t < .52 ? 1 : 0) : null});
      if (in2) tick(g, p.x + 26, p.y - 22, C.sage); else if (in1){ if (i === obj) SX.flag(g, p.x + 26, p.y - 24); else tick(g, p.x + 26, p.y - 22, C.sage); } });
    SX.ring(g, c.x, c.y, 230, 180, ease(ph(t,.88,.94)));
    if (t < .14) caption(g, "The Grade 7 team considers a 40-minute homework limit", "Teachers, a student and a parent answer in turn");
    else if (t < .44) caption(g, "The science teacher objects", "Weekly lab write-ups would not fit in 40 minutes");
    else if (t < .58) caption(g, "Lab write-ups are spread over the week", "The proposal goes round again");
    else if (t < .88) caption(g, "Second round: no objections", "Everyone can live with it");
    else caption(g, "The limit starts, with a review in six weeks", "The team can fix anything they got wrong");
  }},
  "consent:risky":{ P:15, draw(g,t){
    const c = {x:400, y:230}, S = CD.ring(7);
    CS.circle(g, c);
    /* queue of waiting decisions grows on the right */
    const q = t < .14 ? 0 : Math.min(9, Math.floor(ph(t,.14,.72)*10));
    for (let k = 0; k < q; k++) SX.card(g, 700 + (k % 3)*22, 120 + Math.floor(k/3)*34, 34, 24);
    /* a slow round on one card at a time */
    const rp = ((t*6) % 1), round = t > .14 && t < .72;
    if (t < .14 || round) SX.card(g, c.x, c.y, t < .14 ? 50 : 34, t < .14 ? 34 : 24);
    const nod = t > .72 && t < .9;
    S.forEach((p,i) => { actor(g, p.x, p.y, 20, {v: null, alpha: t > .5 && t < .9 ? .75 : 1});
      if (t < .14 && t > .04 + i*.012) tick(g, p.x + 26, p.y - 22, C.sage);
      if (round && rp > i/7) tick(g, p.x + 26, p.y - 22, C["ink-mute"]);
      if (nod) tick(g, p.x + 26, p.y - 22, C["ink-mute"]); });
    if (round){ const cur = S[Math.min(6, Math.floor(rp*7))]; SX.ring(g, cur.x, cur.y, 30, 30, .9); }
    if (t < .14) caption(g, "Consent rounds work well for the team's policies", "Homework, behaviour, assessment: big decisions that affect everyone and change rarely");
    else if (t < .44) caption(g, "Then the team uses rounds for day-to-day operations too", "Covering an absent teacher, moving a trip, ordering supplies");
    else if (t < .72) caption(g, "Operational decisions pile up between meetings", "Urgent ones have to wait for the next round");
    else if (t < .9) caption(g, "Staff start nodding proposals through", "A consent no longer means anyone has read it");
    else caption(g, "Consent suits policy, not every operational call", "Day-to-day decisions need someone with authority to act, within agreed limits");
  }},
  indaba:{ P:14, hero:.97, legend:["s","d","r"], draw(g,t){
    const c = {x:400, y:240}, I = SX.around(6, c.x, c.y, 80, 64), O = SX.around(18, c.x, c.y, 290, 190, -Math.PI/2 + .17);
    const iv = [0, .2, 1, .7, .4, .9];
    if (!HERO) for (let k = 0; k < 8; k++){ const u = ((t*5) + k*.13) % 1, a = I[k % 6], b = I[(k*2 + 1) % 6]; if (t > .06 && t < .78) SX.move(g, a, b, u, C["ink-mute"], 3); }
    if (!HERO) [3, 9, 14].forEach((o,k) => { const s = .3 + k*.1, u = ph(t, s, s + .07); if (u > 0 && u < 1) SX.card(g, lerp(O[o].x, c.x, ease(u)*.7), lerp(O[o].y, c.y, ease(u)*.7), 18, 13); });
    if (!HERO) [[2,.25],[5,.48]].forEach(([i,s]) => { if (t > s && t < s + .1) SX.flag(g, I[i].x + 20, I[i].y - 18); if (t > s + .04 && t < s + .14){ SX.card(g, I[i].x + 40, I[i].y - 18, 20, 14); g.fillStyle = C.sage; g.fillRect(I[i].x + 33, I[i].y - 20, 14, 4); } });
    const agree = HERO ? 1 : ease(ph(t,.66,.76));
    I.forEach((p,i) => actor(g, p.x, p.y, 18, {v: HERO ? iv[i]*.4 : lerp(iv[i], .2, agree), decider:true}));
    O.forEach((p,i) => { actor(g, p.x, p.y, 11, {v: HERO ? .2 + rnd(i,91)*.5 : null}); if (HERO || t > .84 + i*.004) tick(g, p.x + 14, p.y - 14, C.sage); });
    SX.ring(g, c.x, c.y, 118, 98, agree);
    if (t < .06) caption(g, "A few people sit in the centre, everyone else around them", "The centre speaks for the main groups affected");
    else if (t < .66) caption(g, "Every no must come with another idea", "Listeners pass notes in");
    else if (t < .84) caption(g, "The centre agrees a way forward", "One everyone there can live with");
    else caption(g, "The wider group endorses it", "They watched the whole conversation");
  }},
  "indaba:useful":{ P:14, draw(g,t){
    const c = {x:400, y:240}, I = SX.around(5, c.x, c.y, 80, 64), O = SX.around(18, c.x, c.y, 290, 190, -Math.PI/2 + .17);
    const iv = [0, .2, 1, .7, .4];
    for (let k = 0; k < 8; k++){ const u = ((t*5) + k*.13) % 1, a = I[k % 5], b = I[(k*2 + 1) % 5]; if (t > .06 && t < .78) SX.move(g, a, b, u, C["ink-mute"], 3); }
    [3, 9, 14].forEach((o,k) => { const s = .3 + k*.1, u = ph(t, s, s + .07); if (u > 0 && u < 1) SX.card(g, lerp(O[o].x, c.x, ease(u)*.7), lerp(O[o].y, c.y, ease(u)*.7), 18, 13); });
    [[2,.25],[4,.48]].forEach(([i,s]) => { if (t > s && t < s + .1) SX.flag(g, I[i].x + 20, I[i].y - 18); if (t > s + .04 && t < s + .14){ SX.card(g, I[i].x + 40, I[i].y - 18, 20, 14); g.fillStyle = C.sage; g.fillRect(I[i].x + 33, I[i].y - 20, 14, 4); } });
    const agree = ease(ph(t,.66,.76));
    I.forEach((p,i) => actor(g, p.x, p.y, 18, {v: lerp(iv[i], .2, agree), decider:true}));
    O.forEach((p,i) => { actor(g, p.x, p.y, 11, {v: null}); if (t > .84 + i*.004) tick(g, p.x + 14, p.y - 14, C.sage); });
    SX.ring(g, c.x, c.y, 118, 98, agree);
    if (t < .06) caption(g, "The head, two council chairs and two teachers sit in the centre", "Students, staff and parents listen around them");
    else if (t < .66) caption(g, "Two sides start to dig in, but every no must come with another idea", "Listeners pass notes in");
    else if (t < .84) caption(g, "The five agree to try projects in two subjects", "Exams stay in the others for a year");
    else caption(g, "The wider group endorses it", "They heard how the plan was reached");
  }},
  "indaba:risky":{ P:14, draw(g,t){
    const c = {x:400, y:240}, I = SX.around(6, c.x, c.y, 80, 64), O = SX.around(18, c.x, c.y, 290, 190, -Math.PI/2 + .17);
    const iv = [0, 1, .2, .9, .4, .7];
    /* each centre member speaks outward in turn; no exchange between them */
    I.forEach((p,i) => { const s = .1 + i*.08; if (t > s && t < s + .08){ SX.ring(g, p.x, p.y, 28, 28, .9); for (let k = 0; k < 3; k++){ const o = O[(i*3 + k) % 18], u = ph(t, s, s + .08); SX.move(g, p, o, u, opColor(iv[i]), 3.5); } } });
    const st = ph(t,.66,.74);
    if (st > 0){ g.save(); g.globalAlpha = st; SX.card(g, c.x, c.y, 54, 36); [0,1,2].forEach(k => { g.fillStyle = opColor([0, 1, .5][k]); g.fillRect(c.x - 20, c.y - 10 + k*8, 40, 4); }); g.restore(); }
    I.forEach((p,i) => actor(g, p.x, p.y, 18, {v: iv[i], decider:true}));
    O.forEach(p => actor(g, p.x, p.y, 11, {v: null, alpha: .7}));
    if (t > .82) I.forEach((p,i) => tick(g, p.x + 20, p.y - 18, C.sage));
    if (t < .1) caption(g, "Union leaders and officials sit in the centre", "The summit is on a new curriculum framework");
    else if (t < .66) caption(g, "Each reads a prepared statement", "No one responds to anyone else");
    else if (t < .82) caption(g, "The summit issues a joint statement", "It is worded so every side can agree");
    else caption(g, "Each side reads it as support for its own view", "The disagreement stays hidden");
  }}
});
/* Lessons from nature, new format */
const NT = {
  herd(g, t, o){
    const N = 40, P = [];
    for (let i = 0; i < N; i++) P.push({x: 160 + (i % 8)*50 + rnd(i)*20, y: 110 + Math.floor(i/8)*62 + rnd(i,1)*20, a: rnd(i,2)*Math.PI*2});
    const inf = o.inf, align = o.hero ? .8 : ease(ph(t,.15,.55)), go = o.hero ? .35 : ease(ph(t,.55,.92));
    if (o.alt) SX.box(g, 20, 100, 100, 320, [4,5], C.sage);
    SX.box(g, 680, 100, 100, 320, [4,5], o.alt ? C.terra : C.ochre);
    P.forEach((p,i) => { const isI = inf.includes(i), near = Math.min(...inf.map(j => Math.hypot(P[j].x - p.x, P[j].y - p.y)));
      const reach = o.spread ? clamp(align*1.6 - near/220, 0, 1) : clamp(align*1.8 - (p.x - 160)/400 - near/600, 0, 1);
      const ai = isI ? 1 : reach, a = lerp(p.a, p.a > Math.PI ? Math.PI*2 : 0, ai), x = p.x + go*240*(isI ? 1 : clamp(ai*1.1, 0, 1)), y = p.y;
      line(g, x, y, x + 18*Math.cos(a), y + 18*Math.sin(a), C["ink-soft"], 1.6);
      actor(g, x, y, 9, {v: o.hero ? (isI ? 0 : rnd(i,3)*.8) : (isI ? 0 : (ai > .6 ? .2 : null)), decider: isI});
      if (o.alt && t > .9 && ai > .6 && i % 3 === 0) SX.flag(g, x + 12, y - 12); });
  },
  bees(g, t, o){ /* o: sites q, firstSite, second(i), quorum, scouts active */
    const hive = {x:130, y:250}, sites = [{x:560,y:110,q:.45},{x:650,y:260,q:1},{x:560,y:410,q:.6}];
    sites.forEach(s => { g.save(); g.fillStyle = mix(C.paper, C.ochre, s.q*.6); g.strokeStyle = C["ink-soft"]; g.lineWidth = 1.4; g.beginPath(); g.moveTo(s.x, s.y - 34); for (let k = 1; k <= 6; k++){ const a = -Math.PI/2 + k*Math.PI/3; g.lineTo(s.x + 34*Math.cos(a), s.y + 34*Math.sin(a)); } g.closePath(); g.fill(); g.stroke(); g.restore(); });
    const T = o.hero ? .97 : t, at = [0,0,0];
    for (let i = 0; i < 6; i++){
      if (!o.active.includes(i)){ actor(g, hive.x + 40, hive.y + (i - 2.5)*16, 9, {v:null, alpha:.35}); continue; }
      const k = o.active.indexOf(i), s1 = .05 + k*.03, back = s1 + .14, s2 = back + .12*o.slow + k*.02, f = sites[o.first[i]], sec = o.second(i), site = T < s2 ? f : sites[sec];
      let p;
      if (T < s1) p = hive; else if (T < s1 + .08){ const u = ease(ph(T, s1, s1 + .08)); p = {x: lerp(hive.x, f.x - 40, u), y: lerp(hive.y, f.y, u)}; }
      else if (T < back) p = {x: f.x - 40, y: f.y};
      else if (T < back + .08){ const u = ease(ph(T, back, back + .08)); p = {x: lerp(f.x - 40, hive.x + 40, u), y: lerp(f.y, hive.y + (i - 2.5)*16, u)}; }
      else if (T < s2){ const w = o.hero ? 0 : Math.sin(T*120 + i)*6*f.q; p = {x: hive.x + 40 + w, y: hive.y + (i - 2.5)*16}; }
      else { const u = ease(ph(T, s2, s2 + .08)); p = {x: lerp(hive.x + 40, site.x - 40, u), y: lerp(hive.y + (i - 2.5)*16, site.y + (i - 2.5)*8, u)}; if (u >= 1) at[sec]++; }
      actor(g, p.x, p.y, 9, {v: T > s1 + .08 ? (sites[T < s2 ? o.first[i] : sec].q === 1 ? 0 : .6) : null}); }
    const win = at.findIndex(n => n >= o.quorum);
    for (let k = 0; k < o.quorum; k++) dot(g, 620 + k*20 - (o.quorum - 4)*10, 330, 6, win >= 0 && k < at[win] ? C.ink : C.line);
    actor(g, hive.x, hive.y, 34, {v:null, decider:true, ring: win >= 0 ? (o.hero ? 1 : ease(ph(t, o.decideAt, o.decideAt + .06))) : 0});
    if (win >= 0) SX.ring(g, sites[win].x, sites[win].y, 50, 50, o.hero ? 1 : ease(ph(t, o.decideAt, o.decideAt + .06)));
  },
  trail(g, t, o){ /* o.w(k, t): use of route k; o.paved: route index */
    const A = {x:110, y:250}, B = {x:690, y:250}, dys = [0, -130, 120];
    const T = o.hero ? .97 : t, pave = o.hero ? 1 : ease(ph(t,.82,.9));
    dys.forEach((dy,k) => { const use = o.w(k, T); g.save(); g.strokeStyle = k === o.paved && pave > 0 ? mix(C.line, C["ink-soft"], pave) : C.line; g.lineWidth = 1 + 14*use*(k === o.paved ? 1 : 1 - pave*.8); g.globalAlpha = .25 + .75*use; g.lineCap = "round";
      g.beginPath(); g.moveTo(A.x, A.y); g.quadraticCurveTo(400, 250 + dy*2, B.x, B.y); g.stroke(); g.restore(); });
    if (!o.hero && T < .82) for (let i = 0; i < 14; i++){ const tot = dys.map((_,k) => o.w(k, T) + .05), sum = tot.reduce((a,b) => a + b, 0), r = rnd(i, Math.floor(T*6));
      let k = 0, acc = tot[0]/sum; while (r > acc && k < 2){ k++; acc += tot[k]/sum; }
      const u = ((T*3) + rnd(i,2)) % 1, s = i % 2 ? 1 - u : u, x = (1-s)*(1-s)*A.x + 2*(1-s)*s*400 + s*s*B.x, y = (1-s)*(1-s)*A.y + 2*(1-s)*s*(250 + dys[k]*2) + s*s*B.y;
      dot(g, x, y, 4, C.ink); }
    [A, B].forEach(p => { g.fillStyle = C.paper; g.strokeStyle = C.ink; g.lineWidth = 1.6; g.fillRect(p.x - 40, p.y - 60, 80, 120); g.strokeRect(p.x - 40, p.y - 60, 80, 120); });
    if (o.paved === 0) SX.ring(g, 400, 250, 300, 40, pave); else SX.ring(g, 400, 250 - 130, 300, 70, pave);
  },
  mould(g, t, o){
    const S = SX.around(8, 400, 250, 280, 170, -Math.PI/2 + .3), T = o.hero ? .97 : t;
    const keep = new Set(["0-1","1-2","2-3","3-4","4-5","5-6","6-7","0-7","0-4","2-6"]);
    const prune = ease(ph(T,.35,.75)), grow = ease(ph(T,.25,.7));
    S.forEach((a,i) => S.forEach((b,j) => { if (j <= i) return; const k = keep.has(i + "-" + j);
      const w = k ? 1 + 5*grow*(0.5 + rnd(i*8+j)) : 1*(1 - prune);
      if (w > .05){ g.save(); g.globalAlpha = k ? 1 : (1 - prune); line(g, a.x, a.y, b.x, b.y, k ? C.ochre : C.line, w); g.restore(); }
      if (!o.hero && k && T > .1 && !(o.need && T > .78)){ const u = ((T*2) + rnd(i,j)) % 1; SX.move(g, a, b, u, C.ink, 2.5); } }));
    if (o.need && T > .78){ const path = [3, 2, 1, 0, 7], u = clamp((T - .8)/.18, 0, 1)*(path.length - 1), seg = Math.min(Math.floor(u), path.length - 2), f = u - seg;
      line(g, S[3].x, S[3].y, S[7].x, S[7].y, C.terra, 1.5, [3,5]);
      dot(g, lerp(S[path[seg]].x, S[path[seg + 1]].x, f), lerp(S[path[seg]].y, S[path[seg + 1]].y, f), 7, C.terra); }
    S.forEach((p,i) => actor(g, p.x, p.y, 18, {v:null, decider:true, ring: o.need && T > .78 && (i === 3 || i === 7) ? .8 : 0}));
  }
};
Object.assign(SCENES, {
  herd:{ P:14, hero:.6, legend:["d"], draw(g,t){
    NT.herd(g, t, {inf:[5,14,27,36], spread:true, hero:HERO});
    if (t < .15) caption(g, "A crowd needs to move, and no one announces where", "A few people know the way");
    else if (t < .55) caption(g, "Those who know the way just start moving", "People nearby turn to follow them");
    else caption(g, "The whole group moves together", "A few informed people, spread out, are enough");
  }},
  "herd:useful":{ P:14, draw(g,t){
    NT.herd(g, t, {inf:[5,14,27,36], spread:true});
    if (t < .15) caption(g, "600 students need to reach the right sports-day fields", "A few student marshals have route cards");
    else if (t < .55) caption(g, "The marshals, spread through the crowd, start walking", "Students near them turn to follow");
    else caption(g, "The crowd sorts itself onto the right fields", "In ten minutes, with no announcement");
  }},
  "herd:risky":{ P:14, draw(g,t){
    NT.herd(g, t, {inf:[0,8,16], spread:false, alt:true});
    if (t < .15) caption(g, "Hundreds of students arrive for an exam in an unfamiliar building", "Most should go to the hall on the left");
    else if (t < .55) caption(g, "A few confident students head right", "Others follow them, not the signs");
    else if (t < .9) caption(g, "Each follower makes the wrong way look more certain", "Doubters keep walking with everyone else");
    else caption(g, "Their names aren't on the seating lists", "The exam starts late for them");
  }},
  bees:{ P:16, hero:.97, legend:["s","d","r"], draw(g,t){
    NT.bees(g, t, {active:[0,1,2,3,4,5], first:[0,1,2,2,0,1], second: i => i < 4 ? 1 : [0,1,2,2,0,1][i], quorum:4, slow:1, decideAt:.82, hero:HERO});
    if (t < .2) caption(g, "Scouts each visit possible sites alone", "Deeper colour: a better site");
    else if (t < .42) caption(g, "They report back, more keenly for better sites", "Livelier reports draw more attention");
    else if (t < .82) caption(g, "Others go and check the best-sounding site", "Each must see it for themselves");
    else caption(g, "Enough scouts back the same site, and the group moves", "The quorum waits for enough independent checks");
  }},
  "bees:useful":{ P:16, draw(g,t){
    NT.bees(g, t, {active:[0,1,2,3,4,5], first:[0,1,2,2,0,1], second: i => i < 4 ? 1 : [0,1,2,2,0,1][i], quorum:4, slow:1, decideAt:.82});
    if (t < .2) caption(g, "Six staff each visit possible sites alone", "Deeper colour: a better site");
    else if (t < .42) caption(g, "They report back, more keenly about better sites", "Keen reports send others to look");
    else if (t < .82) caption(g, "Others go and see the best-sounding site", "Each backs it only after seeing it");
    else caption(g, "Four have backed the same site, so the charity takes it", "The decision waited for enough first-hand checks");
  }},
  "bees:risky":{ P:15, draw(g,t){
    NT.bees(g, t, {active:[0,1], first:[0,0,0,0,0,0], second: () => 0, quorum:2, slow:.3, decideAt:.5});
    if (t < .24) caption(g, "Two staff visit the first provider they hear of", "The rule says two backers are enough");
    else if (t < .5) caption(g, "They report back with enthusiasm", "No one else visits any provider");
    else caption(g, "The quorum of two is met within a week", "A cheaper provider with better reviews is never visited");
  }},
  stigmergy:{ P:14, hero:.97, legend:["r"], draw(g,t){
    NT.trail(g, t, {w: (k, T) => clamp(T*1.4, 0, 1)*[1, .35, .3][k], paved:0, hero:HERO});
    if (t < .2) caption(g, "There is no plan, only many trips", "Each trip leaves a trace");
    else if (t < .82) caption(g, "Traces guide the next trip", "The shortest route gets used most, so its trace grows fastest");
    else caption(g, "The strongest trace becomes the route", "A path no one designed");
  }},
  "stigmergy:useful":{ P:14, draw(g,t){
    NT.trail(g, t, {w: (k, T) => clamp(T*1.4, 0, 1)*[1, .35, .3][k], paved:0});
    if (t < .2) caption(g, "Teachers tick each practice question they use", "And note whether students got it");
    else if (t < .82) caption(g, "Questions that worked rise to the top", "Weak ones sink");
    else caption(g, "After a term, the bank has sorted itself", "No one had to review it");
  }},
  "stigmergy:risky":{ P:14, draw(g,t){
    NT.trail(g, t, {w: (k, T) => k === 1 ? clamp(.25 + T*1.2, 0, 1) : clamp(T*.5, 0, 1)*[.3, 0, .2][k], paved:1});
    if (t < .2) caption(g, "The first template in the folder has a mistake", "It is the one people see first");
    else if (t < .82) caption(g, "Each copy makes it look more standard", "New staff copy what they see most");
    else caption(g, "Two years later, most lesson plans share the mistake", "Popularity decided which version spread");
  }},
  slime_mould:{ P:15, hero:.97, legend:["d"], draw(g,t){
    NT.mould(g, t, {hero:HERO});
    if (t < .25) caption(g, "Start with a link between every pair", "Every possible connection, at first");
    else if (t < .75) caption(g, "Busy links get stronger, idle ones fade", "What flows through a link keeps it alive");
    else caption(g, "An efficient network that no one designed", "Shaped by what people actually use");
  }},
  "slime_mould:useful":{ P:15, draw(g,t){
    NT.mould(g, t, {});
    if (t < .25) caption(g, "Eight schools set up a working group for every pair", "Maths, sports, special needs, languages");
    else if (t < .75) caption(g, "Busy groups get more time and budget", "Groups that never met are closed");
    else caption(g, "A year later: fewer links, used weekly", "The network fits how schools really work together");
  }},
  "slime_mould:risky":{ P:16, draw(g,t){
    NT.mould(g, t, {need:true});
    if (t < .25) caption(g, "The student council keeps busy peer groups and closes idle ones", "One closed group was for students new to the country");
    else if (t < .78) caption(g, "Busy groups get stronger, quiet ones are cut", "The new-arrivals group had only three members");
    else caption(g, "Two students arrive mid-year with little English", "With no group to join, they spend lunchtimes alone");
  }}
});
/* No structure, new format */
const NS = {
  draw(g, t, o){
    const F = [{x:200,y:190},{x:260,y:150},{x:290,y:220},{x:230,y:270}];
    const N = [{x:440,y:110},{x:570,y:140},{x:680,y:200},{x:480,y:260},{x:620,y:300},{x:440,y:380},{x:570,y:410},{x:690,y:390}];
    const T = o.hero ? .97 : t;
    F.forEach((a,i) => F.forEach((b,j) => { if (j > i) line(g, a.x, a.y, b.x, b.y, C.ink, 2.4); }));
    N.forEach((p,i) => line(g, p.x, p.y, F[i % 4].x, F[i % 4].y, C.line, 1, [3,5]));
    if (!o.hero && T < .3) for (let k = 0; k < 6; k++){ const u = ((T*6) + k*.2) % 1; SX.move(g, F[k % 4], F[(k+1) % 4], u, C.ochre, 3); }
    const plan = o.hero ? 1 : ease(ph(T,.3,.36)); if (plan > 0){ SX.card(g, 330, 210, 44, 30); g.fillStyle = C.ochre; g.fillRect(314, 204, 32*plan, 5); }
    N.forEach((p,i) => { const s = .4 + i*.03; if (!o.hero && T > s && T < s + .12) SX.card(g, p.x + 26, p.y - 22, 20, 14);
      const leave = i < 6 ? ease(ph(T, .62 + i*.03, .7 + i*.03)) : 0;
      actor(g, p.x, p.y, 16, {v: o.hero ? .7 + rnd(i,7)*.3 : 1, inner: !o.hero && T > .55 ? 1 : null, alpha: 1 - .7*leave}); });
    F.forEach((p,i) => actor(g, p.x, p.y, 18, {v: o.hero ? rnd(i,9)*.25 : 0, decider:true}));
    SX.ring(g, 330, 210, 40, 28, o.hero ? 1 : ease(ph(T,.5,.56)));
  },
  small(g, t){
    const P = SX.around(5, 400, 240, 170, 130), c = {x:400, y:240};
    P.forEach((a,i) => P.forEach((b,j) => { if (j > i) line(g, a.x, a.y, b.x, b.y, C.line, 1.6); }));
    if (t > .08 && t < .7) for (let k = 0; k < 8; k++){ const u = ((t*5) + k*.13) % 1; SX.move(g, P[k % 5], P[(k*2 + 1) % 5], u, C.ochre, 3); }
    const plan = ease(ph(t,.3,.7)); SX.card(g, c.x, c.y, 50, 34); g.fillStyle = C.ochre; for (let k = 0; k < 3; k++) g.fillRect(c.x - 18, c.y - 10 + k*8, 36*clamp(plan*3 - k, 0, 1), 4);
    P.forEach(p => actor(g, p.x, p.y, 20, {v: t > .7 ? 0 : (t > .05 ? .2 : null), decider:true}));
    SX.ring(g, c.x, c.y, 220, 175, ease(ph(t,.74,.8)));
  }
};
Object.assign(SCENES, {
  no_structure:{ P:15, hero:.97, legend:["s","d","r"], draw(g,t){
    NS.draw(g, t, {hero:HERO});
    if (t < .3) caption(g, "No agreed way of deciding", "A few people talk to each other all the time");
    else if (t < .55) caption(g, "They settle things among themselves", "Others' ideas are welcomed, then go nowhere");
    else caption(g, "Others drift away", "The best-connected people decide, and no one can see how");
  }},
  "no_structure:useful":{ P:13, draw(g,t){
    NS.small(g, t);
    if (t < .3) caption(g, "Five teachers plan the end-of-term picnic in a chat group", "No chair and no vote");
    else if (t < .74) caption(g, "People offer to bring things and suggest a date", "Everyone sees every message");
    else caption(g, "The plan comes together in two days", "Everyone is happy with it");
  }},
  "no_structure:risky":{ P:15, draw(g,t){
    NS.draw(g, t, {});
    if (t < .3) caption(g, "The parent group has no official committee or shared agreements", "Four friends meet for coffee every week");
    else if (t < .55) caption(g, "The friends arrive with plans already agreed", "New parents' ideas are welcomed, then go nowhere");
    else if (t < .9) caption(g, "New parents stop coming", "Each thinks the problem is only them");
    else caption(g, "The structure was there all along", "It was the friendship group, hidden and impossible to challenge");
  }}
});

/* Example animations for the 13 structures converted to the newer layout (the other example uses the structure's main drawing). */
const NX = {
  bars(g, xs, vals, base, unit, cols, w){ xs.forEach((x,i) => { const h = vals[i]*unit; g.fillStyle = cols ? cols[i] : C.ochre; g.fillRect(x - (w||22), base - h, 2*(w||22), h); g.strokeStyle = C.ink; g.lineWidth = 1; g.strokeRect(x - (w||22), base - h, 2*(w||22), h); }); line(g, xs[0] - 50, base, xs[xs.length-1] + 50, base, C.line, 1.4); },
  tick(g, x, y, a){ if (!(a > 0)) return; g.save(); g.globalAlpha = a; g.strokeStyle = C.sage; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 6, y); g.lineTo(x - 1, y + 5); g.lineTo(x + 8, y - 6); g.stroke(); g.restore(); },
  cross(g, x, y, a, col){ if (!(a > 0)) return; g.save(); g.globalAlpha = a; g.strokeStyle = col || C.terra; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 6, y - 6); g.lineTo(x + 6, y + 6); g.moveTo(x + 6, y - 6); g.lineTo(x - 6, y + 6); g.stroke(); g.restore(); },
  cardAt(g, x, y, a, w, h){ if (!(a > 0)) return; g.save(); g.globalAlpha = a; SX.card(g, x, y, w || 26, h || 18); g.restore(); }
};
Object.assign(SCENES, {
  "quadratic:risky":{ P:13, draw(g,t){
    /* younger students put everything on one project; older students coordinate across three */
    const young = SX.grid(1, 7, 90, 110, 44, 0), old = SX.grid(1, 5, 470, 110, 52, 0);
    const bx = [220, 340, 460, 580], youngPick = [0,0,1,1,3,3,3];
    const ya = ease(ph(t,.22,.46)), oa = ease(ph(t,.58,.8)), link = ease(ph(t,.5,.58));
    const vals = [0,0,0,0];
    youngPick.forEach((p,i) => vals[p] += 4*ya);
    [1,2,3].forEach(p => vals[p] += 10*oa);
    NX.bars(g, bx, vals, 430, 6, bx.map((_,i) => i ? opColor(.5 + i*.15) : opColor(0)), 26);
    if (link > 0) for (let i = 0; i < 4; i++) line(g, old[i].x, old[i].y, old[i+1].x, old[i+1].y, C.ochre, 2.5, [3,4]);
    young.forEach((p,i) => { actor(g, p.x, p.y, 10, {v: ya > .05 ? 0 : null}); const u = ph(t, .22 + i*.02, .34 + i*.02); if (u > 0 && u < 1) SX.move(g, p, {x: bx[youngPick[i]], y: 400}, u, opColor(0), 5); });
    old.forEach((p,i) => { actor(g, p.x, p.y, 13, {v: oa > .05 ? .8 : null}); [1,2,3].forEach((b,j) => { const u = ph(t, .58 + j*.05 + i*.01, .7 + j*.05 + i*.01); if (u > 0 && u < 1) SX.move(g, p, {x: bx[b], y: 400}, u, opColor(.8), 5); }); });
    if (t > .86) SX.ring(g, 460, 330, 170, 90, ease(ph(t,.86,.92)));
    if (t < .22) caption(g, "A school council tries quadratic voting, with no practice round", "Everyone gets the same 16 credits");
    else if (t < .5) caption(g, "Many younger students put all 16 credits on one project", "Not realising it buys them only four votes");
    else if (t < .86) caption(g, "A group of older students agree a plan in advance", "Each splits their credits across the same three projects");
    else caption(g, "Those three projects take most of the budget", "The people who understood the price could plan around it");
  }},
  "nemawashi:risky":{ P:14, draw(g,t){
    /* the principal visits three senior people; the coach is never visited; the meeting presents it as settled */
    const P0 = {x:400, y:250}, seniors = [{x:220,y:130},{x:400,y:100},{x:580,y:130}], coach = {x:640, y:360}, club = SX.around(6, 700, 420, 40, 22);
    seniors.forEach((s,i) => { const u = ph(t, .14 + i*.08, .22 + i*.08); line(g, P0.x, P0.y, s.x, s.y, C.line, 1, [3,5]); if (u > 0 && u < 1) SX.move(g, P0, s, u < .5 ? u*2 : 2 - u*2, C.ochre, 6); actor(g, s.x, s.y, 15, {v: u >= .5 ? 0 : null}); NX.tick(g, s.x + 22, s.y - 14, ease(ph(t, .2 + i*.08, .24 + i*.08))); });
    const meet = ease(ph(t,.5,.62));
    actor(g, coach.x, coach.y, 14, {v:null, inner: t > .4 ? 1 : null});
    const drift = ease(ph(t,.74,.9));
    club.forEach((p,i) => actor(g, p.x + drift*(30 + i*6), p.y + drift*20, 6, {v: 1, alpha: .8*(1 - drift)}));
    if (meet > 0) SX.ring(g, 430, 250, 290, 180, meet);
    actor(g, P0.x, P0.y, 18, {v: 0, decider:true});
    if (t > .9){ g.save(); g.strokeStyle = C.terra; g.lineWidth = 2; g.setLineDash([3,4]); g.beginPath(); g.arc(P0.x, P0.y, 34, 0, Math.PI*2); g.stroke(); g.restore(); }
    if (t < .14) caption(g, "A principal plans to merge two after-school clubs", "Before the meeting, she talks it through privately");
    else if (t < .4) caption(g, "She visits the vice-principal, the senior adviser and the PTA", "All three agree");
    else if (t < .5) caption(g, "No one visits the teacher who coaches the smaller club", "Inner dot: her doubts");
    else if (t < .74) caption(g, "At the staff meeting, the merger is presented as settled", "The coach says nothing; every senior colleague has signed off");
    else if (t < .9) caption(g, "That term, the smaller club's members drift away", "Two families complain to the board of education");
    else caption(g, "Asked who made the decision, no one can say", "So many people agreed that no one owned it");
  }},
  "unanimity:useful":{ P:14, draw(g,t){
    /* twelve staff agree a safety rule; trip leaders' knowledge shapes it; all twelve sign */
    const R = SX.around(12, 400, 250, 170, 130), leaders = [2, 7];
    const talk = ease(ph(t,.2,.5)), conv = ease(ph(t,.5,.72)), sign = ph(t,.72,.9);
    const start = [0,1,.5,0,1,.3,.7,.6,0,1,.2,.8];
    R.forEach((p,i) => { const lead = leaders.indexOf(i) >= 0;
      if (lead && talk > 0 && conv < 1){ g.save(); g.globalAlpha = 1 - conv; R.forEach((q,j) => { if (j !== i) line(g, p.x, p.y, q.x, q.y, C.ochre, 1, [2,6]); }); g.restore(); }
      actor(g, p.x, p.y, lead ? 17 : 14, {v: lerp(start[i], .5, conv), ring: lead ? talk*(1 - conv) : 0});
      NX.tick(g, p.x + 20, p.y - 16, ease(ph(sign, i/14, i/14 + .1))); });
    NX.cardAt(g, 400, 250, ease(ph(t,.08,.16)), 60, 40);
    if (conv > 0){ g.save(); g.globalAlpha = conv; g.strokeStyle = C.ink; g.lineWidth = 2.4; g.strokeRect(370, 230, 60, 40); g.restore(); }
    if (t < .2) caption(g, "After a near miss on a trip, twelve staff need a rule on adult–child ratios", "Nothing changes unless all twelve agree");
    else if (t < .5) caption(g, "The two teachers who lead most trips explain what works", "Rings: the trip leaders. No one can outvote them");
    else if (t < .72) caption(g, "Over two meetings, every concern is dealt with", "The rule ends stricter than anyone first proposed");
    else caption(g, "All twelve sign it", "Everyone can rely on everyone else following it on every trip");
  }},
  "holacracy:risky":{ P:14, draw(g,t){
    /* the rulebook grows; a few who know it argue; newer staff fall quiet; time with schools shrinks */
    const R = SX.around(8, 330, 250, 160, 120), experts = [0, 3], newer = [5, 6, 7];
    const grow = ease(ph(t,.15,.6)), quiet = ease(ph(t,.42,.6)), drop = ease(ph(t,.86,.96));
    const bookH = 30 + 110*grow; g.save(); g.globalAlpha = 1 - .7*drop; SX.card(g, 330, 250, 50, bookH); g.restore();
    if (t > .28 && t < .86) experts.forEach((a,i) => experts.forEach((b,j) => { if (i < j) line(g, R[a].x, R[a].y, R[b].x, R[b].y, C.terra, 2.4, [4,3]); }));
    R.forEach((p,i) => actor(g, p.x, p.y, 14, {v: experts.indexOf(i) >= 0 ? 0 : .5, alpha: newer.indexOf(i) >= 0 ? 1 - .6*quiet : 1, inner: newer.indexOf(i) >= 0 && quiet > .5 ? 1 : null, decider: experts.indexOf(i) >= 0}));
    const gov = .2 + .55*ease(ph(t,.3,.78)); SX.bar(g, 600, 160, 140, 22, gov, C.terra); SX.bar(g, 600, 200, 140, 22, 1 - gov, opColor(1));
    if (t < .15) caption(g, "A team adopts the full rulebook for every decision", "Card: the rules");
    else if (t < .42) caption(g, "Meetings fill with arguments about the rules themselves", "Dark outlines: the two who know the rules best");
    else if (t < .6) caption(g, "Newer staff aren't sure their concern would count", "So they say nothing (inner dots)");
    else if (t < .86) caption(g, "Governance takes more time than work with schools", "Bars: time in meetings, time with schools");
    else caption(g, "A year later, the team drops the system", "The rules had become the work");
  }},
  "lazy_consensus:risky":{ P:13, draw(g,t){
    /* a proposal posted in marking week; no one reads it; it goes ahead; three would have objected */
    const P0 = {x:130, y:250}, L = SX.grid(2, 5, 330, 180, 90, 130), objectors = [2, 6, 8];
    const send = ph(t,.12,.3), dl = ph(t,.3,.72), late = ease(ph(t,.8,.9));
    L.forEach((p,i) => { if (send > 0 && send < 1) SX.move(g, P0, p, send, C.ochre, 5);
      for (let k = 0; k < 3; k++) NX.cardAt(g, p.x + 26, p.y + 12 - k*7, ease(ph(t,.3,.4)) * (1 - late*.6), 24, 10);
      actor(g, p.x, p.y, 15, {v: objectors.indexOf(i) >= 0 && late > 0 ? 1 : null, alpha: .9});
      if (objectors.indexOf(i) >= 0) NX.cross(g, p.x, p.y - 30, late); });
    SX.bar(g, 330, 420, 360, 14, dl, C.ochre);
    actor(g, P0.x, P0.y, 18, {v: 0, decider:true});
    if (t > .72 && t < .8) NX.tick(g, P0.x, P0.y - 34, ease(ph(t,.72,.76)));
    if (t < .12) caption(g, "The chair proposes cutting first-year lab hours", "Five days to object, or it goes ahead");
    else if (t < .3) caption(g, "It goes out in the middle of marking week", "Cards: the piles of scripts");
    else if (t < .72) caption(g, "Most lecturers never read it", "The deadline passes with no objections");
    else if (t < .8) caption(g, "Silence is counted as agreement", "The change goes ahead");
    else caption(g, "When teaching starts, three lecturers object", "They never saw the message");
  }},
  "kleroterion:risky":{ P:13, draw(g,t){
    /* parents drawn by lot drop out one by one; the official who prepares the papers remains */
    const pool = SX.grid(4, 6, 80, 150, 36, 40), pick = [1,5,8,14,17,20,22], seats = SX.around(7, 520, 250, 130, 100);
    const off = {x:520, y:250}, mv = ease(ph(t,.1,.24));
    pool.forEach((p,i) => { if (pick.indexOf(i) < 0) actor(g, p.x, p.y, 8, {v:null, alpha:.6}); });
    pick.forEach((idx,k) => { const p = pool[idx], q = seats[k], out = ease(ph(t, .5 + k*.04, .58 + k*.04)) * (k < 6 ? 1 : 0);
      actor(g, lerp(p.x, q.x, mv), lerp(p.y, q.y, mv), lerp(8, 13, mv), {v: mv > .1 ? .5 : null, alpha: 1 - .85*out}); });
    const papers = ease(ph(t,.3,.42)); for (let k = 0; k < 5; k++) NX.cardAt(g, off.x - 60 + k*30, 250 + (k % 2)*8, papers, 22, 14);
    actor(g, off.x, off.y - 40, 17, {v: 0, decider: true});
    if (t > .84) SX.ring(g, off.x, off.y - 40, 36, 36, ease(ph(t,.84,.9)));
    if (t < .1) caption(g, "A district draws parent representatives by lot", "One-year terms on the parents' council");
    else if (t < .3) caption(g, "Meetings are at 2 pm on weekdays, with no training", "Most drawn parents work then");
    else if (t < .5) caption(g, "The papers arrive the night before", "The education officer prepares every one");
    else if (t < .84) caption(g, "Most drawn parents attend once or twice, then stop", "The officer is at every meeting");
    else caption(g, "The officer ends up shaping every decision", "The lottery was meant to share power; it moved it to her");
  }},
  "venice:risky":{ P:14, draw(g,t){
    /* a complex chain of draws and votes; a surprise winner; rumours spread; large members leave */
    const N = [{x:120,y:140,r:20},{x:240,y:100,r:22},{x:380,y:150,r:12},{x:520,y:100,r:20},{x:660,y:150,r:14},{x:180,y:300,r:12},{x:330,y:330,r:18},{x:480,y:300,r:12},{x:630,y:320,r:22},{x:400,y:420,r:12}];
    const big = [0,1,3,6,8], edges = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[2,6],[1,6],[3,8],[6,9],[7,9],[4,8]];
    edges.forEach(([a,b]) => line(g, N[a].x, N[a].y, N[b].x, N[b].y, C.line, 1));
    const steps = ease(ph(t,.08,.3)); for (let k = 0; k < 4; k++){ const a = ease(ph(t, .08 + k*.05, .14 + k*.05)); NX.cardAt(g, 300 + k*50, 230, a*(1 - ease(ph(t,.34,.4))), 30, 16); }
    const win = 9, rum = [1,6,3,8,0,2,7,4,5];
    rum.forEach((n,k) => { const a = ease(ph(t, .48 + k*.03, .52 + k*.03)); if (a > 0) SX.flag(g, N[n].x + N[n].r, N[n].y - N[n].r, C.terra); });
    N.forEach((n,i) => { const leave = big.indexOf(i) >= 0 && i !== 6 ? ease(ph(t, .84 + big.indexOf(i)*.02, .9 + big.indexOf(i)*.02)) : 0;
      actor(g, n.x, n.y, n.r, {v: i === win && t > .36 ? 0 : .5, alpha: 1 - .75*leave, decider: i === win && t > .36}); });
    if (t < .36) caption(g, "A network of education NGOs chooses its chair", "Several rounds of random draws and votes. Few members follow it");
    else if (t < .48) caption(g, "A little-known candidate from a small NGO wins", "Size of dot: size of organisation");
    else if (t < .84) caption(g, "Rumours spread that the draws were fixed", "With so many steps, the network can't easily show otherwise");
    else caption(g, "Several large members stop paying their fees", "A fair process no one could follow was hard to trust");
  }},
  "delphi:risky":{ P:14, draw(g,t){
    /* a panel with similar backgrounds; the median is highlighted; everyone converges; the real number is far off */
    const panel = SX.grid(2, 4, 120, 170, 60, 90), x0 = 420, w = 320, sc = v => x0 + w*v;
    const first = [.22,.3,.18,.27,.35,.25,.2,.32], med = .26, real = .82;
    line(g, x0, 400, x0 + w, 400, C.line, 1.4);
    const r2 = ease(ph(t,.3,.5)), r3 = ease(ph(t,.5,.7));
    panel.forEach((p,i) => { actor(g, p.x, p.y, 15, {v: .15 + (i % 3)*.04});
      const v = lerp(lerp(first[i], lerp(first[i], med, .5), r2), med, r3*.9); const y = 160 + i*28; dot(g, sc(v), y, 6, opColor(.15)); });
    if (t > .3){ const a = ease(ph(t,.3,.38)); g.save(); g.globalAlpha = a; line(g, sc(med), 140, sc(med), 400, C.ink, 2); g.restore(); }
    if (t > .78){ const a = ease(ph(t,.78,.86)); g.save(); g.globalAlpha = a; line(g, sc(real), 140, sc(real), 400, C.terra, 2.4, [6,4]); g.restore(); }
    if (t < .14) caption(g, "An NGO forecasts how many rural maths teachers it must train", "Most of the panel are professors and its own senior staff");
    else if (t < .3) caption(g, "Round 1: everyone forecasts alone", "Their forecasts sit close together, from the same national data");
    else if (t < .5) caption(g, "Round 2: the summary highlights the median", "Black line: the median");
    else if (t < .78) caption(g, "Round 3: nearly everyone moves towards it", "The panel plans for a small shortage");
    else caption(g, "Two years later, the gap is three times larger", "Many rural teachers had already left, which the panel didn't know");
  }},
  "ngt:risky":{ P:13, draw(g,t){
    /* ideas written, shared, ranked privately; the writing course is ranked first to cut; failures rise later */
    const people = SX.around(8, 230, 250, 140, 110), board = SX.grid(4, 2, 470, 140, 70, 40);
    const write = ease(ph(t,.08,.2)), share = ph(t,.2,.42), rank = ease(ph(t,.42,.6)), shut = ease(ph(t,.6,.7)), fail = ease(ph(t,.74,.92));
    people.forEach((p,i) => { actor(g, p.x, p.y, 13, {v: .5}); NX.cardAt(g, p.x, p.y - 26, write*(1 - ease(ph(share, i/8, i/8 + .1))), 16, 10);
      if (rank > 0) NX.cardAt(g, p.x + 22, p.y + 10, rank, 12, 14); });
    board.forEach((b,i) => { const a = ease(ph(share, i/8, i/8 + .12)); if (i === 0){ NX.cardAt(g, b.x, b.y, a*(1 - shut*.8), 54, 24); if (rank > .5) g.save(), g.strokeStyle = C.terra, g.lineWidth = 2.6, g.strokeRect(b.x - 31, b.y - 16, 62, 32), g.restore(); } else NX.cardAt(g, b.x, b.y, a, 54, 24); });
    SX.bar(g, 470, 380, 200, 18, .2 + .45*fail, C.terra);
    if (t < .2) caption(g, "A department must cut its budget by 10%", "Everyone writes ideas alone first");
    else if (t < .42) caption(g, "One idea at a time, round the room, with no discussion", "Every idea goes on the board");
    else if (t < .6) caption(g, "Each person ranks privately", "Top: stop running a small first-year writing course");
    else if (t < .74) caption(g, "The course closes", "No one had discussed what it did");
    else caption(g, "Second-year failure rates rise", "Struggling writers had nowhere to go (bar)");
  }},
  "participatory_budgeting:risky":{ P:14, draw(g,t){
    /* organised districts bring people by bus and win the money; poorer districts get little, year after year */
    const D = [{x:140,y:150,rich:1},{x:140,y:270,rich:1},{x:140,y:390,rich:1},{x:660,y:150,rich:0},{x:660,y:270,rich:0},{x:660,y:390,rich:0}], A = {x:400, y:250};
    const bus = ph(t,.18,.48), y2 = ease(ph(t,.74,.9));
    D.forEach((d,i) => { const n = d.rich ? 6 : 2, pts = SX.around(n, d.x, d.y, 30, 24);
      if (d.rich) pts.forEach((p,j) => line(g, p.x, p.y, pts[(j+1) % n].x, pts[(j+1) % n].y, C.line, 1));
      pts.forEach((p,j) => { actor(g, p.x, p.y, 7, {v: d.rich ? .3 : .7}); if (bus > 0 && bus < 1) SX.move(g, p, A, ph(bus, j*.05, .6 + j*.05), opColor(d.rich ? .3 : .7), 4); }); });
    actor(g, A.x, A.y, 22, {v:null, decider:true});
    const money = ease(ph(t,.5,.7)); const bars = [.8,.75,.7,.12,.08,.1].map((v,i) => money*v*(D[i].rich ? 1 + .25*y2 : 1 - .5*y2));
    D.forEach((d,i) => SX.bar(g, d.rich ? d.x + 50 : d.x - 150, d.y - 9, 100, 18, bars[i], C.ochre));
    if (t < .18) caption(g, "A city lets residents vote on part of the school maintenance budget", "The assemblies are open to all");
    else if (t < .5) caption(g, "Associations in better-off districts bring people by bus", "Left: organised districts. Right: districts where parents work long hours");
    else if (t < .74) caption(g, "They win most of the money", "Bars: maintenance money won");
    else caption(g, "Next year, the winners are even better organised", "The results follow organisation, not need");
  }},
  "polis:risky":{ P:14, draw(g,t){
    /* the map finds agreement; the funder, outside the process, funds something else; turnout falls */
    const pts = Array.from({length:60}, (_,i) => ({x: 120 + rnd(i,1)*360, y: 130 + rnd(i,2)*230})), F0 = {x:680, y:180};
    const grp = i => rnd(i,3) < .5 ? 0 : 1, gather = ease(ph(t,.18,.38)), half = ease(ph(t,.82,.94));
    pts.forEach((p,i) => { const cx = grp(i) ? 380 : 220, x = lerp(p.x, cx + (p.x - 300)*.35, gather), y = lerp(p.y, 245 + (p.y - 245)*.5, gather);
      actor(g, x, y, 6, {v: gather > .1 ? (grp(i) ? .8 : .2) : null, alpha: i % 2 && half > 0 ? 1 - .85*half : 1}); });
    const agree = ease(ph(t,.38,.5)); NX.cardAt(g, 300, 420, agree, 120, 24);
    actor(g, F0.x, F0.y, 20, {v:null, decider:true});
    line(g, 520, 250, 620, 200, C.line, 1.4, [3,5]); if (t > .5 && t < .82) NX.cross(g, 570, 225, ease(ph(t,.56,.62)));
    NX.cardAt(g, F0.x, F0.y + 60, ease(ph(t,.6,.7)), 60, 22);
    if (t < .18) caption(g, "800 parents and older students react to statements about after-school clubs", "Agree, disagree or pass");
    else if (t < .38) caption(g, "The software groups people by how they vote", "Two groups appear");
    else if (t < .5) caption(g, "Both groups agree on homework help and football", "Less interest in the coding club");
    else if (t < .82) caption(g, "The funder renews the grant only for coding", "It never said what it would do with the results");
    else caption(g, "Turnout at the next consultation falls by more than half", "Word spreads that it was pointless");
  }},
  "liquid:risky":{ P:14, draw(g,t){
    /* votes passed on again and again pile up with three super-delegates */
    const M = Array.from({length:36}, (_,i) => ({x: 90 + (i % 9)*70, y: 120 + Math.floor(i/9)*55})), S = [{x:220,y:400},{x:400,y:410},{x:580,y:400}];
    const tgt = i => S[i % 3], via = i => M[(i*7 + 3) % 36], flow = ph(t,.15,.6), dec = ease(ph(t,.66,.8));
    M.forEach((m,i) => { const u = ph(flow, (i % 12)/16, (i % 12)/16 + .3);
      if (u > 0){ const mid = via(i), T = tgt(i); if (u < .5) SX.move(g, m, mid, u*2, opColor(.5), 3.5); else if (u < 1) SX.move(g, mid, T, u*2 - 1, opColor(.5), 3.5); }
      actor(g, m.x, m.y, 8, {v:null, alpha: u >= 1 ? .45 : 1}); });
    S.forEach((s,i) => { const held = Math.min(1, flow*1.4); actor(g, s.x, s.y, 12 + 16*held, {v: dec > 0 ? 0 : .5, decider:true}); });
    if (dec > 0) SX.ring(g, 400, 405, 230, 50, dec);
    if (t < .15) caption(g, "A national students' union votes on policy using liquid democracy", "Members can pass their vote on, and it can be passed on again");
    else if (t < .6) caption(g, "Votes flow along chains to a few well-known activists", "Most members never check where theirs ended up");
    else if (t < .66) caption(g, "Three super-delegates hold thousands of votes", "Size of dot: votes held");
    else caption(g, "On exam policy, the three decide the result", "Most members whose votes they used never heard their view");
  }},
  "futarchy:risky":{ P:14, draw(g,t){
    /* bets push test prep up; scores rise; storytelling falls; children do no better */
    const B = SX.grid(2, 6, 110, 140, 46, 60), bx = [500, 620];
    const bets = ph(t,.2,.55), tp = .2 + .6*ease(bets), other = .5 - .3*ease(bets);
    B.forEach((p,i) => { actor(g, p.x, p.y, 11, {v: .5}); const u = ph(bets, i/14, i/14 + .2); if (u > 0 && u < 1) SX.move(g, p, {x: i < 9 ? bx[0] : bx[1], y: 200}, u, C.ochre, 4); });
    SX.bar(g, 450, 150, 220, 18, tp, C.ochre); SX.bar(g, 450, 190, 220, 18, other, opColor(1));
    const after = ease(ph(t,.62,.78)), next = ease(ph(t,.8,.92));
    SX.bar(g, 450, 300, 220, 18, .4 + .35*after, C.ochre); SX.bar(g, 450, 340, 220, 18, .6 - .3*after, C.terra); SX.bar(g, 450, 380, 220, 18, .5, opColor(1));
    if (next > 0) SX.ring(g, 560, 389, 140, 26, next);
    if (t < .2) caption(g, "A foundation votes to fund whatever raises reading test scores most", "Staff and partner NGOs bet points on the options");
    else if (t < .55) caption(g, "Early bets favour intensive test preparation", "Top bars: the price of test prep and of other programmes");
    else if (t < .8) caption(g, "Scores rise", "Lower bars: test scores, time for storytelling and local-language reading");
    else caption(g, "The next year, children read no better", "The market chased the measure, not the goal (bottom bar)");
  }}
});
