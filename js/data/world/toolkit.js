/* ============================================================
   TOOLKIT — kit de ciberseguridad (reemplaza el sistema de "vidas")
   Referencia visual/educativa. Cada caso decide cuáles herramientas
   ofrece como opciones concretas en sus nodos de decisión.
   ============================================================ */

const TOOLKIT = {
  bloquear: { icon: "🚫", name: "Bloquear", desc: "Corta el contacto de inmediato. Rápido, pero no deja registro formal ante la plataforma o la ley." },
  denunciar: { icon: "📢", name: "Denunciar", desc: "Reporta el caso ante una autoridad (Policía, Fiscalía). Requiere evidencia para prosperar." },
  silenciar: { icon: "🔇", name: "Silenciar", desc: "Deja de ver los mensajes sin que la otra persona lo note. Útil para ganar tiempo sin escalar." },
  reportar: { icon: "🚩", name: "Reportar en la plataforma", desc: "Activa la moderación de la red social o app. No siempre es inmediato, pero deja registro." },
  privacidad: { icon: "⚙️", name: "Ajustar privacidad", desc: "Reduce quién puede ver tu información y contactarte. Previene, no siempre resuelve algo ya en curso." },
  dosfactores: { icon: "🔐", name: "Autenticación en dos pasos", desc: "Agrega una segunda verificación para que nadie más entre a tu cuenta aunque tenga tu contraseña." },
  cambiarclave: { icon: "🔑", name: "Cambiar contraseña", desc: "Corta el acceso de quien ya conocía tu clave anterior. Más fuerte si además activas 2FA." },
  verificar: { icon: "✅", name: "Verificar identidad", desc: "Confirmas por otro canal que la persona o situación es real antes de actuar." },
  cifrado: { icon: "🔒", name: "Verificar cifrado (HTTPS)", desc: "Confirmas que un sitio tenga conexión segura (candado, https) antes de ingresar cualquier dato personal — clave para detectar sitios de phishing." },
  guardarevidencia: { icon: "💾", name: "Guardar evidencia", desc: "Capturas, URL, hora, usuario. Sin esto, una denuncia puede no prosperar." },
  pedirayuda: { icon: "🆘", name: "Pedir ayuda", desc: "Buscas a otra Guardiana, un adulto de confianza o una ruta institucional." },
};
