/* ============================================================
   NPCS — personajes recurrentes del universo digital
   ============================================================ */

const NPCS = {
  moderador: { id: "moderador", name: "Moderador de la plataforma", avatar: "🛡️", trust: 40,
    low: "«Su reporte fue recibido, será revisado en los próximos días.»",
    mid: "«Con la evidencia que envió, podemos priorizar la revisión de esta cuenta.»",
    high: "«Gracias por el reporte detallado, ya tomamos acción sobre el perfil.»" },
  caivirtual: { id: "caivirtual", name: "CAI Virtual (Policía)", avatar: "🖥️", trust: 100,
    low: "«Puede radicar la denuncia en línea, cuéntenos qué evidencia tiene.»",
    mid: "«Con capturas, URL y usuario ya podemos abrir un caso formal.»",
    high: "«Su denuncia está en trámite, seguimos en contacto.»" },
  orientadora: { id: "orientadora", name: "Orientadora escolar", avatar: "🧑🏻‍🏫", trust: 40,
    low: "«Puedo agendar una charla para la próxima semana.»",
    mid: "«Esto que describes ya lo hemos visto antes, hay protocolo para acompañarlo.»",
    high: "«Sigamos de cerca este caso juntas, con calma y de forma confidencial.»" },
};
