"use strict";
const SAVE_KEY = "imperio-do-milho-v1";
const STAGES = [
  { at: 0, name: "🛒 Carrinho na rua" },
  { at: 500, name: "👥 Equipe crescendo" },
  { at: 50e3, name: "🏭 Industrialização" },
  { at: 5e6, name: "🏪 Rede de franquias" },
  { at: 500e6, name: "🌍 Império global" },
];
const PRODUCTS = [
  { id: "pamonha", name: "Pamonha", emoji: "🫔", v: 1, at: 0 },
  { id: "curau", name: "Curau", emoji: "🥣", v: 1.5, at: 0 },
  { id: "suco", name: "Suco de milho", emoji: "🧃", v: 4, at: 1e3 },
  { id: "pao", name: "Pão de milho", emoji: "🍞", v: 10, at: 10e3 },
  { id: "bolo", name: "Bolo de milho", emoji: "🍰", v: 25, at: 100e3 },
  { id: "pote", name: "Milho no pote", emoji: "🥫", v: 60, at: 1e6 },
  { id: "sorvete", name: "Sorvete de milho", emoji: "🍦", v: 150, at: 50e6 },
  { id: "pipoca", name: "Pipoca gourmet", emoji: "🍿", v: 400, at: 1e9 },
];
const BUILDINGS = [
  { id: "ajud", name: "Ajudante", emoji: "🧑‍🍳", cost: 25, cps: 0.5 },
  { id: "carr", name: "Novo carrinho", emoji: "🛒", cost: 150, cps: 3 },
  { id: "coz", name: "Cozinheira de curau", emoji: "👩‍🍳", cost: 1200, cps: 15 },
  { id: "feira", name: "Barraca na feira", emoji: "🎪", cost: 10e3, cps: 80 },
  { id: "loja", name: "Lojinha", emoji: "🏪", cost: 80e3, cps: 400 },
  { id: "debu", name: "Debulhadora", emoji: "⚙️", cost: 600e3, cps: 2e3 },
  { id: "fab", name: "Fábrica", emoji: "🏭", cost: 5e6, cps: 12e3 },
  { id: "dist", name: "Centro de distribuição", emoji: "🚚", cost: 50e6, cps: 80e3 },
  { id: "fbr", name: "Franquia Brasil", emoji: "🇧🇷", cost: 400e6, cps: 500e3 },
  { id: "far", name: "Franquia Argentina", emoji: "🇦🇷", cost: 4e9, cps: 3e6 },
  { id: "fpt", name: "Franquia Portugal", emoji: "🇵🇹", cost: 40e9, cps: 20e6 },
  { id: "feu", name: "Franquia EUA", emoji: "🇺🇸", cost: 400e9, cps: 150e6 },
  { id: "fjp", name: "Franquia Japão", emoji: "🇯🇵", cost: 5e12, cps: 1.2e9 },
  { id: "fmu", name: "Corn Corp Mundial", emoji: "🌍", cost: 60e12, cps: 10e9 },
];
const UPGRADES = [];
[[100, "Panela maior"], [1e3, "Palha premium"], [20e3, "Receita da vovó"], [500e3, "Embalagem bonita"], [20e6, "Selo orgânico"], [1e9, "Marca famosa"]]
  .forEach(([c, n], i) => UPGRADES.push({ id: "clk" + i, name: n, desc: "Cliques valem 2x", cost: c, kind: "click", req: s => s.total >= c / 2 }));
BUILDINGS.forEach(b => [[10, 10], [25, 100], [50, 1000]].forEach(([n, m], i) =>
  UPGRADES.push({ id: `${b.id}${i}`, name: `${b.name} Nv.${i + 2}`, desc: `${b.name} produz 2x`, cost: b.cost * m, kind: "bld", target: b.id, req: s => (s.owned[b.id] || 0) >= n })));
[[50e3, "Marketing local"], [5e6, "Propaganda na TV"], [500e6, "Patrocínio de time"]]
  .forEach(([c, n], i) => UPGRADES.push({ id: "all" + i, name: n, desc: "Toda produção +25%", cost: c, kind: "all", req: s => s.total >= c / 2 }));
