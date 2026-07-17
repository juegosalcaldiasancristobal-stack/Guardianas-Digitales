/* ============================================================
   SOFÍA — Experta en privacidad
   Caso: 002 "La foto que no debía circular"
   --------------------------------------------------------------
   Conexión narrativa con "Mi Red de Apoyo": esta es la misma Sofía
   que acompañó a su amiga Yuli cuando alguien amenazó con difundir
   fotos suyas sin permiso. No hay estado compartido entre los dos
   juegos — es solo continuidad de universo, contada en el texto.
   ============================================================ */

const sofiaGuardiana = {
  id: "sofia", name: "Sofía Bermúdez", age: 20,
  tag: "Experta en privacidad", avatar: "👩🏻",
  color: "from-teal-500 to-emerald-400",
  skin: "#e8b894", hair: "#1f1512", hairStyle: "largo",
  specialty: "Privacidad y consentimiento",
  blurb: "Hace un tiempo acompañó a su mejor amiga, Yuli, cuando alguien amenazó con difundir fotos suyas sin permiso. Esa experiencia la marcó — y la llevó a formarse como Guardiana Digital, especializada en privacidad y consentimiento.",
};

const sofiaCases = [
  {
    id: "caso002", title: "La foto que no debía circular", platform: "red_social",
    brief: "Camila (18 años) te escribe: alguien compartió, sin su permiso, una foto privada suya en un grupo de la localidad.",
    scenarioId: "caso002", npc: "caivirtual", theme: "imagenes",
  },
  {
    id: "caso003", title: "El enlace de la beca", platform: "universidad",
    brief: "Manuela, compañera de universidad, recibió un mensaje que promete una beca — solo tiene que 'confirmar sus datos' en un enlace.",
    scenarioId: "caso003", requires: "caso002", npc: "caivirtual", theme: "phishing",
  },
];

