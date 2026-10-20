// №18 · Зүүн гарын дасгал: A S D F ба G — 4-р анги, компьютергүй хичээлийн хэвлэх материал.
// Ажиллуулах: NODE_PATH=$(npm root -g) node source/lesson18.js
const path = require('path');
const { COLORS, INK, house, numBadge, keyboardSVG, handSVG, face, makeFooter, nameLine, render } = require('./common');

const TITLE = 'Зүүн гарын дасгал: A S D F ба G';
const footer = makeFooter(TITLE, 5);

// Зүүн гарын 5 товч: A S D F G, доор нь хурууны нэр, F ⇄ G сум
const LEFT_KEYS = [['A', 'Й', 5, 'чигчий'], ['S', 'Ы', 4, 'ядам'], ['D', 'Б', 3, 'дунд'], ['F', 'Ө', 2, 'долоовор'], ['G', 'А', 2, 'долоовор']];

function leftStripSVG({ blank = false } = {}) {
  let s = `<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#c0392b"/></marker></defs>`;
  LEFT_KEYS.forEach(([lat, cyr, f, name], i) => {
    const kx = i * 104 + 4, ky = 4, w = 96, h = 96, cx = kx + w / 2;
    s += `<rect x="${kx}" y="${ky}" width="${w}" height="${h}" rx="12" fill="${blank ? '#fff' : COLORS[f]}" stroke="${INK}" stroke-width="${f && i < 4 ? 5 : 3}"/>`;
    if (!blank) {
      s += `<text x="${kx + 12}" y="${ky + 25}" font-size="19" fill="#555">${cyr}</text>`;
      s += `<text x="${cx}" y="${ky + 64}" text-anchor="middle" font-size="48" font-weight="700" fill="${INK}">${lat}</text>`;
      s += numBadge(kx + w - 17, ky + h - 17, f);
    }
    if (lat === 'F') s += `<line x1="${cx - 15}" y1="${ky + 80}" x2="${cx + 15}" y2="${ky + 80}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    if (i < 4 && !blank) s += house(kx + w - 26, ky + 9, 17);
    if (!blank) s += `<text x="${cx}" y="128" text-anchor="middle" font-size="18" font-weight="700" fill="#333">${name}</text>`;
  });
  s += `<path d="M366 -4 C 384 -58, 450 -58, 470 -4" fill="none" stroke="#c0392b" stroke-width="5" marker-start="url(#ah)" marker-end="url(#ah)"/>`;
  s += `<text x="418" y="-50" text-anchor="middle" font-size="17" font-weight="800" fill="#c0392b">дараад буцна</text>`;
  return `<svg class="strip" viewBox="0 -70 524 210" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

const keyBox = (l) => `<span class="kb">${l}</span>`;

const numberRow = (word, answer) => `
<div class="word">
  ${[...word].map((ch, i) => `<div class="wl"><div class="wc">${ch}</div><div class="wa">${answer ? answer[i] : ''}</div></div>`).join('')}
</div>`;

const DRILLS = [
  'f f f g g g f g f g f g',
  'a a s s d d f f g g',
  'as as ad ad fa fa ga ga',
  'gas gas sad sad add add',
  'dad dad fad fad sag sag',
  'dad adds gas   a sad saga',
];

const PROGRESS = [
  ['17', 'Home row (A S D F – J K L ;)', '15'],
  ['18', 'Зүүн гар: A S D F ба G', '18'],
  ['19', 'Баруун гар: J K L ; ба H', '20'],
  ['20', 'Дээд эгнээ', '22'],
  ['21', 'Доод эгнээ', '25'],
  ['22', 'Shift ба цэг таслал', '28'],
  ['23', 'Тоон эгнээ', '30'],
];

const pages = `
<section class="page">
  <div class="kicker">Багшийн хуудас · Ээлжит хичээлийн төлөвлөгөө</div>
  <h1>${TITLE}</h1>
  <table class="info">
    <tr><th>Судлагдахуун</th><td>Программ хангамж, график</td><th>Хамрах хүрээ</th><td>IV анги (4-2 бүлэг)</td></tr>
    <tr><th>Нэгж сэдэв</th><td>Fast Type программ (9 цаг)</td><th>Хугацаа</th><td>40 минут · нэгжийн 3/9 дэх цаг · <b>компьютергүй</b></td></tr>
    <tr><th>Хөтөлбөр</th><td>Cambridge Primary Computing · Stage 5</td><th>Улирал</th><td>I улирал, 6-р долоо хоног · жилийн 18/96 дэх цаг</td></tr>
    <tr><th>Хичээлийн зорилго</th><td colspan="3">Зүүн гарын хуруунуудыг бие даан удирдаж, A S D F G товчлуурыг харалгүй дарж чадах болох.</td></tr>
    <tr><th>Хичээлийн зорилт</th><td colspan="3">1. Зүүн гарын 4 хуруу бүрийн товчлуурыг нэрлэх · 2. G товчлуурыг долоовор хуруугаар дарж, home row руу буцаах · 3. Зөвхөн зүүн гарын үгсийг (gas, add, sad, dad) цаасан гар дээр алдаагүй бичих</td></tr>
    <tr><th>Түлхүүр үг</th><td colspan="3">зүүн гар, A S D F G, долоовор хуруу, home row руу буцах, алдааны тоо</td></tr>
    <tr><th>Багшийн бэлтгэл</th><td colspan="3">1. Зүүн гарын схем (3-р хуудас) — сурагч бүрт · 2. Ажлын хуудас (4-р хуудас), 1 минутын сорилт ба ахицын хүснэгт (5-р хуудас) — сурагч бүрт · 3. Өмнөх хичээлийн цаасан гар, өнгийн харандаа, секундомер/утасны цаг</td></tr>
  </table>

  <table class="kca">
    <tr><th>Мэдлэг</th><th>Чадвар</th><th>Хандлага</th></tr>
    <tr><td>• Зүүн гарын товчлуурын хуваарилалт<br>• G товчлуурын онцлог<br>• Home row руу буцах зарчим</td>
      <td>• Зүүн гараа бие даан удирдах<br>• 5 товчлуурыг харалгүй дарах<br>• Алдаагаа тооцоолох</td>
      <td>• Давтан дасгалжих хичээнгүй байдал<br>• Алдаагаа хүлээн зөвшөөрөх<br>• Бусдыг дэмжих</td></tr>
  </table>

  <table class="plan">
    <tr><th class="st">Үе шат</th><th>Багшийн үйл ажиллагаа</th><th>Сурагчийн үйл ажиллагаа</th><th class="mat">Хэрэглэгдэхүүн</th><th class="ev">Үнэлгээ</th></tr>
    <tr><td class="st">1. Зохион байгуулалт, сэдэлжүүлэх<span>5 мин</span></td>
      <td>Мэндчилж, ирц бүртгэнэ. Гэрийн даалгаврыг 3 сурагчаар хэлүүлнэ. Цаасан гар дээр «Гараа өргө! — Байрандаа!» 1 минутын халаалт хийлгэнэ.</td>
      <td>Үр дүнгээ хэлнэ. Хуруугаа харалгүй home row-д тавина.</td>
      <td>Өмнөх хичээлийн цаасан гар</td><td>Халаалтын ажиглалт</td></tr>
    <tr><td class="st">2. Асуудал дэвшүүлэх<span>5 мин</span></td>
      <td>«Home row-оос гадна өөр товчлуур байна. Хэн нь дарах вэ?» гэж асууна. Зүүн гарын схем дээр G-г заан, аль хуруунд хамгийн ойр байгааг олуулна.</td>
      <td>Таамаглаж хариулна («долоовор»). Зорилгоо тэмдэглэнэ.</td>
      <td>Зүүн гарын схем (3-р х.)</td><td>Асуулт-хариулт</td></tr>
    <tr><td class="st">3. Асуудал шийдвэрлэх<span>15 мин</span></td>
      <td>Зүүн гарын 4 хуруу + G-г нэг бүрчлэн үзүүлнэ. Зарчим: «Товчлуур дарсны дараа хуруу home row руу <b>БУЦНА</b>». Самбарт: gas, add, sad, dad, saga. «Багш хэлнэ — хуруу дарна» (2-р хуудас). Ажлын хуудсыг өгнө. Сурагч бүрийг тойрч засна.</td>
      <td>G-г долоовороор дарж, буцааж F дээр тавина. Самбарын үгсийг цаасан гар дээр гараа харалгүй «бичнэ». Ажлын хуудсыг бөглөнө.</td>
      <td>Зүүн гарын схем, ажлын хуудас, самбар</td><td>Ажиглалт: хуруу буцаж байгаа эсэх</td></tr>
    <tr><td class="st">4. Бататгах<span>10 мин</span></td>
      <td>«1 минутын сорилт»-ыг хосоор хийлгэнэ (5-р хуудас). Үр дүнг ахицын хүснэгтэд бичүүлж, өмнөх хичээлтэй харьцуулуулна.</td>
      <td>Нэг нь цаг хэмжиж ажиглана, нөгөө нь «бичнэ»; дараа нь солино. Зөв ба буруу хуруугаар дарсныг тоолж бүртгэнэ.</td>
      <td>5-р хуудас, цаг</td><td>Хэмжилт: 1 минутад 18+ үсгийг зөв хуруугаар</td></tr>
    <tr><td class="st">5. Дүгнэх, үнэлгээ<span>3 мин</span></td>
      <td>«Хуруу яагаад home row руу буцах ёстой вэ?» гэж асууж дүгнэнэ. Өөрийн үнэлгээг бөглүүлнэ.</td>
      <td>Хариулж тайлбарлана. Өөрийн үнэлгээний хэсгийг бөглөнө.</td>
      <td>5-р хуудас</td><td>Өөрийн үнэлгээ</td></tr>
    <tr><td class="st">6. Гэрийн даалгавар<span>2 мин</span></td>
      <td>5-р хуудасны дасгалын мөрүүдийг цаасан гар дээр өдөрт 10 минут давтах.</td>
      <td>Даалгавраа тэмдэглэж авна.</td>
      <td>Дэвтэр</td><td>Дараагийн хичээлд шалгана</td></tr>
  </table>
  ${footer(1)}
</section>

<section class="page">
  <div class="kicker">Багшийн хуудас · Туслах материал ба хариу</div>

  <h2>Асуудал дэвшүүлэх үеийн яриа</h2>
  <p>«Өнгөрсөн хичээлээр бид 8 «байшин» товч сурсан. Гэтэл A S D F-ийн хажууд <b>G</b> гэдэг товч байна. Түүнд байшин алга! Ямар хуруу түүнийг дарах вэ? Аль хуруу хамгийн ойр байна вэ?» — сурагчид цаасан гар дээр хуруугаа тавиад шалгана. Хариу: <b>долоовор хуруу</b>, учир нь F-ийн яг хажууд.</p>

  <h2>«Багш хэлнэ — хуруу дарна» жагсаалт</h2>
  <p>Багш үсэг, үгийг хэлэхэд сурагч цаасан гар дээр зөв хуруугаар дарж, хурууныхаа нэрийг хэлнэ. Үг хооронд зай авах товчийг эрхий хуруугаар дарна.</p>
  <table class="dict">
    <tr><th>Шат 1 · A S D F</th><td class="mono">f d s a · a s d f · s f a d · d a f s</td></tr>
    <tr><th>Шат 2 · G-тэй</th><td class="mono">f g f · g f g · f f g g · a g s g d g</td></tr>
    <tr><th>Шат 3 · Үгс</th><td class="mono">as · ad · add · dad · sad · gas · fad · sag · saga</td></tr>
    <tr><th>Шат 4 · Хэллэг</th><td class="mono">dad adds gas · a sad saga · sad dad</td></tr>
  </table>

  <div class="note warn"><b>Хөтөлбөрийн үгсийн тухай:</b> Хөтөлбөрт «зөвхөн зүүн гарын үгс» гэж <b>flag</b>, <b>glass</b> орсон боловч эдгээр үгэнд <b>L</b> үсэг бий. L-ийг баруун гарын ядам хуруугаар дардаг. Тиймээс энэ материалд цэвэр зүүн гарын үгсийг (gas, add, sad, dad, saga) сонгосон. Ажлын хуудасны 3-р даалгаврын «урхи» үгс нь flag, glass. Эдгээр үгс дараагийн хичээлд (баруун гар: J K L ; ба H) гүүр болно.</div>

  <h2>Анхаарах түгээмэл алдаа</h2>
  <ul>
    <li>G-г дарсны дараа долоовор хуруу F рүү <b>буцахгүй</b>, G дээрээ үлдэх.</li>
    <li>G-г дарахдаа бугуй, бүх гараараа хөдлөх. Зөвхөн долоовор хуруу хажуу тийш сунана.</li>
    <li>G-г дунд эсвэл ядам хуруугаар дарах.</li>
    <li>Чигчий хуруу A-гаас өргөгдөх, баруун гар home row-оос гарах.</li>
  </ul>

  <h2>1 минутын сорилтыг хэрхэн явуулах вэ?</h2>
  <p>Хосоороо: <b>А</b> сурагч цаасан гар дээр 5-р хуудасны мөрүүдийг эхнээс нь «бичнэ». <b>Б</b> сурагч 1 минут хэмжиж, зөв хуруугаар дарсан үсэг бүрт зураас (|) татна. Буруу хуруугаар дарвал тойрог (○) зурна. Дараа нь солино. 18 ба түүнээс дээш үсгийг зөв хуруугаар дарвал зорилтод хүрсэн гэж үзнэ.</p>

  <h2>Хариу</h2>
  <div class="answers">
    <ol>
      <li>Чигчий — A · Ядам — S · Дунд — D · Долоовор — F ба G. Өнгө: чигчий ягаан, ядам шар, дунд ногоон, долоовор цэнхэр.</li>
      <li>Долоовор хуруу <b>F</b> ба <b>G</b>-г дарна. G-г дарсны дараа <b>F</b> руу буцна. Товгор <b>F</b> дээр байдаг.</li>
      <li>Зөвхөн зүүн гараар: <b>gas, sad, dad, add, sag</b>. Бусад нь (hall, flag, ask, glass, lad) баруун гарын H, L, K үсэгтэй.</li>
      <li>gas 2 5 4 · add 5 3 3 · sad 4 5 3 · dad 3 5 3 · saga 4 5 2 5</li>
      <li>Жишээ: as, ad, add, dad, fad, gas, sad, sag, saga, gag.</li>
    </ol>
  </div>
  ${footer(2)}
</section>

<section class="page land">
  <header class="kb-head">
    <div>
      <div class="kicker">Зүүн гарын схем</div>
      <h1>${TITLE}</h1>
      <p class="sub">Зүүн гарын 4 хуруу <b>A S D F</b> дээр байрандаа. <b>G</b>-г долоовор хуруугаар дараад <b>F</b> руу буцна. Баруун гар J K L ; дээр тайван хүлээнэ.</p>
    </div>
    <div class="owner">Миний нэр:<span class="blank w45"></span></div>
  </header>
  ${keyboardSVG({ colored: true, focus: ['A', 'S', 'D', 'F', 'G'], latinPrimary: true })}
  <div class="l18-bottom">
    <div class="hands">${handSVG('L', 'color')}</div>
    <div class="box center">
      <h3>Хуруу бүрийн товч</h3>
      ${leftStripSVG()}
    </div>
    <div class="box rules">
      <h3>Зүүн гарын 3 дүрэм</h3>
      <ol>
        <li>Чигчий, ядам, дунд, долоовор хуруу <b>A S D F</b> дээр байрандаа байна.</li>
        <li><b>G</b>-г зөвхөн <b>долоовор</b> хуруугаар дарна. Бусад хуруу хөдлөхгүй.</li>
        <li>Дарсны дараа долоовор хуруу <b>F</b> руу <b>БУЦНА</b>.</li>
      </ol>
      <p class="tiny">Зай авах товчийг эрхий хуруугаар дарна. Товгортой <b>F</b>-ийг харалгүй олоорой!</p>
    </div>
  </div>
  ${footer(3)}
</section>

<section class="page ws">
  <div class="kicker">Ажлын хуудас</div>
  <h1>Зүүн гарын дасгал: A S D F ба G</h1>
  ${nameLine}

  <div class="task"><span class="tn">1</span> Хуруу бүрийг дардаг товчтой нь зураасаар холбоорой. Дараа нь товчийг хурууны өнгөөр будаарай. <i>(Нэг хуруу 2 товчтой!)</i></div>
  <div class="match">
    <div class="mcol left">
      <div>Чигчий хуруу <span class="dot"></span></div>
      <div>Ядам хуруу <span class="dot"></span></div>
      <div>Дунд хуруу <span class="dot"></span></div>
      <div>Долоовор хуруу <span class="dot"></span></div>
    </div>
    <div class="mgap"></div>
    <div class="mcol right">
      ${['D', 'A', 'G', 'S', 'F'].map((l) => `<div><span class="dot"></span>${keyBox(l)}</div>`).join('')}
    </div>
  </div>

  <div class="task"><span class="tn">2</span> Хариулаарай.</div>
  <div class="qa">
    <div>Долоовор хуруу аль 2 товчийг дардаг вэ? <span class="lb"></span> ба <span class="lb"></span></div>
    <div>G-г дарсны дараа долоовор хуруу аль товч руу буцах вэ? <span class="lb"></span></div>
    <div>Аль товч дээр товгор байдаг вэ? <span class="lb"></span></div>
  </div>

  <div class="task"><span class="tn">3</span> Аль үгийг <b>ЗӨВХӨН зүүн гараар</b> бичиж болох вэ? Дугуйлаарай. <i>(Урхи бий!)</i></div>
  <div class="words-pick">${['gas', 'hall', 'sad', 'flag', 'dad', 'ask', 'add', 'glass', 'sag', 'lad'].map((w) => `<span>${w}</span>`).join('')}</div>

  <div class="task"><span class="tn">4</span> Үгийг цаасан гар дээрээ «бичээд», үсэг бүрийн доор хурууны <b>дугаарыг</b> бичээрэй.</div>
  <div class="words">
    <div class="wex"><span class="exl">Жишээ:</span>${numberRow('fad', ['2', '5', '3'])}</div>
    ${numberRow('gas')}${numberRow('add')}${numberRow('sad')}${numberRow('dad')}${numberRow('saga')}
  </div>
  <p class="hint">Санамж: чигчий 5 · ядам 4 · дунд 3 · долоовор 2</p>

  <div class="task"><span class="tn">5</span> Зөвхөн <b>a s d f g</b> үсгийг ашиглан аль болох олон үг бичээрэй.</div>
  <div class="lines"><span class="blank full"></span><span class="blank full"></span></div>
  ${footer(4)}
</section>

<section class="page ws">
  <div class="kicker">1 минутын сорилт · Ахицын хүснэгт</div>
  <h1>Хэр хурдан, хэр зөв бэ?</h1>
  ${nameLine}

  <div class="task"><span class="tn">1</span> Хосоороо ажиллана. Нэг нь 1 минут хэмжинэ. Нөгөө нь цаасан гар дээр мөрүүдийг эхнээс нь <b>гар руугаа харалгүй</b> «бичнэ». Хос нь зөв хуруугаар дарсан үсэг бүрт | тэмдэг, буруу хуруугаар дарсанд ○ тэмдэг тавина.</div>
  <ol class="drills">${DRILLS.map((d) => `<li><span class="mono">${d.replace(/ {3}/g, ' &nbsp; ')}</span></li>`).join('')}</ol>
  <table class="score">
    <tr><th></th><th>Зөв дарсан үсэг (|)</th><th>Буруу хуруу (○)</th><th>Хос шалгагчийн нэр</th></tr>
    <tr><td>1-р оролдлого</td><td></td><td></td><td></td></tr>
    <tr><td>2-р оролдлого</td><td></td><td></td><td></td></tr>
  </table>

  <div class="task"><span class="tn">2</span> Ахицын хүснэгт. Хичээл бүрийн дараа үр дүнгээ бичиж, <b>зорилттой</b> харьцуулаарай.</div>
  <table class="progress">
    <tr><th>№</th><th>Хичээл</th><th>Огноо</th><th>Зөв үсэг (1 мин)</th><th>Буруу хуруу</th><th>Зорилт</th><th>Хүрсэн үү?</th></tr>
    ${PROGRESS.map(([n, t, goal]) => `<tr class="${n === '18' ? 'now' : ''}"><td>${n}</td><td>${t}</td><td></td><td></td><td></td><td>${goal}+</td><td></td></tr>`).join('')}
  </table>
  <p class="hint">«Зөв үсэг» = 1 минутад цаасан гар дээр зөв хуруугаар дарсан үсгийн тоо. «Буруу хуруу» = буруу хуруугаар дарсан тоо.</p>

  <div class="task"><span class="tn">3</span> Өөрийгөө үнэлээрэй.</div>
  <table class="self">
    <tr><th>Шалгуур</th><th>Чадна</th><th>Суралцаж байна</th><th>Чадахгүй</th></tr>
    ${['Зүүн гарын 4 хурууны товчлуурыг нэрлэсэн', 'G-г долоовороор дарж, буцааж чадсан', '1 минутад дор хаяж 18 үсгийг зөв хуруугаар дарсан']
      .map((t) => `<tr><td>${t}</td><td>${face('good')}</td><td>${face('mid')}</td><td>${face('bad')}</td></tr>`).join('')}
  </table>
  ${footer(5)}
</section>
`;

const extraCSS = `
table.info { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 1mm 0 3mm; }
.info th, .info td { border: 1px solid #bdbdbd; padding: 1.3mm 2mm; text-align: left; vertical-align: top; }
.info th { background: #eef3fb; width: 28mm; font-weight: 700; }
table.kca { width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 3mm; }
.kca th, .kca td { border: 1px solid #bdbdbd; padding: 1.3mm 2mm; text-align: left; vertical-align: top; width: 33.3%; }
.kca th { background: #f6f6f6; }
.plan .st { width: 27mm; }
.plan .st span { display: block; font-weight: 400; color: #555; margin-top: .5mm; }
.plan .mat { width: 30mm; } .plan .ev { width: 24mm; }
.plan td i { color: #1f5fae; }
td.mono, .mono { font-family: "DejaVu Sans Mono", monospace; font-weight: 400; }
.dict td.mono { font-size: 10.5pt; }
.dict th { width: 34mm; }
.note.warn { background: #fdecea; border-color: #f2b8b0; margin-top: 3mm; }
.answers { font-size: 9.2pt; }
.answers ol { padding-left: 5mm; }
.l18-bottom { display: grid; grid-template-columns: 60mm 1fr 82mm; gap: 5mm; margin-top: 2mm; align-items: start; }
.l18-bottom .hands svg { width: 58mm; }
.box.center { text-align: center; }
.box.center h3 { text-align: left; }
svg.strip { width: 100mm; height: auto; font-family: Carlito, "DejaVu Sans", sans-serif; }
.match { display: grid; grid-template-columns: 52mm 1fr 34mm; margin: 1mm 0 0 6mm; }
.mcol { display: flex; flex-direction: column; justify-content: space-around; gap: 2mm; }
.mcol.left > div { display: flex; justify-content: space-between; align-items: center; font-weight: 700; height: 11mm; }
.mcol.right > div { display: flex; align-items: center; gap: 3mm; }
.dot { display: inline-block; width: 3mm; height: 3mm; border-radius: 50%; background: ${INK}; }
.kb { display: inline-flex; width: 11mm; height: 10mm; border: 2px solid ${INK}; border-radius: 1.5mm; align-items: center; justify-content: center; font-weight: 800; font-size: 15pt; }
.qa { display: flex; flex-direction: column; gap: 2.2mm; margin-left: 6mm; }
.words-pick { display: flex; flex-wrap: wrap; gap: 3mm 7mm; margin-left: 6mm; font-family: "DejaVu Sans Mono", monospace; font-size: 15pt; }
.words-pick span { padding: 1mm 2mm; }
.words { margin-left: 6mm; }
.wc { font-family: "DejaVu Sans Mono", monospace; font-weight: 700; }
.hint { font-size: 9.5pt; color: #555; margin: 2mm 0 0 6mm; }
.lines { display: flex; flex-direction: column; gap: 7mm; margin: 6mm 0 0 6mm; }
.blank.full { width: 100%; }
ol.drills { margin: 1mm 0 3mm 6mm; padding-left: 6mm; }
ol.drills li { font-size: 15pt; margin-bottom: 2mm; letter-spacing: .04em; }
table.score, table.progress { width: 100%; border-collapse: collapse; font-size: 10pt; }
.score th, .score td, .progress th, .progress td { border: 1px solid #9e9e9e; padding: 1.2mm 2mm; height: 8.5mm; text-align: center; }
.score th, .progress th { background: #eef3fb; font-size: 9pt; }
.score td:first-child, .progress td:nth-child(2) { text-align: left; }
.progress tr.now td { background: #fff8e1; font-weight: 700; }
.self th { font-size: 9pt; }
`;

render({
  title: TITLE + ' — 4-р анги',
  pages,
  extraCSS,
  htmlPath: path.join(__dirname, 'lesson18.html'),
  pdfPath: path.join(__dirname, '..', 'hicheel-18-zuun-gar-asdfg.pdf'),
}).catch((e) => { console.error(e); process.exit(1); });