UPGRADES.sort((a, b) => a.cost - b.cost);

const EVENTS = [
  { id: "lagarta", text: "🐛 Praga de lagarta! Produção -50%", good: false, mult: 0.5, dur: 30 },
  { id: "greve", text: "✊ Greve dos entregadores! Produção -60%", good: false, mult: 0.4, dur: 25 },
  { id: "preco", text: "📈 Milho em alta! Custos sobem, produção -40%", good: false, mult: 0.6, dur: 35 },
  { id: "fiscal", text: "🧾 Fiscalização! Multa de 3% do caixa", good: false, fine: 0.03, mult: 1, dur: 1 },
  { id: "festa", text: "🎉 Festa junina! Vendas 3x", good: true, mult: 3, dur: 20 },
  { id: "influ", text: "📱 Influencer provou seu curau! Vendas 2x", good: true, mult: 2, dur: 25 },
];
const ACHS = [
  { id: "a1", name: "Primeira pamonha", ok: s => s.clicks >= 1 },
  { id: "a2", name: "100 cliques", ok: s => s.clicks >= 100 },
  { id: "a3", name: "Contratou alguém", ok: s => Object.values(s.owned).some(v => v > 0) },
  { id: "a4", name: "Primeiro milhão", ok: s => s.total >= 1e6 },
  { id: "a5", name: "Bilionário do milho", ok: s => s.total >= 1e9 },
  { id: "a6", name: "Primeira franquia", ok: s => (s.owned.fbr || 0) > 0 },
  { id: "a7", name: "Exportou pro mundo", ok: s => (s.owned.fjp || 0) > 0 },
  { id: "a8", name: "Nova Safra", ok: s => s.gold > 0 },
];

const fresh = () => ({ money: 0, total: 0, clicks: 0, owned: {}, ups: [], gold: 0, ach: [], last: Date.now(), ev: null, nextEv: 90 });
let S = load();

function load() {
  try { const o = JSON.parse(localStorage.getItem(SAVE_KEY)); if (o) return Object.assign(fresh(), o); } catch (e) {}
  return fresh();
}
const save = () => { S.last = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(S)); };

const SUF = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx"];
function fmt(n) {
  if (n < 1000) return n < 10 && n % 1 ? n.toFixed(1) : Math.floor(n).toString();
  const i = Math.min(Math.floor(Math.log10(n) / 3), SUF.length - 1);
  return (n / Math.pow(1000, i)).toFixed(2) + SUF[i];
}
const money = n => "R$ " + fmt(n);

const stageIdx = () => { let k = 0; STAGES.forEach((s, i) => { if (S.total >= s.at) k = i; }); return k; }
const goldMult = () => 1 + 0.1 * S.gold;
const has = id => S.ups.includes(id);
const costGrowth = () => 1.15 + stageIdx() * 0.01;
const bCost = b => Math.ceil(b.cost * Math.pow(costGrowth(), S.owned[b.id] || 0));
const unlockedProducts = () => PRODUCTS.filter(p => S.total >= p.at);

function allMult() {
  let m = goldMult();
  UPGRADES.forEach(u => { if (u.kind === "all" && has(u.id)) m *= 1.25; });
  m *= 1 + 0.1 * (unlockedProducts().length - 2);
  return m;
}
function eventMult() { return S.ev ? S.ev.mult : 1; }
function clickValue() {
  let v = unlockedProducts().reduce((a, p) => a + p.v, 0);
  UPGRADES.forEach(u => { if (u.kind === "click" && has(u.id)) v *= 2; });
  v *= goldMult() * eventMult();
  return v + cps() * 0.02;
}
function bldCps(b) {
  let c = (S.owned[b.id] || 0) * b.cps;
  UPGRADES.forEach(u => { if (u.kind === "bld" && u.target === b.id && has(u.id)) c *= 2; });
  return c;
}
const baseCps = () => BUILDINGS.reduce((a, b) => a + bldCps(b), 0) * allMult();
const cps = () => baseCps() * eventMult();

