// Хичээлүүдийн хэвлэх материалын нийтлэг хэсэг: гар, гарын зураг, загвар, PDF үүсгэгч.
const fs = require('fs');
const path = require('path');

const COLORS = { 1: '#FFBF8F', 2: '#93C6FF', 3: '#A3E4A0', 4: '#FFE37D', 5: '#F7A8CB' };
const FINGER = { 1: 'Эрхий', 2: 'Долоовор', 3: 'Дунд', 4: 'Ядам', 5: 'Чигчий' };
const COLOR_NAME = { 1: 'улбар шар', 2: 'цэнхэр', 3: 'ногоон', 4: 'шар', 5: 'ягаан' };
const INK = '#1b1b1b';

// ---------- Гар (keyboard) ----------
const K = (lat, cyr, w, f) => ({ lat, cyr, w, f });
const H = (lat, cyr, f, bump = false) => ({ lat, cyr, w: 1, f, home: true, bump });
const M = (label, w, f) => ({ label, w, f, mod: true });

const ROWS = [
  [K('`', '', 1, 5), K('', '1', 1, 5), K('', '2', 1, 4), K('', '3', 1, 3), K('', '4', 1, 2), K('', '5', 1, 2),
    K('', '6', 1, 2), K('', '7', 1, 2), K('', '8', 1, 3), K('', '9', 1, 4), K('', '0', 1, 5),
    K('-', 'Е', 1, 5), K('=', 'Щ', 1, 5), M('Backspace', 2, 5)],
  [M('Tab', 1.5, 5), K('Q', 'Ф', 1, 5), K('W', 'Ц', 1, 4), K('E', 'У', 1, 3), K('R', 'Ж', 1, 2), K('T', 'Э', 1, 2),
    K('Y', 'Н', 1, 2), K('U', 'Г', 1, 2), K('I', 'Ш', 1, 3), K('O', 'Ү', 1, 4), K('P', 'З', 1, 5),
    K('[', 'К', 1, 5), K(']', 'Ъ', 1, 5), K('\\', '', 1.5, 5)],
  [M('Caps Lock', 1.75, 5), H('A', 'Й', 5), H('S', 'Ы', 4), H('D', 'Б', 3), H('F', 'Ө', 2, true), K('G', 'А', 1, 2),
    K('H', 'Х', 1, 2), H('J', 'Р', 2, true), H('K', 'О', 3), H('L', 'Л', 4), H(';', 'Д', 5), K("'", 'П', 1, 5),
    M('Enter', 2.25, 5)],
  [M('Shift', 2.25, 5), K('Z', 'Я', 1, 5), K('X', 'Ч', 1, 4), K('C', 'Ё', 1, 3), K('V', 'С', 1, 2), K('B', 'М', 1, 2),
    K('N', 'И', 1, 2), K('M', 'Т', 1, 2), K(',', 'Ь', 1, 3), K('.', 'В', 1, 4), K('/', 'Ю', 1, 5), M('Shift', 2.75, 5)],
  [M('Ctrl', 1.25, 0), M('Win', 1.25, 0), M('Alt', 1.25, 0), { w: 6.25, f: 1, space: true },
    M('Alt', 1.25, 0), M('Win', 1.25, 0), M('Menu', 1.25, 0), M('Ctrl', 1.25, 0)],
];

const house = (x, y, s = 18, fill = INK) =>
  `<path d="M${x} ${y + s * 0.45} L${x + s / 2} ${y} L${x + s} ${y + s * 0.45} Z" fill="${fill}"/>` +
  `<rect x="${x + s * 0.17}" y="${y + s * 0.42}" width="${s * 0.66}" height="${s * 0.52}" fill="${fill}"/>`;

const numBadge = (cx, cy, n, r = 12) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#333" stroke-width="1.6"/>` +
  `<text x="${cx}" y="${cy + r * 0.45}" text-anchor="middle" font-size="${r * 1.35}" font-weight="700" fill="${INK}">${n}</text>`;

