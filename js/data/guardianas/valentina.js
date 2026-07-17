/* ============================================================
   VALENTINA — Especialista en redes sociales
   Casos: 001 "¿Amistad o control?" · 004 "El perfil que no era ella"
   ============================================================ */

const valentinaGuardiana = {
  id: "valentina", name: "Valentina Ríos", age: 22,
  tag: "Especialista en redes sociales", avatar: "👩🏻‍💻",
  color: "from-cyan-500 to-sky-400",
  skin: "#e8b894", hair: "#2a1f1c", hairStyle: "largo",
  specialty: "Redes sociales",
  blurb: "Lleva un año como voluntaria. Después de ver de cerca cuánto daño puede hacer un mensaje insistente, decidió aprender a identificar señales de control antes de que sea tarde.",
};

const valentinaCases = [
  {
    id: "caso001", title: "¿Amistad o control?", platform: "chat_escolar",
    brief: "Laura (14 años) te escribe preocupada: un compañero de otro salón le escribe todo el día, se molesta si no responde rápido, y le pregunta constantemente dónde está.",
    scenarioId: "caso001", npc: "orientadora", theme: "control",
  },
  {
    id: "caso004", title: "El perfil que no era ella", platform: "comunidad_gamer",
    brief: "Alguien creó un perfil idéntico al de Mafe, una gamer conocida en un servidor de Bogotá, y está pidiendo dinero a sus seguidores haciéndose pasar por ella.",
    scenarioId: "caso004", requires: "caso001", npc: "moderador", theme: "suplantacion",
  },
  {
    id: "caso_doxing", title: "El hilo que expuso su dirección", platform: "foro",
    brief: "Tras una discusión de vecinos, alguien publicó en un foro la dirección exacta, el trabajo y fotos de la casa de Andrea, incitando a otros a 'pasar a buscarla'.",
    scenarioId: "caso_doxing", requires: "caso004", npc: "caivirtual", theme: "doxing",
  },
];