function earn(n) { S.money += n; S.total += n; }

function buyBuilding(id) {
  const b = BUILDINGS.find(x => x.id === id), c = bCost(b);
  if (S.money < c) return;
  S.money -= c; S.owned[id] = (S.owned[id] || 0) + 1; build();
}
function buyUpgrade(id) {
  const u = UPGRADES.find(x => x.id === id);
  if (S.money < u.cost || has(id)) return;
  S.money -= u.cost; S.ups.push(id); build();
}
function prestigeGain() { return Math.floor(Math.cbrt(S.total / 1e7)); }
function prestige() {
  const g = prestigeGain();
  if (g < 1 || !confirm(`Nova Safra: reinicia o progresso e dá +${g} 🌾 Espigas Douradas (+${g * 10}% de produção permanente). Continuar?`)) return;
  const gold = S.gold + g, ach = S.ach;
  S = fresh(); S.gold = gold; S.ach = ach; build(); toast(`🌾 Nova safra! +${g} Espigas Douradas`);
}

function toast(t) {
  const d = document.createElement("div"); d.className = "toast"; d.textContent = t;
  document.getElementById("toasts").appendChild(d); setTimeout(() => d.remove(), 3600);
}

function tickEvents(dt) {
  if (S.ev) {
    S.ev.left -= dt;
    if (S.ev.left <= 0) { S.ev = null; }
    return;
  }
  if (stageIdx() < 1) return;
  S.nextEv -= dt;
  if (S.nextEv > 0) return;
  const st = stageIdx();
  S.nextEv = Math.max(40, 120 - st * 15) * (0.7 + Math.random() * 0.6);
  const pool = EVENTS.filter(e => !e.good || Math.random() < 0.35);
  const e = pool[Math.floor(Math.random() * pool.length)];
  if (e.fine) { const f = S.money * e.fine; S.money -= f; toast(`${e.text} (-${money(f)})`); return; }
  S.ev = { ...e, left: e.dur };
}
function resolveEvent() {
  if (!S.ev || S.ev.good) return;
  const c = Math.max(50, baseCps() * 30);
  if (S.money < c) return toast("Sem caixa para resolver!");
  S.money -= c; S.ev = null; toast("Problema resolvido 💪");
}

function checkAch() {
  ACHS.forEach(a => { if (!S.ach.includes(a.id) && a.ok(S)) { S.ach.push(a.id); toast("🏆 " + a.name); buildAch(); } });
}

const $ = id => document.getElementById(id);
function build() {
  $("buildings").innerHTML = BUILDINGS.map(b =>
    `<button class="item" data-b="${b.id}" id="b-${b.id}"><div><b>${b.emoji} ${b.name}</b><small id="bs-${b.id}"></small></div><div style="text-align:right"><div class="n" id="bn-${b.id}"></div><div class="price" id="bp-${b.id}"></div></div></button>`).join("");
  $("products").innerHTML = PRODUCTS.map(p => `<div class="prod" id="p-${p.id}">${p.emoji}<br>${p.name}<br><small id="pv-${p.id}"></small></div>`).join("");
  buildUpgrades(); buildAch();
}
let upKey = "";
function availUps() { return UPGRADES.filter(u => !has(u.id) && u.req(S)); }
function buildUpgrades() {
  const l = availUps(); upKey = l.map(u => u.id).join();
  $("upcount").textContent = l.length ? `(${l.length})` : "";
  $("upgrades").innerHTML = l.length ? l.map(u =>
    `<button class="item" data-u="${u.id}" id="u-${u.id}"><div><b>${u.name}</b><small>${u.desc}</small></div><div class="price">${money(u.cost)}</div></button>`).join("")
    : '<p class="muted">Nenhuma melhoria disponível ainda. Continue vendendo!</p>';
}
function buildAch() {
  $("ach").innerHTML = ACHS.map(a => `<div class="ach ${S.ach.includes(a.id) ? "done" : ""}">🏆 ${a.name}</div>`).join("");
}