const sofiaScenarios = {
  caso002: {
    start: "s1",
    nodes: {
      s1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Camila, de 18 años, te escribe angustiada: «Sofía, alguien compartió una foto mía en un grupo del barrio, una que solo le había mandado a una persona. No sé qué hacer».",
        bg: "scene-room", next: "s1b" },
      s1b: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Te acuerdas de Yuli, tu mejor amiga, y de lo que sintió cuando vivió algo parecido. Sabes exactamente cuánto miedo y vergüenza puede sentir Camila ahora mismo.",
        bg: "scene-room", next: "s2" },

      s2: { type: "inspect", mood: "preocupada", frameIcon: "📌", frameLabel: "Publicación circulando",
        instructions: "Toca los datos relevantes para entender la gravedad y el alcance del caso.",
        tip: "Para medir la gravedad de un caso de imagen no consentida, fíjate en el alcance de la difusión, quién la publicó y si sigue activa — no en lo que la víctima haya compartido antes.",
        hotspots: [
          { id: "reach", kind: "bio", isFlag: true,
            html: "👥 <strong>Alcance:</strong> grupo con más de 800 personas",
            explain: "El alcance de la difusión es clave para dimensionar el daño y priorizar la urgencia de actuar." },
          { id: "source", kind: "bio", isFlag: true,
            html: "💔 <strong>Origen:</strong> publicada por una expareja de Camila",
            explain: "Conocer el origen ayuda a entender el patrón — esto suele ser un acto de control o venganza, no un accidente." },
          { id: "context2", kind: "bio", isFlag: false,
            html: "📷 Camila había subido fotos similares a su cuenta privada antes",
            explain: "Lo que Camila haya compartido antes, y con quién, no la hace responsable de que alguien más la difunda sin su consentimiento. No es una señal relevante — es un juicio de valor que hay que evitar." },
          { id: "active", kind: "bio", isFlag: true,
            html: "🔴 <strong>Estado:</strong> la publicación sigue activa, sin borrar",
            explain: "Mientras la publicación siga activa, el daño continúa — esto define qué tan urgente es actuar." },
        ],
        next: "s3" },

      s3: { type: "minigame", subtype: "tapflags", mode: "evidencia", mood: "preocupada",
        speaker: "📁 Reúne evidencia con Camila",
        instructions: "Selecciona solo lo necesario para una denuncia formal.",
        tip: "La evidencia debe mostrar el hecho (captura, fecha), dónde circula y quién lo hizo. Los comentarios ofensivos de terceros no son evidencia del delito principal.",
        items: [
          { id: "e1", text: "Captura de la publicación con fecha y hora visibles", isFlag: true, explain: "Es la prueba central del hecho." },
          { id: "e2", text: "Enlace o nombre del grupo donde circula", isFlag: true, explain: "Permite ubicar exactamente dónde se está difundiendo." },
          { id: "e3", text: "Nombre de quien la publicó, si se conoce", isFlag: true, explain: "Identifica a la persona responsable para la denuncia." },
          { id: "e4", text: "Captura de comentarios ofensivos de otras personas en el grupo", isFlag: false,
            explain: "Aunque duelan, esos comentarios no son evidencia del delito principal — enfocar la evidencia ayuda a que la denuncia sea más clara y efectiva." },
        ],
        next: "s3b" },

      s3b: { type: "sequence", speaker: "🧩 Ordena los pasos para actuar con calma", mood: "preocupada", bg: "scene-room",
        instructions: "Ordena estas acciones en el orden en que deberían hacerse, del 1 (primero) al 4 (último).",
        tip: "Acompañar primero, sin juzgar, hace que la persona afectada confíe en seguir el proceso contigo — la evidencia y la denuncia formal vienen después, con más calma.",
        items: [
          { id: "sq1", text: "Escuchar y acompañar a Camila sin juzgarla." },
          { id: "sq2", text: "Verificar si la publicación sigue activa." },
          { id: "sq3", text: "Guardar evidencia: captura, fecha y enlace." },
          { id: "sq4", text: "Denunciar formalmente con la evidencia lista." },
        ],
        order: ["sq1", "sq2", "sq3", "sq4"],
        next: "choice1" },

      choice1: { type: "allocate", speaker: "Sofía — Arma tu plan de acción", mood: "preocupada", text:
        "Con la evidencia lista, tienes tiempo para dos acciones prioritarias.",
        bg: "scene-room", slots: 2, requiresGoodEvidence: true,
        instructions: "Elige exactamente 2 acciones para acompañar a Camila.",
        tip: "En casos de difusión no consentida de imágenes, la denuncia formal es el paso con más peso legal (Ley 1273 y 1257), pero acompañar emocionalmente a la persona también es parte del rol de una Guardiana.",
        options: [
          { id: "a1", tool: "denunciar", icon: "📢", label: "Denunciar formalmente en el CAI Virtual", quality: 1,
            explain: "En Colombia, difundir contenido íntimo sin consentimiento es delito (Ley 1273 de 2009 y Ley 1257 de 2008)." },
          { id: "a2", tool: "reportar", icon: "🚩", label: "Reportar la publicación a la plataforma", quality: 0.75,
            explain: "Ayuda a frenar la difusión más rápido, aunque no reemplaza la denuncia formal." },
          { id: "a3", tool: "pedirayuda", icon: "🤝", label: "Conectar con la Línea Púrpura (apoyo emocional)", quality: 0.5,
            explain: "Cuidar el bienestar emocional de Camila es tan importante como el trámite." },
          { id: "a5", tool: "privacidad", icon: "⚙️", label: "Ajustar la configuración de privacidad de su cuenta", quality: 0.5,
            explain: "Reduce el riesgo de que algo así vuelva a pasar, pero no resuelve la publicación que ya está circulando — es un complemento, no la acción principal." },
          { id: "a4", tool: "nada", icon: "🙊", label: "Aconsejarle borrar su cuenta y esperar que pase", quality: 0,
            explain: "Esconderse no detiene la difusión, y deja a Camila sin acompañamiento ni ruta clara." },
        ],
        next: "s4" },

      s4: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Ninguna decisión hace que lo ocurrido desaparezca de inmediato — pero Camila ya no enfrenta esto sola, y ahora conoce exactamente qué rutas existen si algo así vuelve a pasar.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== CASO 003 — PHISHING =================== */
  caso003: {
    start: "ph1",
    nodes: {
      ph1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Manuela, compañera de universidad, te escribe emocionada: «¡Sofía, me gané una beca! Me llegó un mensaje, solo tengo que confirmar mis datos antes de que se acabe el plazo».",
        bg: "scene-room", next: "ph1b" },
      ph1b: { type: "chat", speaker: "Mensaje recibido por Manuela", mood: "preocupada", bg: "scene-room",
        messages: [
          { from: "them", text: "🎓 ¡Felicitaciones! Fuiste seleccionada para la Beca Universitaria 2025." },
          { from: "them", text: "Confirma tus datos aquí antes de 2 horas o pierdes el cupo: bit.ly/beca-2025-confirmar" },
          { from: "them", text: "Necesitamos tu número de cédula, tu contraseña del correo institucional y un número de tarjeta para 'verificar tu identidad'." },
        ],
        next: "ph2" },

      ph2: { type: "inspect", mood: "preocupada", frameIcon: "🎓", frameLabel: "Mensaje recibido por Manuela",
        instructions: "Toca los elementos del mensaje que son señal de phishing.",
        tip: "El phishing casi siempre combina tres señales: urgencia artificial, petición de datos sensibles y un enlace que no lleva al dominio oficial. Un logo bonito no prueba que el mensaje sea legítimo.",
        hotspots: [
          { id: "urgency", kind: "emailrow", isFlag: true,
            html: '<span class="mock-label">Plazo</span> Solo 2 horas para confirmar o pierdes el cupo',
            explain: "La urgencia artificial es una de las técnicas más comunes de phishing: busca que actúes sin pensar." },
          { id: "data", kind: "emailrow", isFlag: true,
            html: '<span class="mock-label">Pide</span> contraseña del correo y número de tarjeta',
            explain: "Ninguna beca real pide tu contraseña ni datos bancarios completos para 'confirmar' una selección." },
          { id: "link", kind: "link", isFlag: true,
            html: "🔗 bit.ly/beca-2025-confirmar (enlace acortado, no el dominio oficial)",
            explain: "Los enlaces acortados esconden el destino real — una entidad seria enlaza directo a su dominio oficial." },
          { id: "logo", kind: "emailrow", isFlag: false,
            html: '<span class="mock-label">Diseño</span> Usa el logo oficial de la universidad',
            explain: "Un logo se puede copiar fácilmente — por sí solo no prueba que el mensaje sea legítimo, ni lo contrario." },
        ],
        next: "ph3" },

      ph3: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Antes de decirle a Manuela qué hacer, reúnes lo necesario para poder reportarlo con bases sólidas.",
        bg: "scene-room", next: "ph4" },

      ph4: { type: "minigame", subtype: "tapflags", mode: "evidencia", mood: "preocupada",
        speaker: "📁 Reúne evidencia",
        instructions: "Selecciona solo lo que sirve para el reporte.",
        tip: "Guarda el mensaje completo y la URL exacta — pero nunca reenvíes el enlace sospechoso, ni siquiera para 'que otros opinen': eso multiplica el riesgo de que alguien más haga clic.",
        items: [
          { id: "e1", text: "Captura completa del mensaje", isFlag: true, explain: "Registra el contenido exacto del intento de phishing." },
          { id: "e2", text: "La URL exacta del enlace sospechoso", isFlag: true, explain: "Permite que la universidad y la plataforma bloqueen ese dominio." },
          { id: "e3", text: "El número o cuenta desde donde llegó", isFlag: true, explain: "Identifica el origen para el reporte." },
          { id: "e4", text: "Reenviar el enlace al grupo del curso 'para que opinen'", isFlag: false,
            explain: "Reenviar el enlace, aunque sea con buena intención, multiplica el riesgo de que alguien más haga clic. Mejor describir la señal de alerta sin compartir el enlace en sí." },
        ],
        next: "ph4b" },

      ph4b: { type: "sequence", speaker: "🧩 Ordena los pasos frente a un mensaje sospechoso", mood: "preocupada", bg: "scene-room",
        instructions: "Ordena estas acciones en el orden correcto para reaccionar frente a un posible phishing.",
        tip: "La urgencia es la primera trampa del phishing — frenar antes de hacer clic te da tiempo para verificar con calma.",
        items: [
          { id: "sq1", text: "No hacer clic de inmediato, aunque el mensaje dé prisa." },
          { id: "sq2", text: "Revisar el enlace y el remitente con cuidado." },
          { id: "sq3", text: "Confirmar por un canal oficial aparte (llamar, escribir directo)." },
          { id: "sq4", text: "Reportar el mensaje si resulta ser falso." },
        ],
        order: ["sq1", "sq2", "sq3", "sq4"],
        next: "choice1" },

      choice1: { type: "allocate", speaker: "Sofía — Arma tu plan de acción", mood: "preocupada", text:
        "Con las señales claras y la evidencia lista, tienes tiempo para dos acciones prioritarias.",
        bg: "scene-room", slots: 2, requiresGoodEvidence: true,
        instructions: "Elige exactamente 2 acciones para orientar a Manuela.",
        tip: "Verificar por un canal oficial distinto (llamar, escribir directo a la entidad) es más seguro que confiar en cualquier dato que venga del mismo mensaje sospechoso.",
        options: [
          { id: "a1", tool: "cifrado", icon: "🔒", label: "Verificar cifrado (https) y no ingresar datos", quality: 1,
            explain: "Verificar el candado/https es un hábito clave, aunque la regla de oro sigue siendo: no ingresar datos sensibles desde un enlace no verificado." },
          { id: "a2", tool: "verificar", icon: "✅", label: "Confirmar con la oficina de becas por canal oficial", quality: 1,
            explain: "Verificar por un canal independiente y confiable es una de las formas más seguras de confirmar si algo es legítimo." },
          { id: "a3", tool: "reportar", icon: "📢", label: "Reportar el mensaje sin analizarlo más", quality: 0.5,
            explain: "Reportar es correcto, pero entender qué lo hizo sospechoso ayuda a que Manuela reconozca la próxima señal ella misma." },
          { id: "a4", tool: "confiar", icon: "📝", label: "Llenar el formulario 'por si acaso es real'", quality: 0,
            explain: "Ingresar datos en un enlace no verificado, aunque sea 'por si acaso', es exactamente el resultado que busca el phishing." },
        ],
        next: "ph5" },

      ph5: { type: "choice", speaker: "Sofía — El grupo del curso", mood: "preocupada", text:
        "Manuela te cuenta que ya le había reenviado el enlace a su grupo de estudio antes de escribirte, «por si a alguien más le servía».",
        bg: "scene-room",
        choices: [
          { tag: "No hacer nada", text: "Asumes que el grupo ya se dará cuenta solo.",
            feedback: "Es posible que alguien más haga clic mientras tanto — una alerta a tiempo puede evitar que más personas caigan en el mismo enlace.",
            next: "ph6" },
          { tag: "Avisar al grupo", text: "Le sugieres a Manuela avisar de inmediato al grupo que el enlace es phishing, sin necesidad de reenviarlo de nuevo.",
            achievement: "amiga_protegida",
            feedback: "Avisar rápido, sin viralizar el enlace, corta la cadena antes de que más personas resulten afectadas — exactamente el rol de una Guardiana.",
            next: "ph6" },
          { tag: "Burlarse", text: "Le dices que fue ingenua por reenviarlo sin pensar.",
            feedback: "El phishing está diseñado para engañar incluso a personas cuidadosas — señalar el error sin acompañar no ayuda a que el grupo aprenda ni se sienta seguro de pedir ayuda la próxima vez.",
            next: "ph6" },
        ] },

      ph6: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "En Colombia, capturar datos personales o bancarios mediante engaños digitales está tipificado en la Ley 1273 de 2009. Manuela no perdió una beca real — pero si hubiera ingresado sus datos, sí habría estado en riesgo real.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },
};