const valentinaScenarios = {
  /* =================== CASO 001 =================== */
  caso001: {
    start: "v1",
    nodes: {
      v1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Laura, de 14 años, te escribe por el chat de la comunidad de Guardianas: «Valentina, ¿me puedes ayudar? Hay un chico de otro salón que me escribe todo el día y no sé si es normal o no».",
        bg: "scene-room", next: "v1b" },
      v1b: { type: "chat", speaker: "Chat de Laura con el compañero", mood: "preocupada", bg: "scene-room",
        messages: [
          { from: "them", text: "¿Por qué te demoras tanto en responder?" },
          { from: "them", text: "¿Con quién estás ahorita?" },
          { from: "me", text: "Estudiando con mi mamá, ya te dije jaja" },
          { from: "them", text: "Mándame una foto de dónde estás para saber que no me mientes" },
          { from: "them", text: "Si no me contestas rápido me preocupo mucho, en serio" },
        ],
        next: "v2" },

      v2: { type: "inspect", mood: "preocupada", frameIcon: "📊", frameLabel: "Patrón de mensajes — últimos 3 días",
        instructions: "Toca los indicadores del patrón que consideres señales de control, no solo de interés o cariño.",
        tip: "Fíjate en el patrón de exigencias — frecuencia, control de ubicación, reacción a la demora. El tono amable de un mensaje no dice nada sobre si hay control detrás.",
        hotspots: [
          { id: "freq", kind: "bio", isFlag: true,
            html: "📈 <strong>Frecuencia:</strong> más de 15 mensajes seguidos en 2 horas",
            explain: "Un volumen así de mensajes en poco tiempo, exigiendo respuesta, es parte del patrón de control — no un mensaje aislado." },
          { id: "loc", kind: "bio", isFlag: true,
            html: "📍 <strong>Pide ubicación en tiempo real</strong> varias veces por semana",
            explain: "Pedir prueba de ubicación de forma insistente es vigilancia, no cariño." },
          { id: "react", kind: "bio", isFlag: true,
            html: "⏱️ <strong>Se molesta</strong> si Laura no responde en menos de 5 minutos",
            explain: "Exigir respuesta inmediata y molestarse si no ocurre es una forma de presión y control del tiempo de la otra persona." },
          { id: "emoji", kind: "bio", isFlag: false,
            html: "😊 Usa emojis alegres para despedirse en las noches",
            explain: "El tono del mensaje no define el patrón — lo relevante son las exigencias de fondo, no si suena amable." },
        ],
        next: "v3" },

      v3: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Antes de aconsejar a Laura, como Guardiana necesitas reunir lo necesario para que, si hace falta, la orientadora del colegio pueda actuar con bases sólidas.",
        bg: "scene-room", next: "v4" },

      v4: { type: "minigame", subtype: "tapflags", mode: "evidencia", mood: "preocupada",
        speaker: "📁 Reúne evidencia — ¿Qué es útil guardar?",
        instructions: "Selecciona solo lo que realmente sirve como evidencia. Guardar de más también tiene riesgos.",
        tip: "La evidencia útil identifica el hecho, a quién corresponde y cuándo ocurrió. Los datos personales de la víctima nunca son evidencia — y compartirlos, incluso 'para documentar', la expone más.",
        items: [
          { id: "e1", text: "Captura de la conversación completa", isFlag: true,
            explain: "El registro textual es la evidencia más directa y verificable." },
          { id: "e2", text: "Nombre de usuario del compañero", isFlag: true,
            explain: "Identifica con claridad a quién corresponde el reporte." },
          { id: "e3", text: "Hora exacta de los mensajes", isFlag: true,
            explain: "Ayuda a mostrar el patrón de insistencia (ej. mensajes de madrugada)." },
          { id: "e4", text: "La dirección de la casa de Laura", isFlag: false,
            explain: "No es evidencia del caso, y compartirla —incluso para 'documentar'— expone innecesariamente a Laura." },
        ],
        next: "choice1" },

      choice1: { type: "allocate", speaker: "Valentina — Arma tu plan de acción", mood: "preocupada", text:
        "Como Guardiana tienes tiempo para dos acciones prioritarias en este caso. Elige con cuidado — no alcanza para todo.",
        bg: "scene-room", slots: 2, requiresGoodEvidence: true,
        instructions: "Elige exactamente 2 acciones para orientar a Laura.",
        tip: "Combinar acompañamiento humano (un adulto de confianza) con evidencia bien guardada siempre es más fuerte que actuar en silencio o depender solo de la plataforma.",
        options: [
          { id: "a1", tool: "pedirayuda", icon: "🆘", label: "Hablar con un adulto de confianza", quality: 1,
            explain: "Combinar acompañamiento humano con evidencia ya lista es la ruta más sólida." },
          { id: "a2", tool: "guardarevidencia", icon: "💾", label: "Asegurar y ordenar la evidencia", quality: 1,
            explain: "Sin evidencia ordenada, cualquier reporte formal pierde fuerza." },
          { id: "a3", tool: "reportar", icon: "🚩", label: "Reportar el perfil a la plataforma", quality: 0.5,
            explain: "Es un paso válido, pero por sí solo no sustituye el acompañamiento humano — puede tardar." },
          { id: "a4", tool: "silenciar", icon: "🔇", label: "Silenciar sin decir nada a nadie", quality: 0,
            explain: "Da un respiro momentáneo, pero no atiende el patrón de fondo ni deja registro." },
        ],
        next: "v5" },

      v5: { type: "choice", speaker: "Valentina — Un dato más", mood: "preocupada", text:
        "Laura te cuenta algo más: «Ah, y creo que a Nicole, de mi salón, le escribe parecido... pero ella no le para bolas».",
        bg: "scene-room",
        choices: [
          { tag: "Ignorar", text: "Decides que no es tu caso y te enfocas solo en Laura.",
            feedback: "Es cierto que no puedes resolver todo — pero descartar la señal sin avisar a nadie deja a Nicole sin ninguna alerta temprana.",
            next: "v6" },
          { tag: "Avisar a orientación", text: "Le sugieres a Laura que, con su permiso, cuenten también lo de Nicole en el colegio.",
            achievement: "amiga_protegida",
            feedback: "Extender la alerta a una posible segunda afectada, con cuidado y consentimiento, es exactamente el papel de 'espectadora activa' que buscamos como Guardianas.",
            next: "v6" },
          { tag: "Contactar directo", text: "Le escribes tú misma a Nicole, con respeto, para contarle lo que aprendiste sobre señales de control.",
            achievement: "amiga_protegida",
            feedback: "Acercarte directamente, sin presionar, ofreciendo información y no juicio, es una forma efectiva de acompañar sin invadir.",
            next: "v6" },
        ] },

      v6: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "El caso de Laura no termina en un solo mensaje resuelto — pero ya no está sola, y ahora sabe reconocer las señales si se repiten. Eso, como Guardiana, es tu primer objetivo.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== CASO 004 =================== */
  caso004: {
    start: "g1",
    nodes: {
      g1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "En el servidor gamer más grande de Bogotá, varios usuarios reportan lo mismo: un perfil idéntico al de Mafe, una streamer conocida, está pidiendo transferencias de dinero 'para un torneo'.",
        bg: "scene-street-day", next: "g2" },

      g2: { type: "inspect", mood: "preocupada", frameIcon: "🎮", frameLabel: "Perfil sospechoso — @MafeGamer_ok",
        instructions: "Toca los elementos del perfil que son señal de que podría ser falso.",
        tip: "Una cuenta suplantadora suele ser reciente, sin contenido propio y con enlaces externos pidiendo dinero. Copiar el 'diseño' no prueba nada — cualquiera puede imitar colores y logos.",
        achievementOnPerfect: "perfil_falso",
        hotspots: [
          { id: "created", kind: "avatarrow", isFlag: true,
            html: '<span class="mock-avatar">🎮</span><span><span class="mock-username">@MafeGamer_ok</span><span class="mock-sub">Cuenta creada hace 2 días</span></span>',
            explain: "Las cuentas suplantadoras suelen ser muy recientes." },
          { id: "followers", kind: "statsrow", isFlag: true,
            html: '<span class="mock-stat"><strong>3</strong><span>seguidores</span></span><span class="mock-stat"><strong>0</strong><span>publicaciones</span></span>',
            explain: "Una cuenta 'nueva' con cero publicaciones propias, actuando como si tuviera comunidad, es sospechosa." },
          { id: "photos", kind: "grid", isFlag: true,
            html: '<span>🖼️ Fotos idénticas a la cuenta real, sin marca de agua</span><div class="mock-grid"><div class="mock-thumb">🖼️</div><div class="mock-thumb">🖼️</div><div class="mock-thumb">🖼️</div></div>',
            explain: "La ausencia total de contenido original, combinada con fotos robadas, es una señal clásica de perfil falso." },
          { id: "link", kind: "link", isFlag: true,
            html: "🔗 Pide transferencias por: bit.ly/torneo-mafe-2025",
            explain: "Pedir dinero por un enlace externo, fuera de la plataforma oficial, es una bandera roja de estafa." },
          { id: "colors", kind: "bio", isFlag: false,
            html: "🎨 Usa los mismos colores de portada que la cuenta real de Mafe",
            explain: "Copiar una estética visual no es, por sí sola, evidencia de nada — cualquiera puede coincidir en gustos visuales." },
        ],
        next: "g3" },

      g3: { type: "minigame", subtype: "tapflags", mode: "evidencia", mood: "preocupada",
        speaker: "📁 Reúne evidencia antes de actuar",
        instructions: "Selecciona solo lo que sirve como evidencia real del caso.",
        tip: "Nunca compartas contraseñas como 'evidencia', ni siquiera entre Guardianas — una contraseña real jamás forma parte de una denuncia.",
        items: [
          { id: "e1", text: "Capturas del perfil falso completo", isFlag: true, explain: "Muestra el contenido exacto que se está usando para engañar." },
          { id: "e2", text: "URL o enlace del perfil falso", isFlag: true, explain: "Permite a la plataforma y a las autoridades ubicar la cuenta exacta." },
          { id: "e3", text: "Capturas de los mensajes pidiendo dinero", isFlag: true, explain: "Es la prueba directa de la intención fraudulenta." },
          { id: "e4", text: "La contraseña de la cuenta real de Mafe, 'para comparar'", isFlag: false,
            explain: "Una contraseña nunca es evidencia válida — y compartirla, incluso entre Guardianas, es un riesgo de seguridad grave. Nunca se comparte." },
        ],
        next: "choice1" },

      choice1: { type: "allocate", speaker: "Valentina — Arma tu plan de acción", mood: "preocupada", text:
        "Tienes tiempo para dos acciones prioritarias antes de que más personas caigan en la estafa.",
        bg: "scene-street-day", slots: 2, requiresGoodEvidence: true,
        instructions: "Elige exactamente 2 acciones.",
        tip: "Reportar con evidencia completa y avisar directamente a la persona suplantada suele ser más rápido que solo bloquear, que únicamente te protege a ti.",
        options: [
          { id: "a1", tool: "reportar", icon: "🚩", label: "Reportar el perfil falso con toda la evidencia", quality: 1,
            explain: "Un reporte bien documentado —capturas, URL y mensajes— es justo lo que la moderación necesita para actuar rápido." },
          { id: "a2", tool: "pedirayuda", icon: "🆘", label: "Avisar a Mafe por un canal verificado", quality: 1,
            explain: "Avisar directamente a la persona suplantada le permite alertar a su propia audiencia, la fuente más confiable." },
          { id: "a3", tool: "verificar", icon: "✅", label: "Solo verificar con Mafe, sin reportar todavía", quality: 0.5,
            explain: "Verificar es buena práctica, pero mientras tanto la cuenta falsa sigue activa y puede seguir estafando." },
          { id: "a4", tool: "bloquear", icon: "🚫", label: "Bloquear la cuenta y no hacer nada más", quality: 0,
            explain: "Bloquearla te protege a ti, pero no evita que la cuenta siga estafando a otras personas del servidor." },
        ],
        next: "g4" },

      g4: { type: "choice", speaker: "Valentina — Alguien ya cayó", mood: "triste", text:
        "Un miembro del servidor comenta que ya transfirió dinero al perfil falso antes de que se supiera que era una estafa.",
        bg: "scene-street-day",
        choices: [
          { tag: "Culpabilizar", text: "Le dices que debió fijarse mejor antes de mandar la plata.",
            feedback: "Culpar a quien ya fue víctima de un fraude no ayuda en nada, y puede hacer que no vuelva a pedir ayuda si le pasa algo similar.",
            next: "g5" },
          { tag: "Ayudar a documentar", text: "Lo ayudas a guardar el comprobante de la transferencia y lo orientas a poner la denuncia en el CAI Virtual.",
            achievement: "amiga_protegida",
            feedback: "Acompañar a alguien que ya fue víctima, sin juzgarlo, y ayudarlo a actuar con evidencia, es exactamente el papel de una Guardiana.",
            next: "g5" },
          { tag: "Ignorar", text: "No es tu responsabilidad, sigues con el reporte del perfil.",
            feedback: "Resolver el reporte general es válido, pero dejar a esa persona sin ninguna orientación individual pierde una oportunidad real de ayudar.",
            next: "g5" },
        ] },

      g5: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "La cuenta falsa termina siendo reportada y varios miembros del servidor aprenden, de primera mano, a reconocer una suplantación antes de que los alcance a ellos también.",
        bg: "scene-street-day", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== CASO DOXING =================== */
  caso_doxing: {
    start: "dx1",
    nodes: {
      dx1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "En un foro de vecinos de Bogotá, una discusión sobre una queja formal se sale de control. Alguien decide 'hacer justicia por su cuenta' y publica un hilo nuevo.",
        bg: "scene-tension", next: "dx1b" },
      dx1b: { type: "chat", speaker: "Hilo del foro", mood: "asustada", bg: "scene-tension",
        messages: [
          { from: "them", text: "Esta es la dirección de la señora que puso la queja: Calle 27 Sur #14-32." },
          { from: "them", text: "Trabaja en el centro comercial de la 27, entra a las 7am todos los días." },
          { from: "them", text: "Aquí una foto de la fachada de la casa, por si alguien quiere pasar a 'conversar' con ella." },
        ],
        next: "dx2" },

      dx2: { type: "inspect", mood: "asustada", frameIcon: "⚠️", frameLabel: "Hilo del foro de vecinos",
        instructions: "Toca los elementos del hilo que son señal de doxing — exposición de datos personales con intención de daño.",
        tip: "El doxing se reconoce por exponer datos que permiten ubicar físicamente a alguien (dirección, rutina), combinado con una intención de daño. El contexto del conflicto en sí no es la señal.",
        hotspots: [
          { id: "addr", kind: "bio", isFlag: true,
            html: "📍 <strong>Publica la dirección exacta:</strong> Calle 27 Sur #14-32",
            explain: "Exponer la ubicación exacta de alguien, sin su consentimiento y en un contexto de conflicto, es la forma más directa de doxing." },
          { id: "routine", kind: "bio", isFlag: true,
            html: "⏰ <strong>Publica su horario:</strong> entra a trabajar a las 7am todos los días",
            explain: "Compartir rutinas facilita que un tercero la ubique físicamente — aumenta el riesgo real, no solo el digital." },
          { id: "incite", kind: "bio", isFlag: true,
            html: '📣 <strong>Incita a otros:</strong> "por si alguien quiere pasar a conversar con ella"',
            explain: "Esto convierte la exposición de datos en una invitación directa a la intimidación o el acoso presencial." },
          { id: "context", kind: "bio", isFlag: false,
            html: "📋 Menciona que Andrea puso una queja formal",
            explain: "Ese es el contexto del conflicto, no en sí mismo una señal de doxing — el problema es qué se hizo con esa información después." },
        ],
        next: "dx3" },

      dx3: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Antes de actuar, reúnes lo necesario para que el reporte y, si hace falta, la denuncia, tengan bases sólidas.",
        bg: "scene-tension", next: "dx4" },

      dx4: { type: "minigame", subtype: "tapflags", mode: "evidencia", mood: "preocupada",
        speaker: "📁 Reúne evidencia",
        instructions: "Selecciona solo lo necesario para el reporte y la denuncia.",
        tip: "Nunca vuelvas a compartir la información doxeada, ni siquiera 'para advertir a otros' — cada repetición multiplica el daño en vez de contenerlo.",
        items: [
          { id: "e1", text: "Captura completa del hilo con fecha y hora", isFlag: true, explain: "Es la prueba central de la publicación." },
          { id: "e2", text: "URL o nombre exacto del foro y el hilo", isFlag: true, explain: "Permite ubicar la publicación para pedir que la retiren." },
          { id: "e3", text: "Nombre de usuario de quien publicó los datos", isFlag: true, explain: "Identifica a la persona responsable." },
          { id: "e4", text: "Compartir la dirección de Andrea con más gente 'para advertirles'", isFlag: false,
            explain: "Incluso con buena intención, seguir repitiendo la dirección expuesta multiplica el daño en vez de contenerlo. Nunca se debe re-difundir información doxeada." },
        ],
        next: "choice1" },

      choice1: { type: "allocate", speaker: "Valentina — Arma tu plan de acción", mood: "preocupada", text:
        "Tienes tiempo para dos acciones prioritarias mientras el hilo sigue activo.",
        bg: "scene-tension", slots: 2, requiresGoodEvidence: true,
        instructions: "Elige exactamente 2 acciones.",
        tip: "En un caso de doxing, avisar de inmediato a la persona afectada es tan urgente como denunciar — el riesgo físico no espera a que termine el trámite.",
        options: [
          { id: "a1", tool: "pedirayuda", icon: "🆘", label: "Avisar a Andrea de inmediato", quality: 1,
            explain: "Avisarle directamente le da a Andrea la posibilidad de tomar decisiones informadas sobre su propia seguridad física — el paso más urgente en un caso de doxing." },
          { id: "a2", tool: "denunciar", icon: "⚖️", label: "Orientarla a denunciar en el CAI Virtual", quality: 1,
            explain: "En Colombia, difundir datos personales con fines de daño puede encuadrar en la Ley 1273 de 2009." },
          { id: "a3", tool: "reportar", icon: "🚩", label: "Reportar el hilo a los moderadores del foro", quality: 0.5,
            explain: "Retira el contenido, pero no atiende el riesgo físico inmediato mientras tanto." },
          { id: "a4", tool: "nada", icon: "🤐", label: "Esperar a que Andrea pregunte por su cuenta", quality: 0,
            explain: "Esperar deja pasar tiempo valioso en una situación con riesgo físico real." },
        ],
        next: "dx5" },

      dx5: { type: "choice", speaker: "Valentina — Se sigue propagando", mood: "asustada", text:
        "Mientras tanto, notas que alguien más ya compartió la dirección de Andrea en otro grupo de WhatsApp del barrio.",
        bg: "scene-tension",
        choices: [
          { tag: "Ignorar", text: "Ya reportaste el hilo original, asumes que es suficiente.",
            feedback: "El doxing se propaga rápido precisamente porque salta de un espacio a otro — cada nueva aparición necesita su propio reporte o intervención.",
            next: "dx6" },
          { tag: "Reportar también ese grupo", text: "Reportas también esa segunda publicación y le avisas a Andrea de este nuevo foco.",
            achievement: "amiga_protegida",
            feedback: "Hacer seguimiento a dónde se sigue propagando la información, no solo al primer lugar donde apareció, es clave para contener un caso de doxing de verdad.",
            next: "dx6" },
          { tag: "Sumarme a discutir públicamente", text: "Entras al grupo a discutir públicamente con quien compartió la dirección.",
            feedback: "Confrontar públicamente puede sentirse justo, pero también puede escalar la atención hacia Andrea en vez de reducirla — a veces reportar en silencio protege más que discutir.",
            next: "dx6" },
        ] },

      dx6: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "El hilo original termina siendo retirado, y Andrea ya sabe qué está circulando y qué rutas tiene disponibles. El riesgo no desaparece de un día para otro, pero ya no lo enfrenta sin saber.",
        bg: "scene-tension", next: "end" },

      end: { type: "end" },
    },
  },
};