function render() {
  $("money").textContent = money(S.money);
  $("cps").textContent = `${money(cps())}/s`;
  $("clickinfo").textContent = `Cada venda: ${money(clickValue())}`;
  $("stage").textContent = STAGES[stageIdx()].name;
  BUILDINGS.forEach(b => {
    const el = $("b-" + b.id), c = bCost(b), vis = S.total >= b.cost * 0.5 || (S.owned[b.id] || 0) > 0;
    el.classList.toggle("hidden", !vis);
    el.classList.toggle("can", S.money >= c);
    $("bs-" + b.id).textContent = `${money(bldCps(b) * allMult())}/s no total`;
    $("bn-" + b.id).textContent = S.owned[b.id] || 0;
    $("bp-" + b.id).textContent = money(c);
  });
  const un = unlockedProducts();
  PRODUCTS.forEach(p => {
    const ok = un.includes(p), el = $("p-" + p.id);
    el.classList.toggle("locked", !ok);
    $("pv-" + p.id).textContent = ok ? `+${money(p.v)}` : `🔒 ${money(p.at)}`;
  });
  const key = availUps().map(u => u.id).join();
  if (key !== upKey) buildUpgrades();
  UPGRADES.forEach(u => { const el = $("u-" + u.id); if (el) el.classList.toggle("can", S.money >= u.cost); });
  const g = prestigeGain();
  $("prestige").disabled = g < 1;
  $("prestige").textContent = g >= 1 ? `🌾 Nova Safra (+${g})` : "🌾 Nova Safra";
  $("goldinfo").textContent = `Espigas Douradas: ${S.gold} (bônus +${S.gold * 10}%) · Nova Safra libera com R$ 10M na safra`;
  const ev = $("event");
  if (S.ev) {
    ev.classList.remove("hidden"); ev.classList.toggle("good", S.ev.good);
    const c = Math.max(50, baseCps() * 30);
    ev.innerHTML = `${S.ev.text}<br><small>${Math.ceil(S.ev.left)}s</small>` + (S.ev.good ? "" : `<br><button id="resolve">Resolver (${money(c)})</button>`);
  } else ev.classList.add("hidden");
}

$("corn").addEventListener("click", e => {
  const v = clickValue(); earn(v); S.clicks++;
  const p = document.createElement("div"); p.className = "pop"; p.textContent = "+" + fmt(v);
  p.style.left = e.clientX - 10 + "px"; p.style.top = e.clientY - 20 + "px";
  document.body.appendChild(p); setTimeout(() => p.remove(), 800);
});
$("buildings").addEventListener("click", e => { const b = e.target.closest("[data-b]"); if (b) buyBuilding(b.dataset.b); });
$("upgrades").addEventListener("click", e => { const b = e.target.closest("[data-u]"); if (b) buyUpgrade(b.dataset.u); });
$("event").addEventListener("click", e => { if (e.target.id === "resolve") resolveEvent(); });
$("prestige").addEventListener("click", prestige);
$("reset").addEventListener("click", () => { if (confirm("Apagar TODO o progresso?")) { localStorage.removeItem(SAVE_KEY); S = fresh(); build(); } });
document.querySelectorAll(".tabs button").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(x => x.classList.toggle("active", x === t));
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("hidden", x.id !== t.dataset.tab));
}));

build();
const away = Math.min((Date.now() - S.last) / 1000, 8 * 3600);
if (away > 30 && baseCps() > 0) { const g = baseCps() * away * 0.5; earn(g); toast(`😴 Enquanto você estava fora: +${money(g)}`); }

let prev = performance.now();
setInterval(() => {
  const now = performance.now(), dt = Math.min((now - prev) / 1000, 1); prev = now;
  earn(cps() * dt); tickEvents(dt); checkAch(); render();
}, 100);
setInterval(save, 10000);
window.addEventListener("beforeunload", save);
