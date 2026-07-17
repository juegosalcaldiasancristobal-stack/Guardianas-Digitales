/* ============================================================
   GUARDIANAS DIGITALES — Motor del juego
   --------------------------------------------------------------
   Scripts clásicos a propósito (no type="module"): debe poder
   abrirse con doble clic en index.html, sin servidor.
   ============================================================ */

const BG_STYLES = {
  "scene-room": "linear-gradient(135deg,#0e2a35,#081720)",
  "scene-tension": "linear-gradient(135deg,#3a1f1f,#1c1010)",
  "scene-night": "linear-gradient(135deg,#0a1a2e,#060d18)",
  "scene-street-day": "linear-gradient(135deg,#123b3a,#0a1f1e)",
};

const RESOLUTION_TIER_DOWN = { exito: "parcial", parcial: "pendiente", pendiente: "pendiente" };
const RESOLUTION_EFFECTS = {
  exito: { proteccion: 15, comunidad: 10, ciudadania: 15 },
  parcial: { proteccion: 8, comunidad: 5, ciudadania: 8 },
  pendiente: { proteccion: 2, comunidad: 0, ciudadania: 3 },
};
const ACHIEVEMENT_STAT_BONUS = { amiga_protegida: { comunidad: 10 } };

const state = {
  guardiana: null,
  currentCaseId: null,
  scenario: null,
  nodeId: null,
  stats: { proteccion: 30, comunidad: 30, ciudadania: 30 },
  achievements: new Set(),
  casesSolved: new Set(),
  anyCaseSolved: false,
  lastMood: null,
  chatTimers: [],
  currentCaseEvidencePerfect: false,
  lastResolution: null,
};

const $ = (sel) => document.querySelector(sel);
const $all = (sel) => document.querySelectorAll(sel);

function clamp(n) { return Math.max(0, Math.min(100, n)); }

function showScreen(id) {
  $all("[data-screen]").forEach((s) => s.classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden");
  $(`#${id}`).classList.add("fade-in");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   NARRACIÓN POR VOZ (accesibilidad para quienes no pueden leer)
   ============================================================ */
const NARRATION_KEY = "guardianasDigitalesNarracion";
state.narrationEnabled = localStorage.getItem(NARRATION_KEY) !== "off";
state.lastSpokenText = "";
let spanishVoice = null;

function pickSpanishVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => /^es[-_]CO/i.test(v.lang))
    || voices.find((v) => /^es/i.test(v.lang))
    || null;
}
if ("speechSynthesis" in window) {
  spanishVoice = pickSpanishVoice();
  speechSynthesis.onvoiceschanged = () => { spanishVoice = pickSpanishVoice(); };
}

