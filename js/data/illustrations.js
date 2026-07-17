/* ============================================================
   ILUSTRACIONES DE ESCENA — arte vectorial generado (SVG)
   --------------------------------------------------------------
   Una ilustración distinta por tipo de amenaza, para que cada
   caso se sienta visualmente representado y no solo textual.
   Pensado para ser reemplazado 1:1 por ilustración final de
   artista: cambiar SCENE_ILLUSTRATIONS por <img> sin tocar el
   resto del motor (engine.js solo llama sceneIllustrationSVG()).
   ============================================================ */

const THEME_COLORS = {
  control: "#22d3ee",
  imagenes: "#fb7185",
  phishing: "#fbbf24",
  suplantacion: "#a78bfa",
  doxing: "#f87171",
  default: "#22d3ee",
};

const SCENE_ILLUSTRATIONS = {
  /* Acoso / control excesivo por chat */
  control: (color) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="10" width="46" height="86" rx="10" fill="none" stroke="${color}" stroke-width="4"/>
      <rect x="36" y="20" width="34" height="58" rx="3" fill="${color}" fill-opacity="0.1"/>
      <path d="M74 28 q22 -4 26 14 q3 14 -10 20" fill="${color}" fill-opacity="0.85"/>
      <path d="M78 46 q18 -2 20 12 q2 11 -9 15" fill="${color}" fill-opacity="0.55"/>
      <path d="M76 64 q14 0 15 10 q1 8 -8 11" fill="${color}" fill-opacity="0.3"/>
      <circle cx="53" cy="88" r="3" fill="${color}"/>
      <circle cx="100" cy="18" r="5" fill="${color}">
        <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite"/>
      </circle>
    </svg>`,

  /* Difusión no consentida de imágenes */
  imagenes: (color) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="26" width="62" height="46" rx="6" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="4"/>
      <circle cx="37" cy="42" r="6" fill="${color}"/>
      <path d="M24 66 L46 50 L60 62 L82 44 L78 68 Z" fill="${color}" fill-opacity="0.5"/>
      <circle cx="92" cy="30" r="16" fill="none" stroke="#fb7185" stroke-width="4"/>
      <line x1="82" y1="20" x2="102" y2="40" stroke="#fb7185" stroke-width="4"/>
      <circle cx="14" cy="92" r="3" fill="${color}" opacity="0.6"/>
      <circle cx="29" cy="101" r="2.4" fill="${color}" opacity="0.4"/>
      <circle cx="6" cy="80" r="2" fill="${color}" opacity="0.3"/>
    </svg>`,

  /* Phishing */
  phishing: (color) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="34" width="72" height="48" rx="6" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="4"/>
      <path d="M16 38 L52 63 L88 38" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M80 58 q20 4 18 26 q-1 13 -15 13 q-11 0 -11 -10" fill="none" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="70" cy="56" r="4" fill="#fbbf24"/>
      <path d="M99 16 L110 34 L88 34 Z" fill="none" stroke="#fb7185" stroke-width="3.5" stroke-linejoin="round"/>
      <line x1="99" y1="22" x2="99" y2="28" stroke="#fb7185" stroke-width="3"/>
      <circle cx="99" cy="31" r="1.5" fill="#fb7185"/>
    </svg>`,

  /* Suplantación de identidad / estafa */
  suplantacion: (color) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="44" r="19" fill="none" stroke="${color}" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.55"/>
      <path d="M20 88 q0 -21 20 -21 q20 0 20 21" fill="none" stroke="${color}" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.55"/>
      <circle cx="58" cy="52" r="19" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="4"/>
      <path d="M38 96 q0 -21 20 -21 q20 0 20 21" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="4"/>
      <circle cx="94" cy="24" r="14" fill="#fbbf24" fill-opacity="0.92"/>
      <text x="94" y="29" font-size="14" font-weight="800" text-anchor="middle" fill="#3a2a00">$</text>
    </svg>`,

  /* Doxing / exposición de datos personales */
  doxing: (color) => `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 66 L54 40 L90 66 V98 H18 Z" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="44" y="74" width="20" height="24" fill="${color}" fill-opacity="0.4"/>
      <path d="M86 8 C101 8 109 21 109 33 C109 50 86 68 86 68 C86 68 63 50 63 33 C63 21 71 8 86 8 Z" fill="#fb7185" fill-opacity="0.85"/>
      <circle cx="86" cy="31" r="8" fill="#3a0d12"/>
      <ellipse cx="28" cy="96" rx="18" ry="4" fill="${color}" opacity="0.15"/>
    </svg>`,

  /* Genérico — escudo + señal, para escenas sin amenaza específica */
  default: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 6 L88 20 V48 C88 72 71 88 50 96 C29 88 12 72 12 48 V20 Z" stroke="${color}" stroke-width="4" fill="${color}" fill-opacity="0.12"/>
      <path d="M32 50 Q50 30 68 50" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M40 60 Q50 50 60 60" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <circle cx="50" cy="70" r="4" fill="${color}"/>
    </svg>`,
};

function sceneIllustrationSVG(theme, color) {
  const build = SCENE_ILLUSTRATIONS[theme] || SCENE_ILLUSTRATIONS.default;
  return build(color || THEME_COLORS[theme] || THEME_COLORS.default);
}
