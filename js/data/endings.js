/* ============================================================
   RESOLUTIONS — cierre de cada caso (no es un final de partida,
   es el resultado de ESTE caso puntual; la Guardiana sigue activa
   y puede tomar más casos después).
   ============================================================ */

const RESOLUTIONS = {
  exito: { id: "exito", icon: "✅", color: "from-emerald-500 to-teal-400",
    title: "Caso resuelto con éxito",
    text: "Investigaste con cuidado, reuniste evidencia suficiente y elegiste la herramienta correcta. El caso avanzó como debía." },
  parcial: { id: "parcial", icon: "🟡", color: "from-amber-500 to-orange-400",
    title: "Caso resuelto parcialmente",
    text: "Tomaste una decisión razonable, pero algo quedó incompleto — tal vez la evidencia, tal vez el canal elegido. El caso sigue en curso, no es un fracaso." },
  pendiente: { id: "pendiente", icon: "🔎", color: "from-sky-500 to-cyan-400",
    title: "Caso queda pendiente de seguimiento",
    text: "La situación no se resolvió del todo en esta interacción — y eso también pasa en la vida real. Cada intento deja aprendizaje para el siguiente caso." },
};