function speak(text, opts) {
  if (!text) return;
  state.lastSpokenText = text;
  const force = opts && opts.force;
  if ((!state.narrationEnabled && !force) || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (spanishVoice) u.voice = spanishVoice;
  u.rate = 0.98;
  speechSynthesis.speak(u);
}
function queueSpeak(text) {
  if (!text || !state.narrationEnabled || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  if (spanishVoice) u.voice = spanishVoice;
  u.rate = 0.98;
  speechSynthesis.speak(u);
}
function stopSpeaking() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }

function setNarrationEnabled(on) {
  state.narrationEnabled = on;
  localStorage.setItem(NARRATION_KEY, on ? "on" : "off");
  const btn = $("#btnNarrationToggle");
  btn.classList.toggle("narration-on", on);
  btn.classList.toggle("narration-off", !on);
  btn.setAttribute("aria-pressed", String(on));
  $("#narrationIcon").textContent = on ? "🔊" : "🔇";
  if (!on) stopSpeaking();
}
setNarrationEnabled(state.narrationEnabled);
$("#btnNarrationToggle").addEventListener("click", () => setNarrationEnabled(!state.narrationEnabled));
$("#btnReplayNarration").addEventListener("click", () => speak(state.lastSpokenText, { force: true }));

/* ============================================================
   SONIDO (efectos generados, sin archivos externos)
   ============================================================ */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function playTone(freq, duration, type, gainPeak, delay) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || "sine";
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + (delay || 0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak || 0.1, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}
function playSound(name) {
  switch (name) {
    case "click": playTone(520, 0.06, "sine", 0.05); break;
    case "correct": playTone(660, 0.12, "sine", 0.09); playTone(880, 0.14, "sine", 0.08, 0.08); break;
    case "incorrect": playTone(180, 0.22, "sawtooth", 0.06); break;
    case "achievement": playTone(660, 0.1, "sine", 0.08); playTone(880, 0.12, "sine", 0.08, 0.09); playTone(1100, 0.18, "sine", 0.09, 0.18); break;
    case "success": playTone(523, 0.12, "sine", 0.08); playTone(659, 0.12, "sine", 0.08, 0.1); playTone(784, 0.2, "sine", 0.09, 0.2); break;
  }
}
function burstConfetti() {
  const colors = ["#22d3ee", "#34d399", "#fbbf24", "#f472b6", "#a78bfa"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = colors[i % colors.length];
    el.style.animationDuration = (1.6 + Math.random() * 1.2) + "s";
    el.style.animationDelay = (Math.random() * 0.3) + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }
}

/* ============================================================
   ILUSTRACIÓN DE ESCENA (SVG temático según el tipo de amenaza)
   ============================================================ */
const SCENE_MOOD_COLOR = {
  "scene-room": "#22d3ee",
  "scene-tension": "#fb7185",
  "scene-night": "#818cf8",
  "scene-street-day": "#34d399",
};
function renderSceneIllustration(bgKey) {
  const theme = state.currentTheme || "default";
  const color = THEME_COLORS[theme] || SCENE_MOOD_COLOR[bgKey] || SCENE_MOOD_COLOR["scene-room"];
  $("#sceneIllustration").innerHTML = sceneIllustrationSVG(theme, color);
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent.trim();
}

/* ---------------- REGISTRO DE PARTICIPANTE ---------------- */
const AGE_RANGE_LABELS = {
  menor_15: "Menos de 15",
  "15_17": "15 a 17",
  "18_20": "18 a 20",
  "21_25": "21 a 25",
  mayor_25: "Más de 25",
};
const REGISTROS_KEY = "guardianasDigitalesRegistros";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration() {
  const name = $("#regFullName").value.trim();
  const email = $("#regEmail").value.trim();
  const ageRange = $("#regAgeRange").value;
  const consent = $("#consentCheck").checked;

  let error = "";
  if (!name) error = "Escribe tu nombre completo.";
  else if (!ageRange) error = "Selecciona tu rango de edad.";
  else if (!EMAIL_RE.test(email)) error = "Escribe un correo electrónico válido.";

  const errEl = $("#regError");
  if (error && (email || name || ageRange)) { errEl.textContent = error; errEl.classList.remove("hidden"); }
  else errEl.classList.add("hidden");

  $("#startBtn").disabled = !(name && ageRange && EMAIL_RE.test(email) && consent);
}
["input", "change"].forEach((evt) => {
  $("#regFullName").addEventListener(evt, validateRegistration);
  $("#regEmail").addEventListener(evt, validateRegistration);
  $("#regAgeRange").addEventListener(evt, validateRegistration);
});
$("#consentCheck").addEventListener("change", validateRegistration);

function saveRegistration() {
  const record = {
    nombre: $("#regFullName").value.trim(),
    correo: $("#regEmail").value.trim(),
    rangoEdad: AGE_RANGE_LABELS[$("#regAgeRange").value] || $("#regAgeRange").value,
    fecha: new Date().toISOString(),
  };
  let registros = [];
  try { registros = JSON.parse(localStorage.getItem(REGISTROS_KEY)) || []; } catch (e) { registros = []; }
  registros.push(record);
  localStorage.setItem(REGISTROS_KEY, JSON.stringify(registros));
}

function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportRegistrosCSV() {
  let registros = [];
  try { registros = JSON.parse(localStorage.getItem(REGISTROS_KEY)) || []; } catch (e) { registros = []; }
  if (registros.length === 0) {
    alert("Todavía no hay registros de participantes guardados en este navegador.");
    return;
  }
  const header = ["Nombre completo", "Correo electrónico", "Rango de edad", "Fecha y hora"];
  const rows = registros.map((r) => [r.nombre, r.correo, r.rangoEdad, r.fecha].map(csvEscape).join(","));
  const csv = "﻿" + [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "guardianas-digitales-registros.csv";
  a.click();
  URL.revokeObjectURL(url);
}
$("#menuExportRegistros").addEventListener("click", () => { closeModals(); exportRegistrosCSV(); });
$("#btnExportRegistrosCases").addEventListener("click", () => exportRegistrosCSV());

/* ---------------- INTRO ---------------- */
$("#startBtn").addEventListener("click", () => {
  saveRegistration();
  renderGuardianaSelect();
  showScreen("screen-select");
});
$("#skipToResources").addEventListener("click", () => openResourcesModal());
$("#quickExitBtn").addEventListener("click", quickExit);
$("#menuExit").addEventListener("click", quickExit);
function quickExit() { window.location.replace("https://www.google.com/search?q=clima+bogota"); }

/* ---------------- SELECCIÓN DE GUARDIANA ---------------- */
function renderGuardianaSelect() {
  const grid = $("#guardianaGrid");
  grid.innerHTML = "";
  GUARDIANAS.forEach((g) => {
    const el = document.createElement("div");
    el.className = "char-card fade-in";
    el.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${g.color} p-1 shadow-md">${avatarSVG(g, "tranquila")}</div>
        <div class="min-w-0">
          <p class="font-bold leading-tight">${g.name} <span class="text-slate-400 font-normal text-sm">· ${g.age} años</span></p>
          <p class="text-xs text-slate-400">${g.tag}</p>
          <span class="inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10">${g.specialty}</span>
        </div>
      </div>
      <p class="text-sm text-slate-300 mt-3 leading-relaxed">${g.blurb}</p>
      <button class="btn-primary w-full mt-4 !text-sm">Ser esta Guardiana →</button>
    `;
    el.querySelector("button").addEventListener("click", () => startGuardiana(g.id));
    grid.appendChild(el);
  });
}

function startGuardiana(id) {
  state.guardiana = GUARDIANAS.find((g) => g.id === id);
  $("#caseHudName").textContent = state.guardiana.name;
  $("#caseHudSpecialty").textContent = "Especialidad: " + state.guardiana.specialty;
  $("#caseHudAvatar").innerHTML = avatarSVG(state.guardiana, "tranquila");
  updateCaseHud();
  renderCaseBoard();
  showScreen("screen-cases");
}

function updateCaseHud() {
  $("#barProteccion").style.width = clamp(state.stats.proteccion) + "%";
  $("#barComunidad").style.width = clamp(state.stats.comunidad) + "%";
  $("#barCiudadania").style.width = clamp(state.stats.ciudadania) + "%";
}

/* ---------------- TABLERO DE CASOS ---------------- */
function renderCaseBoard() {
  const grid = $("#caseGrid");
  grid.innerHTML = "";
  const cases = CASES_BY_GUARDIANA[state.guardiana.id] || [];
  cases.forEach((c) => {
    const platform = PLATFORMS[c.platform] || { name: c.platform, icon: "🌐" };
    const solved = state.casesSolved.has(c.id);
    const locked = c.requires && !state.casesSolved.has(c.requires);
    const requiredTitle = locked ? (cases.find((x) => x.id === c.requires) || {}).title : "";
    const el = document.createElement("div");
    el.className = "case-card" + (solved ? " solved" : "") + (locked ? " case-locked" : "");
    el.innerHTML = `
      <div class="case-card-illu" aria-hidden="true">${sceneIllustrationSVG(c.theme || "default", THEME_COLORS[c.theme || "default"])}</div>
      <span class="platform-badge">${platform.icon} ${platform.name}</span>
      <p class="font-bold mt-2">${locked ? "🔒 " : ""}${c.title} ${solved ? "✅" : ""}</p>
      <p class="text-sm text-slate-300 mt-1.5 leading-relaxed">${locked ? `Resuelve "${requiredTitle}" primero para desbloquear este caso.` : c.brief}</p>
      <button class="btn-primary w-full mt-4 !text-sm" ${locked ? "disabled" : ""}>${locked ? "🔒 Bloqueado" : solved ? "Repasar caso →" : "Tomar este caso →"}</button>
    `;
    if (!locked) el.querySelector("button").addEventListener("click", () => startCase(c));
    grid.appendChild(el);
  });
}
$("#btnChangeGuardiana").addEventListener("click", () => { renderGuardianaSelect(); showScreen("screen-select"); });
$("#menuChangeGuardiana").addEventListener("click", () => { closeModals(); renderGuardianaSelect(); showScreen("screen-select"); });
$("#btnBackToCases").addEventListener("click", () => { renderCaseBoard(); showScreen("screen-cases"); });
$("#menuBackToCases").addEventListener("click", () => { closeModals(); renderCaseBoard(); showScreen("screen-cases"); });

function startCase(c) {
  state.currentCaseId = c.id;
  state.scenario = SCENARIOS[c.scenarioId];
  state.nodeId = state.scenario.start;
  state.currentCaseEvidencePerfect = false;
  state.lastResolution = null;
  state.lastMood = null;
  state.stepCount = 0;
  state.currentTheme = c.theme || "default";

  $("#hudName").textContent = state.guardiana.name + " · " + c.title;
  $("#hudScenario").textContent = (PLATFORMS[c.platform] || {}).name || "";

  showScreen("screen-game");
  renderNode();
}

/* ---------------- HUD ---------------- */
function setAvatarMood(mood) {
  if (!state.guardiana) return;
  const changed = state.lastMood && state.lastMood !== mood;
  state.lastMood = mood;
  $("#hudAvatar").innerHTML = avatarSVG(state.guardiana, mood);
  $("#scenePortrait").innerHTML = avatarSVG(state.guardiana, mood);
  if (changed) {
    ["hudAvatar", "scenePortrait"].forEach((id) => {
      const el = $(`#${id}`);
      el.classList.remove("mood-change");
      void el.offsetWidth;
      el.classList.add("mood-change");
    });
  }
}
let prevGameStats = null;
function updateHud(mood) {
  const keys = { proteccion: "barProteccionGame", comunidad: "barComunidadGame", ciudadania: "barCiudadaniaGame" };
  Object.entries(keys).forEach(([key, id]) => {
    const val = clamp(state.stats[key]);
    const el = $(`#${id}`);
    const increased = prevGameStats && val > prevGameStats[key];
    el.style.width = val + "%";
    if (increased) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  });
  prevGameStats = { proteccion: clamp(state.stats.proteccion), comunidad: clamp(state.stats.comunidad), ciudadania: clamp(state.stats.ciudadania) };
  updateCaseHud();
  if (mood) setAvatarMood(mood);
}

/* ---------------- RENDER NODOS ---------------- */
function incrementStepCounter() {
  state.stepCount = (state.stepCount || 0) + 1;
  $("#stepCounterBadge").textContent = `Paso ${state.stepCount}`;
}

function renderNode() {
  const node = state.scenario.nodes[state.nodeId];
  const mood = node.mood || "tranquila";
  updateHud(mood);
  clearChatTimers();
  stopSpeaking();

  ["choicesWrap", "chatNode", "minigameNode", "inspectNode", "allocateNode", "feedbackWrap"].forEach((id) => $(`#${id}`).classList.add("hidden"));
  $("#choicesWrap").innerHTML = "";

  if (node.bg) $("#sceneBg").style.background = BG_STYLES[node.bg] || BG_STYLES["scene-room"];
  renderSceneIllustration(node.bg);

  if (node.type === "end") { computeEnding(); return; }

  $("#speakerName").textContent = node.speaker || "";
  $("#sceneText").textContent = node.text || "";
  incrementStepCounter();

  if (node.type === "story") { renderStoryNode(node); speak(node.text); }
  else if (node.type === "choice") { renderChoiceNode(node); speak(node.text); }
  else if (node.type === "chat") { renderChatNode(node); }
  else if (node.type === "minigame") { renderMinigameNode(node); speak([node.text, node.instructions].filter(Boolean).join(". ")); }
  else if (node.type === "inspect") { renderInspectNode(node); speak([node.text, node.instructions].filter(Boolean).join(". ")); }
  else if (node.type === "allocate") { renderAllocateNode(node); speak([node.text, node.instructions].filter(Boolean).join(". ")); }
}

function goTo(nextId) { state.nodeId = nextId; renderNode(); }

function renderStoryNode(node) {
  $("#choicesWrap").classList.remove("hidden");
  const btn = document.createElement("button");
  btn.className = "choice-btn text-center font-semibold";
  btn.textContent = "Continuar →";
  btn.addEventListener("click", () => { playSound("click"); goTo(node.next); });
  $("#choicesWrap").appendChild(btn);
}

function renderChoiceNode(node) {
  $("#choicesWrap").classList.remove("hidden");
  node.choices.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<span class="tag">${ch.tag}</span>${ch.text}`;
    btn.addEventListener("click", () => { playSound("click"); applyChoice(ch); });
    $("#choicesWrap").appendChild(btn);
  });
}

/* ---------------- ELECCIONES ---------------- */
function applyChoice(choice) {
  let resolution = choice.resolution || null;
  let feedback = choice.feedback || "";

  if (resolution && choice.requiresGoodEvidence && !state.currentCaseEvidencePerfect) {
    resolution = RESOLUTION_TIER_DOWN[resolution] || resolution;
    feedback += "\n\n📁 Nota: como la evidencia reunida no era completa, el resultado quedó un paso por debajo de lo ideal.";
  }
  if (resolution) {
    state.lastResolution = resolution;
    const eff = RESOLUTION_EFFECTS[resolution];
    state.stats.proteccion = clamp(state.stats.proteccion + eff.proteccion);
    state.stats.comunidad = clamp(state.stats.comunidad + eff.comunidad);
    state.stats.ciudadania = clamp(state.stats.ciudadania + eff.ciudadania);
    if (resolution === "exito") unlockAchievement("primera_denuncia");
  }
  if (choice.achievement) {
    unlockAchievement(choice.achievement);
    const bonus = ACHIEVEMENT_STAT_BONUS[choice.achievement];
    if (bonus) {
      Object.keys(bonus).forEach((k) => { state.stats[k] = clamp(state.stats[k] + bonus[k]); });
    }
  }
  updateHud();
  showFeedback(feedback, choice.next);
}

function showFeedback(text, next) {
  $("#feedbackText").textContent = text;
  $("#feedbackWrap").classList.remove("hidden");
  $("#choicesWrap").classList.add("hidden");
  speak(text);
  const btn = $("#feedbackContinueBtn");
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", () => { playSound("click"); goTo(next); });
}

/* ---------------- CHAT ---------------- */
function clearChatTimers() { state.chatTimers.forEach((t) => clearTimeout(t)); state.chatTimers = []; }

function renderChatNode(node) {
  $("#chatNode").classList.remove("hidden");
  const currentCase = (CASES_BY_GUARDIANA[state.guardiana.id] || []).find((c) => c.id === state.currentCaseId);
  const platform = currentCase ? PLATFORMS[currentCase.platform] : null;
  $("#chatHeader").innerHTML = `<span class="dots"><span></span><span></span><span></span></span>${platform ? platform.icon + " " + platform.name : "💬 Chat"}`;
  const bubbles = $("#chatBubbles");
  bubbles.innerHTML = "";
  $("#chatContinueBtn").classList.add("hidden");
  node.messages.forEach((msg, i) => {
    const typingAt = i * 900;
    const msgAt = i * 900 + 500;
    const t0 = setTimeout(() => {
      const typing = document.createElement("div");
      typing.className = `chat-bubble ${msg.from === "me" ? "me" : "them"} typing-indicator`;
      typing.innerHTML = `<span></span><span></span><span></span>`;
      bubbles.appendChild(typing);
      bubbles.scrollTop = bubbles.scrollHeight;
    }, typingAt);
    state.chatTimers.push(t0);

    const t = setTimeout(() => {
      const typingEl = bubbles.querySelector(".typing-indicator");
      if (typingEl) typingEl.remove();
      const div = document.createElement("div");
      div.className = `chat-bubble ${msg.from === "me" ? "me" : "them"}`;
      div.textContent = msg.text;
      bubbles.appendChild(div);
      bubbles.scrollTop = bubbles.scrollHeight;
      playSound("click");
      queueSpeak(msg.text);
      if (i === node.messages.length - 1) {
        const contBtn = $("#chatContinueBtn");
        contBtn.classList.remove("hidden");
        const clone = contBtn.cloneNode(true);
        contBtn.parentNode.replaceChild(clone, contBtn);
        clone.addEventListener("click", () => { playSound("click"); goTo(node.next); });
      }
    }, msgAt);
    state.chatTimers.push(t);
  });
}

/* ---------------- MINIJUEGO: INVESTIGAR / EVIDENCIA (comparten mecánica) ---------------- */
function renderMinigameNode(node) {
  $("#minigameNode").classList.remove("hidden");
  $("#minigameInstructions").textContent = node.instructions;
  const wrap = $("#minigameItems");
  wrap.innerHTML = "";
  const tipEl = $("#minigameTip");
  tipEl.classList.add("hidden");
  const selected = new Set();
  let checked = false;
  const totalFlags = node.items.filter((i) => i.isFlag).length;

  node.items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "flag-chip";
    btn.innerHTML = `<span>${node.mode === "evidencia" ? "📁" : "🚩"}</span><span>${item.text}</span>`;
    btn.addEventListener("click", () => {
      if (checked) return;
      playSound("click");
      if (selected.has(item.id)) { selected.delete(item.id); btn.classList.remove("selected"); }
      else { selected.add(item.id); btn.classList.add("selected"); }
    });
    btn.dataset.id = item.id;
    wrap.appendChild(btn);
  });

  const checkBtn = $("#minigameCheckBtn");
  const contBtn = $("#minigameContinueBtn");
  checkBtn.classList.remove("hidden");
  contBtn.classList.add("hidden");

  const checkClone = checkBtn.cloneNode(true);
  checkBtn.parentNode.replaceChild(checkClone, checkBtn);
  checkClone.addEventListener("click", () => {
    checked = true;
    let correctCount = 0, incorrectCount = 0;
    const missed = [], falsePositives = [];
    node.items.forEach((item) => {
      const chip = wrap.querySelector(`[data-id="${item.id}"]`);
      const isSelected = selected.has(item.id);
      chip.classList.remove("selected");
      if (item.isFlag && isSelected) { chip.classList.add("correct", "pop-correct"); correctCount++; }
      else if (item.isFlag && !isSelected) { chip.classList.add("incorrect"); missed.push(item.text); }
      else if (!item.isFlag && isSelected) { chip.classList.add("incorrect", "shake-error"); incorrectCount++; falsePositives.push(item.text); }
      const ex = document.createElement("span");
      ex.className = "explain";
      ex.textContent = item.explain;
      chip.appendChild(ex);
    });

    const isPerfect = missed.length === 0 && falsePositives.length === 0;
    playSound(isPerfect ? "correct" : "incorrect");
    const spoken = renderCheckTip(tipEl, {
      isPerfect, missed, falsePositives, tip: node.tip,
      goodMessage: "Identificaste exactamente lo que hacía falta, sin excederte.",
    });
    speak(spoken);

    if (node.mode === "evidencia") {
      state.currentCaseEvidencePerfect = (correctCount === totalFlags && incorrectCount === 0);
      if (state.currentCaseEvidencePerfect) unlockAchievement("evidencia_experta");
    } else if (correctCount > 0 && node.achievementOnPerfect && correctCount === totalFlags && incorrectCount === 0) {
      unlockAchievement(node.achievementOnPerfect);
    }
    if (correctCount > 0) {
      state.stats.ciudadania = clamp(state.stats.ciudadania + correctCount * 3);
      updateHud();
    }

    checkClone.classList.add("hidden");
    contBtn.classList.remove("hidden");
    const contClone = contBtn.cloneNode(true);
    contBtn.parentNode.replaceChild(contClone, contBtn);
    contClone.addEventListener("click", () => { playSound("click"); goTo(node.next); });
  });
}

/* ---------------- TIP INMEDIATO TRAS COMPROBAR ---------------- */
function renderCheckTip(tipEl, { isPerfect, missed, falsePositives, tip, goodMessage }) {
  let spoken = "";
  if (isPerfect) {
    tipEl.className = "tip-callout tip-good";
    tipEl.innerHTML = `<strong>✅ ¡Bien hecho!</strong>${goodMessage || "Identificaste correctamente las señales clave de este caso."}`;
    spoken = `Bien hecho. ${goodMessage || "Identificaste correctamente las señales clave de este caso."}`;
  } else {
    tipEl.className = "tip-callout tip-warn";
    let html = `<strong>📌 Esto es lo que se te pasó</strong>`;
    spoken = "Esto es lo que se te pasó. ";
    if (missed.length) {
      html += `<p>No marcaste: <strong>${missed.join(" · ")}</strong></p>`;
      spoken += `No marcaste: ${missed.join(", ")}. `;
    }
    if (falsePositives.length) {
      html += `<p>Marcaste de más (no era relevante): <strong>${falsePositives.join(" · ")}</strong></p>`;
      spoken += `Marcaste de más, sin que fuera relevante: ${falsePositives.join(", ")}. `;
    }
    if (tip) {
      html += `<div class="tip-hint">💡 <strong>Tip:</strong> ${tip}</div>`;
      spoken += `Tip: ${tip}`;
    }
    tipEl.innerHTML = html;
  }
  tipEl.classList.remove("hidden");
  return spoken;
}

/* ---------------- PUZZLE: INSPECCIONAR INTERFAZ SIMULADA ---------------- */
function renderInspectNode(node) {
  $("#inspectNode").classList.remove("hidden");
  $("#inspectInstructions").textContent = node.instructions;
  const frame = $("#inspectFrame");
  frame.innerHTML = `<p class="mock-frame-label"><span class="dots"><span></span><span></span><span></span></span>${node.frameIcon || "📱"} ${node.frameLabel || "Interfaz simulada"}</p>`;
  const tipEl = $("#inspectTip");
  tipEl.classList.add("hidden");
  const selected = new Set();
  let checked = false;
  const totalFlags = node.hotspots.filter((h) => h.isFlag).length;

  node.hotspots.forEach((h) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `mock-hotspot kind-${h.kind}`;
    btn.dataset.id = h.id;
    btn.innerHTML = h.html;
    btn.addEventListener("click", () => {
      if (checked) return;
      playSound("click");
      if (selected.has(h.id)) { selected.delete(h.id); btn.classList.remove("selected"); }
      else { selected.add(h.id); btn.classList.add("selected"); }
    });
    frame.appendChild(btn);
  });

  const checkBtn = $("#inspectCheckBtn");
  const contBtn = $("#inspectContinueBtn");
  checkBtn.classList.remove("hidden");
  contBtn.classList.add("hidden");
  const checkClone = checkBtn.cloneNode(true);
  checkBtn.parentNode.replaceChild(checkClone, checkBtn);
  checkClone.addEventListener("click", () => {
    checked = true;
    let correctCount = 0, incorrectCount = 0;
    const missed = [], falsePositives = [];
    node.hotspots.forEach((h) => {
      const btn = frame.querySelector(`[data-id="${h.id}"]`);
      const isSelected = selected.has(h.id);
      const label = stripHtml(h.html);
      btn.classList.remove("selected");
      if (h.isFlag && isSelected) { btn.classList.add("correct", "pop-correct"); correctCount++; }
      else if (h.isFlag && !isSelected) { btn.classList.add("incorrect"); missed.push(label); }
      else if (!h.isFlag && isSelected) { btn.classList.add("incorrect", "shake-error"); incorrectCount++; falsePositives.push(label); }
      const ex = document.createElement("span");
      ex.className = "explain";
      ex.textContent = h.explain;
      btn.appendChild(ex);
    });

    const isPerfect = missed.length === 0 && falsePositives.length === 0;
    playSound(isPerfect ? "correct" : "incorrect");
    const spoken = renderCheckTip(tipEl, {
      isPerfect, missed, falsePositives, tip: node.tip,
      goodMessage: "Detectaste exactamente las señales que importaban en esta escena.",
    });
    speak(spoken);

    if (correctCount > 0 && node.achievementOnPerfect && correctCount === totalFlags && incorrectCount === 0) {
      unlockAchievement(node.achievementOnPerfect);
    }
    if (correctCount > 0) { state.stats.ciudadania = clamp(state.stats.ciudadania + correctCount * 3); updateHud(); }

    checkClone.classList.add("hidden");
    contBtn.classList.remove("hidden");
    const contClone = contBtn.cloneNode(true);
    contBtn.parentNode.replaceChild(contClone, contBtn);
    contClone.addEventListener("click", () => { playSound("click"); goTo(node.next); });
  });
}

/* ---------------- ESTRATEGIA: ASIGNAR ACCIONES LIMITADAS ---------------- */
function renderAllocateNode(node) {
  $("#allocateNode").classList.remove("hidden");
  $("#allocateInstructions").textContent = node.instructions;
  const grid = $("#allocateGrid");
  grid.innerHTML = "";
  const tipEl = $("#allocateTip");
  tipEl.classList.add("hidden");
  const selected = new Set();
  let checked = false;

  const updateCounter = () => {
    $("#allocateCounter").textContent = `🎯 Elegiste ${selected.size} / ${node.slots} acciones`;
    $("#allocateConfirmBtn").disabled = selected.size !== node.slots;
  };

  node.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "allocate-card";
    btn.dataset.id = opt.id;
    btn.innerHTML = `<span class="icon">${opt.icon}</span><span class="name">${opt.label}</span>`;
    btn.addEventListener("click", () => {
      if (checked) return;
      playSound("click");
      if (selected.has(opt.id)) { selected.delete(opt.id); btn.classList.remove("selected"); }
      else if (selected.size < node.slots) { selected.add(opt.id); btn.classList.add("selected"); }
      updateCounter();
    });
    grid.appendChild(btn);
  });
  updateCounter();

  const confirmBtn = $("#allocateConfirmBtn");
  const contBtn = $("#allocateContinueBtn");
  confirmBtn.classList.remove("hidden");
  contBtn.classList.add("hidden");
  const confirmClone = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(confirmClone, confirmBtn);
  confirmClone.addEventListener("click", () => {
    checked = true;
    let qualitySum = 0;
    const chosenTools = [];
    const weakPicks = [];
    node.options.forEach((opt) => {
      const btn = grid.querySelector(`[data-id="${opt.id}"]`);
      const isSelected = selected.has(opt.id);
      btn.classList.remove("selected");
      if (isSelected) {
        qualitySum += opt.quality;
        chosenTools.push(opt.tool);
        if (opt.quality >= 1) { btn.classList.add("correct", "pop-correct"); }
        else if (opt.quality <= 0) { btn.classList.add("incorrect", "shake-error"); weakPicks.push(opt); }
        else { btn.classList.add("suboptimal"); weakPicks.push(opt); }
        const ex = document.createElement("span");
        ex.className = "explain";
        ex.textContent = opt.explain;
        btn.appendChild(ex);
      } else {
        btn.disabled = true;
      }
    });

    const avgQuality = qualitySum / node.slots;
    let resolution = avgQuality >= 1 ? "exito" : avgQuality >= 0.5 ? "parcial" : "pendiente";
    if (node.requiresGoodEvidence && !state.currentCaseEvidencePerfect) {
      resolution = RESOLUTION_TIER_DOWN[resolution] || resolution;
    }
    state.lastResolution = resolution;
    const eff = RESOLUTION_EFFECTS[resolution];
    state.stats.proteccion = clamp(state.stats.proteccion + eff.proteccion);
    state.stats.comunidad = clamp(state.stats.comunidad + eff.comunidad);
    state.stats.ciudadania = clamp(state.stats.ciudadania + eff.ciudadania);
    if (resolution === "exito" && (chosenTools.includes("denunciar") || chosenTools.includes("reportar"))) {
      unlockAchievement("primera_denuncia");
    }
    updateHud();

    playSound(weakPicks.length === 0 ? "correct" : "incorrect");
    let spoken;
    if (weakPicks.length === 0) {
      tipEl.className = "tip-callout tip-good";
      tipEl.innerHTML = `<strong>✅ Excelente plan.</strong> Elegiste las acciones más efectivas para este caso.`;
      spoken = "Excelente plan. Elegiste las acciones más efectivas para este caso.";
    } else {
      tipEl.className = "tip-callout tip-warn";
      let html = `<strong>📌 Tu plan pudo ser más fuerte</strong><ul>` +
        weakPicks.map((o) => `<li><strong>${o.label}:</strong> ${o.explain}</li>`).join("") + `</ul>`;
      spoken = "Tu plan pudo ser más fuerte. " + weakPicks.map((o) => `${o.label}: ${o.explain}`).join(" ");
      if (node.tip) { html += `<div class="tip-hint">💡 <strong>Tip:</strong> ${node.tip}</div>`; spoken += ` Tip: ${node.tip}`; }
      tipEl.innerHTML = html;
    }
    tipEl.classList.remove("hidden");
    speak(spoken);

    confirmClone.classList.add("hidden");
    contBtn.classList.remove("hidden");
    const contClone = contBtn.cloneNode(true);
    contBtn.parentNode.replaceChild(contClone, contBtn);
    contClone.addEventListener("click", () => { playSound("click"); goTo(node.next); });
  });
}

/* ---------------- LOGROS ---------------- */
function unlockAchievement(id) {
  if (!ACHIEVEMENTS[id] || state.achievements.has(id)) return;
  state.achievements.add(id);
  const a = ACHIEVEMENTS[id];
  const toast = $("#achievementToast");
  toast.innerHTML = `<span class="text-lg">${a.icon}</span><span>${a.title}</span>`;
  toast.classList.remove("hidden");
  playSound("achievement");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

/* ---------------- RESOLUCIÓN DEL CASO ---------------- */
const RESOLUTION_TO_TRUST_TIER = { exito: "high", parcial: "mid", pendiente: "low" };

function renderNpcReaction(resolutionId) {
  const cases = CASES_BY_GUARDIANA[state.guardiana.id] || [];
  const currentCase = cases.find((c) => c.id === state.currentCaseId);
  const npc = currentCase && currentCase.npc ? NPCS[currentCase.npc] : null;
  const card = $("#npcReactionCard");
  if (!npc) { card.classList.add("hidden"); return; }

  const tier = RESOLUTION_TO_TRUST_TIER[resolutionId] || "low";
  $("#npcReactionBody").innerHTML = `
    <span class="text-2xl">${npc.avatar}</span>
    <div class="min-w-0">
      <p class="font-bold text-sm">${npc.name}</p>
      <p class="text-sm text-slate-300 mt-1 leading-relaxed italic">${npc[tier]}</p>
    </div>`;
  card.classList.remove("hidden");
  queueSpeak(`${npc.name} responde: ${npc[tier]}`);
}

function computeEnding() {
  state.casesSolved.add(state.currentCaseId);
  if (!state.anyCaseSolved) { state.anyCaseSolved = true; unlockAchievement("guardiana_activa"); }

  const resolutionId = state.lastResolution || "pendiente";
  const resolution = RESOLUTIONS[resolutionId];

  $("#endingIcon").textContent = resolution.icon;
  $("#endingIcon").className = `mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl bg-gradient-to-br ${resolution.color}`;
  $("#endingTitle").textContent = resolution.title;
  $("#endingText").textContent = resolution.text;
  speak(`${resolution.title}. ${resolution.text}`);
  playSound(resolutionId === "exito" ? "success" : "click");
  if (resolutionId === "exito") burstConfetti();

  renderNpcReaction(resolutionId);
  renderAchievements();
  const q = $("#debriefQuestions");
  q.innerHTML = "";
  DEBRIEF_QUESTIONS.forEach((question) => {
    const li = document.createElement("li");
    li.textContent = question;
    q.appendChild(li);
  });

  showScreen("screen-ending");
}

function renderAchievements() {
  const wrap = $("#achievementsList");
  wrap.innerHTML = "";
  Object.entries(ACHIEVEMENTS).forEach(([id, a]) => {
    const unlocked = state.achievements.has(id);
    const div = document.createElement("div");
    div.className = "badge-card" + (unlocked ? "" : " locked");
    div.innerHTML = `<span class="text-xl">${a.icon}</span><div><p class="font-bold leading-tight">${a.title}</p><p class="text-[11px] text-slate-400 leading-tight">${a.desc}</p></div>`;
    wrap.appendChild(div);
  });
}

/* ---------------- MODAL: RECURSOS ---------------- */
function openResourcesModal() {
  const list = $("#resourcesList");
  list.innerHTML = "";
  Object.entries(RESOURCES).forEach(([key, r]) => {
    const div = document.createElement("div");
    div.className = "resource-card";
    div.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">${r.icon}</span>
        <div class="min-w-0">
          <p class="font-bold text-sm">${r.name}</p>
          <p class="text-sm text-slate-300 mt-1 leading-relaxed">${r.info}</p>
          <p class="text-xs text-cyan-300 mt-1.5 font-semibold">${r.contact}</p>
        </div>
      </div>`;
    list.appendChild(div);
  });
  $("#modalResources").classList.remove("hidden");
}
$("#btnResources").addEventListener("click", () => openResourcesModal());
$("#btnResourcesCases").addEventListener("click", () => openResourcesModal());
$("#btnViewResourcesEnd").addEventListener("click", () => openResourcesModal());
$("#menuResources").addEventListener("click", () => { closeModals(); openResourcesModal(); });