// focus: зөвхөн эдгээр латин товчийг тодруулж, бусдыг бүдгэрүүлнэ.
// latinPrimary: латин үсгийг том, кирилл үсгийг жижгээр харуулна.
function keyboardSVG({ colored, focus = null, latinPrimary = false }) {
  const U = 100, pad = 4;
  let s = '';
  ROWS.forEach((row, r) => {
    let x = 0;
    row.forEach((k) => {
      const kx = x * U + pad, ky = r * U + pad, w = k.w * U - pad * 2, h = U - pad * 2, cx = kx + w / 2;
      const dim = focus && !(k.lat && focus.includes(k.lat));
      const fill = dim ? '#f4f4f4' : colored && k.f ? COLORS[k.f] : '#fff';
      const ink = dim ? '#b4b4b4' : INK, sub = dim ? '#c4c4c4' : '#555';
      const big = latinPrimary && k.cyr && k.lat ? k.lat.toUpperCase() : k.cyr;
      const small = latinPrimary && k.cyr && k.lat ? k.cyr : k.lat;
      s += `<rect x="${kx}" y="${ky}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${dim ? '#cfcfcf' : k.home ? INK : '#555'}" stroke-width="${k.home && !dim ? 5 : 2}"/>`;
      if (small) s += `<text x="${kx + 12}" y="${ky + 25}" font-size="19" fill="${sub}">${esc(small)}</text>`;
      if (k.mod) s += `<text x="${kx + 12}" y="${ky + h - 14}" font-size="17" fill="${dim ? sub : '#333'}">${k.label}</text>`;
      if (big) s += `<text x="${cx}" y="${ky + 62}" text-anchor="middle" font-size="44" font-weight="700" fill="${ink}">${big}</text>`;
      if (k.bump) s += `<line x1="${cx - 15}" y1="${ky + 76}" x2="${cx + 15}" y2="${ky + 76}" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
      if (k.home) s += house(kx + w - 26, ky + 9, 17, dim ? '#c4c4c4' : INK);
      if (dim) { x += k.w; return; }
      if (k.space) {
        s += `<text x="${cx}" y="${ky + 56}" text-anchor="middle" font-size="22" fill="#333">Зай авах товч (Space)</text>`;
        s += numBadge(kx + 30, ky + h - 22, 1) + numBadge(kx + w - 30, ky + h - 22, 1);
      } else if (k.f) {
        s += numBadge(kx + w - 17, ky + h - 17, k.f);
      }
      x += k.w;
    });
  });
  // Зүүн, баруун гарын хил
  const b = [[6, 0], [6, 1], [6.5, 1], [6.5, 2], [6.75, 2], [6.75, 3], [7.25, 3], [7.25, 4]];
  s += `<polyline points="${b.map(([x, y]) => `${x * U},${y * U}`).join(' ')}" fill="none" stroke="#c0392b" stroke-width="5" stroke-dasharray="16 10"/>`;
  s += `<text x="300" y="-14" text-anchor="middle" font-size="26" font-weight="800" fill="${INK}">← ЗҮҮН ГАР</text>`;
  s += `<text x="1050" y="-14" text-anchor="middle" font-size="26" font-weight="800" fill="${INK}">БАРУУН ГАР →</text>`;
  return `<svg class="kbd" viewBox="0 -48 1500 548" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

// Ажлын хуудасны үндсэн мөр (нөхөж бичих)
function homeRowSVG() {
  const keys = [['A', 5], ['S', 4], ['D', 3], ['F', 2, 'b'], ['G', 0, 'А'], ['H', 0, 'Х'], ['J', 2, 'b'], ['K', 3], ['L', 4], [';', 5], ["'", 0, 'П']];
  let s = '';
  keys.forEach(([lat, f, extra], i) => {
    const kx = i * 100 + 4, ky = 4, w = 92, h = 92, cx = kx + w / 2;
    const target = f > 0;
    s += `<rect x="${kx}" y="${ky}" width="${w}" height="${h}" rx="12" fill="${target ? '#fff' : '#e6e6e6'}" stroke="${target ? INK : '#888'}" stroke-width="${target ? 4 : 2}"/>`;
    s += `<text x="${kx + 12}" y="${ky + 25}" font-size="19" fill="#555">${esc(lat)}</text>`;
    if (!target) s += `<text x="${cx}" y="${ky + 62}" text-anchor="middle" font-size="40" font-weight="700" fill="#777">${extra}</text>`;
    if (extra === 'b') s += `<line x1="${cx - 15}" y1="${ky + 78}" x2="${cx + 15}" y2="${ky + 78}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    if (target) s += `<rect x="${cx - 26}" y="118" width="52" height="52" rx="6" fill="#fff" stroke="#555" stroke-width="2" stroke-dasharray="6 5"/>`;
  });
  s += `<line x1="600" y1="0" x2="600" y2="175" stroke="#c0392b" stroke-width="4" stroke-dasharray="12 8"/>`;
  return `<svg class="homerow" viewBox="0 0 1100 176" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

// ---------- Гарын зураг ----------
const HAND_W = 250, HAND_H = 270;
// [дугаар, суурь x, суурь y, хазайлт°, урт, өргөн] — зүүн гар, дээрээс харсан (эрхий баруун талдаа)
const LEFT_FINGERS = [
  [5, 58, 160, -12, 78, 28],
  [4, 88, 148, -5, 108, 30],
  [3, 120, 144, 0, 120, 31],
  [2, 152, 148, 6, 106, 30],
  [1, 172, 200, 52, 80, 32],
];

// mode: 'color' (өнгөтэй, дугаартай) | 'outline' (цагаан, дугаартай) | 'blank' (цагаан, хоосон дугуй)
function handSVG(side, mode) {
  const L = side === 'L';
  const fingers = LEFT_FINGERS.map(([n, bx, by, a, len, w]) => ({ n, bx: L ? bx : HAND_W - bx, by, a: L ? a : -a, len, w }));
  const finger = (f, fill) =>
    `<rect x="${-f.w / 2}" y="${-f.len}" width="${f.w}" height="${f.len}" rx="${f.w / 2}" transform="translate(${f.bx} ${f.by}) rotate(${f.a})" fill="${fill}"/>`;
  const palmX = L ? 44 : HAND_W - 184, wristX = L ? 71 : HAND_W - 157;
  const palm = (fill) => `<rect x="${palmX}" y="138" width="140" height="112" rx="34" fill="${fill}"/><rect x="${wristX}" y="220" width="86" height="60" fill="${fill}"/>`;
  let s = `<g stroke="#2a2a2a" stroke-width="6" stroke-linejoin="round">${fingers.map((f) => finger(f, '#2a2a2a')).join('')}${palm('#2a2a2a')}</g>`;
  s += fingers.map((f) => finger(f, mode === 'color' ? COLORS[f.n] : '#fff')).join('');
  s += palm('#fff');
  fingers.forEach((f) => {
    const rad = (f.a * Math.PI) / 180, d = f.len - f.w / 2 - 1;
    const cx = f.bx + Math.sin(rad) * d, cy = f.by - Math.cos(rad) * d, r = f.w / 2 - 4.5;
    if (mode === 'blank') s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#444" stroke-width="1.6"/>`;
    else s += numBadge(cx, cy, f.n, r);
  });
  s += `<text x="${palmX + 70}" y="205" text-anchor="middle" font-size="15" font-weight="800" letter-spacing="1" fill="#333">${L ? 'ЗҮҮН ГАР' : 'БАРУУН ГАР'}</text>`;
  return `<svg class="hand" viewBox="0 0 ${HAND_W} ${HAND_H}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

// ---------- Зөв суулт ----------
const POSTURE = `<svg class="posture" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
  <line x1="8" y1="224" x2="296" y2="224" stroke="#888" stroke-width="3"/>
  <rect x="50" y="92" width="9" height="72" rx="3" fill="#b9b9b9"/>
  <rect x="56" y="156" width="66" height="9" rx="3" fill="#b9b9b9"/>
  <line x1="64" y1="165" x2="64" y2="224" stroke="#b9b9b9" stroke-width="6"/>
  <line x1="114" y1="165" x2="114" y2="224" stroke="#b9b9b9" stroke-width="6"/>
  <rect x="128" y="128" width="166" height="8" rx="2" fill="#9a9a9a"/>
  <line x1="284" y1="136" x2="284" y2="224" stroke="#9a9a9a" stroke-width="6"/>
  <rect x="148" y="121" width="42" height="7" rx="2" fill="#555"/>
  <rect x="244" y="96" width="6" height="32" fill="#666"/>
  <rect x="232" y="124" width="30" height="5" fill="#666"/>
  <rect x="236" y="38" width="10" height="62" rx="2" fill="#444"/>
  <g stroke="#1f5fae" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <polyline points="78,150 80,88"/>
    <polyline points="80,94 90,130 150,124"/>
    <polyline points="78,150 140,150 140,218 160,218"/>
  </g>
  <circle cx="84" cy="62" r="17" fill="#1f5fae"/>
  <line x1="102" y1="60" x2="228" y2="62" stroke="#c0392b" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="165" y="52" text-anchor="middle" font-size="13" font-weight="700" fill="#c0392b">50–70 см</text>
  <text x="96" y="146" font-size="12" font-weight="700" fill="${INK}">90°</text>
  <text x="146" y="168" font-size="12" font-weight="700" fill="${INK}">90°</text>
  <text x="8" y="82" font-size="12" font-weight="700" fill="${INK}">Нуруу</text>
  <text x="8" y="96" font-size="12" font-weight="700" fill="${INK}">тэгш</text>
  <text x="168" y="242" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">Хөл шалан дээр</text>
</svg>`;

// ---------- Инээмсэглэл ----------
function face(kind) {
  const mouth = { good: 'M11 21 Q17 27 23 21', mid: 'M11 22 L23 22', bad: 'M11 24 Q17 18 23 24' }[kind];
  return `<svg class="face" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="12" cy="13" r="2" fill="#333"/><circle cx="22" cy="13" r="2" fill="#333"/><path d="${mouth}" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
}

function esc(t) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const houseInline = `<svg class="ico" viewBox="0 0 18 18">${house(0, 0, 18)}</svg>`;
const makeFooter = (title, total) => (n) =>
  `<div class="foot"><span>${title} · 4-р анги</span><span>${n}/${total}</span></div>`;
const nameLine = `<div class="namebox">Нэр: <span class="blank w50"></span> Анги: <span class="blank w15"></span> Огноо: <span class="blank w20"></span></div>`;

function legend(colored) {
  return [1, 2, 3, 4, 5].map((n) => `
    <div class="lg-row"><span class="sw" style="background:${colored ? COLORS[n] : '#fff'}">${n}</span>
    <b>${FINGER[n]} хуруу</b><span class="cn">${COLOR_NAME[n]}</span></div>`).join('');
}

function keyboardPage(colored, n, footer) {
  return `
<section class="page land">
  <header class="kb-head">
    <div>
      <div class="kicker">${colored ? 'Цаасан гар' : 'Нэмэлт · Будах цаасан гар'}</div>
      <h1>Гарын 10 хурууны зөв байрлал</h1>
      <p class="sub">${colored
        ? `Хуруу бүр зөвхөн өөрийн өнгөтэй товчийг дарна. Товч дарсны дараа үндсэн мөртөө ${houseInline} буцна.`
        : 'Товч бүрийн буланд байгаа хурууны дугаарыг хараад, доорх хүснэгтийн өнгөөр будаарай.'}</p>
    </div>
    <div class="owner">Миний нэр:<span class="blank w45"></span></div>
  </header>
  ${keyboardSVG({ colored })}
  <div class="kb-bottom">
    <div class="hands">${handSVG('L', colored ? 'color' : 'outline')}${handSVG('R', colored ? 'color' : 'outline')}</div>
    <div class="box">
      <h3>Хурууны нэр, дугаар, өнгө</h3>
      ${legend(colored)}
      <p class="tiny">Эрхий хуруу (1) — зай авах товч дээр.</p>
    </div>
    <div class="box rules">
      <h3>3 алтан дүрэм</h3>
      <ol>
        <li>Хуруу бүр зөвхөн <b>өөрийн өнгөтэй</b> товчийг дарна.</li>
        <li>Товч дарсны дараа хуруу <b>үндсэн мөртөө</b> буцна.</li>
        <li>Гар руу биш, <b>дэлгэц рүү</b> харна.</li>
      </ol>
      <p class="tiny"><b>Ө</b> ба <b>Р</b> товч дээр товгор (—) бий. Долоовор хуруугаараа мэдэрч олоорой!</p>
    </div>
  </div>
  ${footer(n)}
</section>`;
}

const letterBoxes = (first, count) =>
  `<span class="lb filled">${first}</span>` + '<span class="lb"></span>'.repeat(count - 1);

const fingerTable = (rows) => `
<table class="ft">
  <tr><th>Үсэг</th><th>Аль гар? (дугуйл)</th><th>Аль хуруу? (нэр, дугаар)</th></tr>
  ${rows.map(([l, ex]) => `<tr><td class="big">${l}</td>
    <td><span class="${ex ? 'circ' : ''}">Зүүн</span> · Баруун</td>
    <td>${ex ? '<i>дунд (3)</i>' : ''}</td></tr>`).join('')}
</table>`;

const wordRow = (word, answer) => `
<div class="word">
  ${[...word].map((ch, i) => `<div class="wl"><div class="wc">${ch}</div><div class="wa">${answer ? answer[i] : ''}</div></div>`).join('')}
</div>`;

const CSS = `
@page { margin: 0; }
body.portrait .page.land, body.landscape .page:not(.land) { display: none; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Carlito, "DejaVu Sans", sans-serif; color: ${INK}; font-size: 10.2pt; line-height: 1.35; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; padding: 12mm 13mm 14mm; position: relative; overflow: hidden; break-after: page; }
.page.land { width: 297mm; height: 210mm; padding: 8mm 12mm 11mm; }
.kicker { font-size: 8pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #1f5fae; }
h1 { font-size: 20pt; line-height: 1.15; margin: 1mm 0 2mm; font-weight: 800; }
h2 { font-size: 11pt; margin: 4mm 0 1.5mm; font-weight: 800; }
h3 { font-size: 10.5pt; margin: 0 0 2mm; font-weight: 800; }
h4 { font-size: 9.5pt; margin: 0 0 1mm; }
p { margin: 0 0 1.5mm; }
ul, ol { margin: 0; padding-left: 5mm; }
li { margin-bottom: .8mm; }
.meta { display: flex; gap: 2mm; flex-wrap: wrap; margin-bottom: 2mm; }
.meta span { background: #eef3fb; border: 1px solid #c9d8ee; border-radius: 10mm; padding: .6mm 3mm; font-weight: 600; font-size: 9pt; }
.meta2 { font-size: 9.5pt; margin-bottom: 1mm; }
.blank { display: inline-block; border-bottom: 1.2px solid #444; height: 1em; vertical-align: baseline; }
.w15 { width: 15mm; } .w20 { width: 20mm; } .w25 { width: 25mm; } .w30 { width: 30mm; } .w45 { width: 45mm; } .w50 { width: 50mm; } .w100 { width: 150mm; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm; }
table.plan { width: 100%; border-collapse: collapse; font-size: 9pt; }
.plan th, .plan td { border: 1px solid #bdbdbd; padding: 1.6mm 2mm; vertical-align: top; text-align: left; }
.plan th { background: #eef3fb; font-weight: 800; }
.plan .t { width: 15mm; white-space: nowrap; font-weight: 700; }
.plan .st { width: 26mm; font-weight: 700; }
.note { margin-top: 4mm; background: #fff8e1; border: 1px solid #f0d58a; border-radius: 2mm; padding: 2.5mm 3.5mm; font-size: 9.2pt; }
.poem { font-size: 11pt; font-weight: 600; line-height: 1.7; background: #f3f7fc; border-left: 3px solid #1f5fae; padding: 2mm 4mm; border-radius: 1mm; }
.poem.fill { font-size: 12pt; line-height: 1.95; background: none; border-left: 3px solid #1f5fae; }
table.dict { width: 100%; border-collapse: collapse; margin-top: 1mm; }
.dict th, .dict td { border: 1px solid #bdbdbd; padding: 1.5mm 2.5mm; text-align: left; }
.dict th { width: 52mm; background: #eef3fb; font-size: 9pt; }
.dict td { font-size: 11pt; font-weight: 600; }
.dict td.ltr { letter-spacing: .35em; font-size: 12pt; }
.answers { font-size: 9pt; background: #f7f7f7; border-radius: 2mm; padding: 3mm 4mm; }
.foot { position: absolute; left: 13mm; right: 13mm; bottom: 6mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #777; border-top: 1px solid #ddd; padding-top: 1.2mm; }
.land .foot { left: 12mm; right: 12mm; bottom: 4.5mm; }
.ico { width: 3.6mm; height: 3.6mm; vertical-align: -0.5mm; }

/* Цаасан гар */
.kb-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1mm; }
.kb-head h1 { font-size: 17pt; margin: .5mm 0 .5mm; }
.kb-head .sub { font-size: 9.5pt; margin: 0; color: #333; }
.owner { font-size: 11pt; font-weight: 700; }
svg.kbd { width: 273mm; height: auto; display: block; font-family: Carlito, "DejaVu Sans", sans-serif; }
.kb-bottom { display: grid; grid-template-columns: 124mm 1fr 1fr; gap: 5mm; margin-top: 2mm; align-items: start; }
.hands { display: flex; justify-content: space-around; }
.hands svg { width: 56mm; height: auto; }
svg.hand, svg.homerow, svg.posture { font-family: Carlito, "DejaVu Sans", sans-serif; }
.box { border: 1.5px solid #cfcfcf; border-radius: 3mm; padding: 3mm 3.5mm; font-size: 9.5pt; }
.lg-row { display: flex; align-items: center; gap: 2.5mm; margin-bottom: 1.6mm; }
.sw { width: 9mm; height: 6.5mm; border-radius: 1.5mm; border: 1.5px solid #555; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; }
.lg-row b { min-width: 30mm; }
.cn { color: #444; }
.tiny { font-size: 8.8pt; margin-top: 2mm; color: #333; }
.rules ol { padding-left: 5mm; font-size: 10pt; }
.rules li { margin-bottom: 1.6mm; }

/* Ажлын хуудас */
.ws { font-size: 11pt; }
.ws h1 { font-size: 22pt; }
.namebox { font-size: 10.5pt; margin: 1mm 0 3mm; }
.task { font-size: 11pt; margin: 3.2mm 0 1.8mm; }
.tn { display: inline-flex; width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #1f5fae; color: #fff; font-weight: 800; font-size: 10pt; align-items: center; justify-content: center; margin-right: 1.5mm; vertical-align: 0.2mm; }
.ws-hands { display: flex; justify-content: center; gap: 14mm; }
.ws-hands svg { width: 54mm; height: auto; }
.names { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm 6mm; font-size: 11pt; }
.names > div { display: flex; align-items: center; gap: 1mm; }
.nn { font-weight: 800; width: 5mm; }
.lb { display: inline-block; width: 7.5mm; height: 8.5mm; border: 1.3px solid #555; border-radius: 1mm; vertical-align: middle; text-align: center; line-height: 8.2mm; font-weight: 800; }
.lb.filled { background: #eef3fb; }
svg.homerow { width: 170mm; height: auto; display: block; margin: 0 auto; }
.ans { margin: 3mm 0 0; }
.tables { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
table.ft { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
.ft th, .ft td { border: 1px solid #9e9e9e; padding: 1.4mm 1.8mm; height: 7.6mm; }
.ft th { background: #eef3fb; font-size: 8.5pt; }
.ft td.big { font-size: 15pt; font-weight: 800; text-align: center; width: 12mm; }
.ft td:nth-child(2) { width: 30mm; text-align: center; }
.circ { border: 1.6px solid ${INK}; border-radius: 50%; padding: .3mm 1.5mm; }
.posture-wrap { display: grid; grid-template-columns: 1fr 62mm; gap: 4mm; align-items: center; }
.tf { list-style: decimal; padding-left: 6mm; font-size: 10.5pt; }
.tf li { margin-bottom: 1.3mm; }
.tick { display: inline-block; width: 6mm; height: 6mm; border: 1.4px solid #444; border-radius: 1mm; vertical-align: middle; margin-right: 2.5mm; }
svg.posture { width: 62mm; height: auto; }
.words { display: flex; flex-wrap: wrap; gap: 3mm 8mm; align-items: flex-end; }
.wex { display: flex; align-items: center; gap: 2mm; }
.exl { font-size: 9.5pt; color: #555; }
.word { display: flex; gap: 1mm; }
.wl { display: flex; flex-direction: column; gap: .8mm; }
.wc { width: 10mm; height: 9mm; background: #eef3fb; border: 1.3px solid #555; border-radius: 1mm; text-align: center; line-height: 8.7mm; font-weight: 800; font-size: 13pt; }
.wa { width: 10mm; height: 9mm; border: 1.3px dashed #555; border-radius: 1mm; text-align: center; line-height: 8.7mm; font-size: 10pt; font-weight: 700; color: #1f5fae; }
table.self { width: 100%; border-collapse: collapse; font-size: 10pt; }
.self th, .self td { border: 1px solid #bdbdbd; padding: .8mm 2mm; text-align: center; }
.self th { font-size: 8.5pt; font-weight: 700; background: #f6f6f6; }
.self td:first-child { text-align: left; }
.face { width: 6.2mm; height: 6.2mm; vertical-align: middle; }
`;


const baseCSS = CSS;

// Chromium нэг PDF-д босоо, хэвтээ хуудсыг хольж чадахгүй тул тусад нь хэвлээд,
// pypdf-ээр анхны дарааллаар нь нийлүүлнэ.
async function render({ title, pages, htmlPath, pdfPath, extraCSS = '' }) {
  const html = `<!doctype html>
<html lang="mn"><head><meta charset="utf-8">
<title>${title}</title>
<style>${baseCSS}${extraCSS}</style></head>
<body>${pages}</body></html>`;
  fs.writeFileSync(htmlPath, html);
  const order = [...pages.matchAll(/<section class="page( land)?/g)].map((m) => (m[1] ? 'l' : 'p'));
  const { chromium } = require('playwright');
  const { execFileSync } = require('child_process');
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gar-'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  for (const [cls, width, height] of [['portrait', '210mm', '297mm'], ['landscape', '297mm', '210mm']]) {
    await page.evaluate((c) => { document.body.className = c; }, cls);
    await page.pdf({ path: path.join(tmp, cls + '.pdf'), width, height, printBackground: true });
  }
  await browser.close();
  execFileSync('python3', ['-c', `
import sys
from pypdf import PdfReader, PdfWriter
src = {'p': PdfReader(sys.argv[1]), 'l': PdfReader(sys.argv[2])}
idx = {'p': 0, 'l': 0}
w = PdfWriter()
for kind in sys.argv[3]:
    w.add_page(src[kind].pages[idx[kind]])
    idx[kind] += 1
w.add_metadata({'/Title': sys.argv[5]})
w.write(sys.argv[4])
`, path.join(tmp, 'portrait.pdf'), path.join(tmp, 'landscape.pdf'), order.join(''), pdfPath, title]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('PDF:', pdfPath);
}

module.exports = {
  COLORS, FINGER, COLOR_NAME, INK, house, numBadge, keyboardSVG, homeRowSVG, handSVG, POSTURE, face, esc,
  houseInline, makeFooter, nameLine, legend, keyboardPage, letterBoxes, fingerTable, wordRow, render,
};