/* ---------------- MODAL: KIT DE HERRAMIENTAS ---------------- */
function openToolkitModal() {
  const list = $("#toolkitList");
  list.innerHTML = "";
  Object.values(TOOLKIT).forEach((t) => {
    const div = document.createElement("div");
    div.className = "resource-card";
    div.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">${t.icon}</span>
        <div class="min-w-0">
          <p class="font-bold text-sm">${t.name}</p>
          <p class="text-sm text-slate-300 mt-1 leading-relaxed">${t.desc}</p>
        </div>
      </div>`;
    list.appendChild(div);
  });
  $("#modalToolkit").classList.remove("hidden");
}
$("#btnToolkit").addEventListener("click", () => openToolkitModal());
$("#btnToolkitCases").addEventListener("click", () => openToolkitModal());
$("#menuToolkit").addEventListener("click", () => { closeModals(); openToolkitModal(); });

/* ---------------- MODAL: MENÚ ---------------- */
$("#btnMenu").addEventListener("click", () => $("#modalMenu").classList.remove("hidden"));
function closeModals() { $all(".modal-backdrop").forEach((m) => m.classList.add("hidden")); }
$all("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModals));
$all(".modal-backdrop").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));

/* Gancho de depuración (no es un módulo, así que esto no es estrictamente
   necesario para que funcione, pero ayuda a soporte técnico y pruebas). */
window.__game = { state, goTo, startGuardiana, startCase, renderGuardianaSelect, GUARDIANAS, SCENARIOS, RESOLUTIONS };
