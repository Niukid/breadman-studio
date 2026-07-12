# Handoff: Breadman.studio — Sitio navegable (Desktop + Mobile)

## Overview
Sitio de una sola pantalla (single-page, navegación por secciones) para **Breadman Studio**, un estudio de diseño y dirección creativa. El sitio presenta el estudio, su portafolio de trabajos, sus servicios, la historia de la marca y un formulario de contacto. Incluye un **asistente de chat con IA** (ventas / consultas / agenda) disponible en ambas versiones.

Hay **dos experiencias distintas** que comparten contenido pero con navegación y layout diferentes:
- **Desktop** — secciones que se cruzan por opacidad (crossfade), nav horizontal superior, grilla de portafolio de 3 columnas.
- **Mobile** — hojas apiladas que se deslizan verticalmente (bottom-sheet), menú fullscreen, "franjas" de color en el borde inferior como affordance de navegación.

Un contenedor responsivo (`Breadman.dc.html`) monta la versión Desktop en anchos ≥ 820px y la versión Mobile por debajo de 820px, reaccionando en vivo al redimensionar.

## About the Design Files
Los archivos de este bundle son **referencias de diseño creadas en HTML** — prototipos que muestran el aspecto y el comportamiento buscados, **no** código de producción para copiar literalmente. Están escritos con un runtime de componentes propietario (`.dc.html` + `support.js`), con lógica en una clase `Component extends DCLogic` y plantillas con marcadores `{{ }}` y elementos de control `<sc-for>`, `<sc-if>`, `<dc-import>`.

La tarea es **recrear estos diseños en el entorno del codebase destino** (React, Vue, Svelte, Astro, etc.) usando sus patrones y librerías establecidos. Si no existe un entorno todavía, elige el framework más apropiado (para un sitio de marketing como este, **Astro**, **Next.js** o **SvelteKit** encajan bien) e impleméntalo ahí. No embarques los `.dc.html` directamente.

## Fidelity
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciados, tamaños e interacciones son definitivos. Recrea la UI de forma fiel al pixel con las librerías y patrones del codebase destino. Los textos ("copy") de este README son los textos reales del sitio.

---

## Design Tokens

### Colores — fondos de sección (uno por sección)
| Sección | Nombre interno | Hex |
|---|---|---|
| Inicio / Home (intro) | slate | `#283035` |
| Home | corteza (bark) | `#732706` |
| Trabajos | azul acero | `#5F7884` |
| Qué hacemos | terracota | `#B65534` |
| Sobre Breadman | ciruela | `#6F4B52` |
| Contacto | slate | `#283035` |
| Overlay "Ver trabajo" | negro | `#101010` |

### Colores — texto / acento (el acento cambia por sección para contrastar con su fondo)
| Uso | Hex |
|---|---|
| Acento base / marca (azul niebla) | `#899EAA` |
| Acento claro (celeste) | `#B7D0DE` |
| Acento Trabajos | `#C9DCE6` |
| Acento Qué hacemos (crema/arena) | `#E7CBAD` |
| Acento Sobre | `#C6D2DB` |
| Acento overlay caso | `#C9D6DE` |
| Azul acero (bordes/labels secundarios) | `#5F7884` |
| Texto sobre botón de acento (oscuro) | `#16191c` |
| Fondo tarjeta portafolio (desktop) | `#263038` |
| Fondo tarjeta portafolio hover (desktop) | `#2C3841` |
| Fondo panel chat | `#1b1f23` |
| Placeholder de inputs | `#5F7884` |
| Texto de mensajes del bot | `#DDE6EA` |

Mapa de acento por índice de sección (desktop): `['#899EAA', '#B7D0DE', '#C9DCE6', '#E7CBAD', '#C6D2DB', '#899EAA']`; con un caso abierto el acento pasa a `#C9D6DE`.

Las transparencias del texto secundario se logran con el color de acento a distintos alfas, p. ej. `rgba(183,208,222,.5)` para links de nav inactivos, `.85`–`.92` para párrafos, `.55`–`.6` para metadatos.

### Tipografía
- **Única familia:** `'JetBrains Mono', monospace` (Google Fonts). Pesos usados: 100, 200, 300, 400, 500, 700, más cursivas 100–500.
- **Títulos (h1):** JetBrains Mono, **italic**, weight **200**, `letter-spacing: .005em–.02em`, `line-height: 1.03–1.1`. Tamaños desktop: 70px (Home), 50–52px (Trabajos/Contacto), 46px (Qué hacemos), 44px (caso). Móvil: 38–42px.
- **Body / párrafos:** weight 400, 15–17px desktop, 12–15px móvil, `line-height: 1.55–1.7`.
- **Nav / botones / labels:** weight 400 (inactivo) o 700 (activo/actual), 16px desktop.
- **Isotipo "Estudio de diseño" (intro):** `letter-spacing: 0.34em` (desktop), `.06em` (móvil).
- **Labels de sección (p. ej. "DISEÑO SONORO"):** uppercase, 10px, `letter-spacing: .14em–.16em`.

### Espaciado y layout
- **Ancho máximo de contenido (desktop):** `1440px`, centrado. Padding horizontal de secciones: `max(56px, calc((100% - 1440px) / 2))`.
- **Alto máximo de "escenario" de sección (desktop):** `800px`, centrado verticalmente (`margin:auto`).
- **Padding vertical de nav (desktop):** `32px`.
- **Gap del nav horizontal:** `44px` entre links.
- **Grilla de portafolio (desktop):** `grid-template-columns: repeat(3, 1fr); gap: 22px`. Tarjetas con `aspect-ratio: 1.85`.
- **Grilla de servicios "Qué hacemos" (desktop):** `grid-template-columns: 64px 1fr 430px; gap: 28px`, filas separadas por `border-bottom: 1px solid rgba(231,203,173,.26)`.
- **Contacto (desktop):** `grid-template-columns: 1fr 1fr; gap: 90px`.
- **Padding de secciones (móvil):** `24px` laterales; el contenido scrollea dentro de cada hoja.
- **Franjas inferiores (móvil):** 4 franjas de color en `position:fixed; bottom:0`, alto configurable (default **9px**, rango 5–16px).

### Radios de borde
- Botones "pill" / CTAs redondos: `border-radius: 999px`.
- Tarjetas de portafolio: `16px`. Overlay de caso e imagen: `18px`. Inputs: `10–12px`. Panel de chat: `18px`. Chip de audio: `12–14px`.

### Sombras
- Botón flotante de chat (FAB): `0 8px 26px rgba(0,0,0,.4)` (desktop) / `.45` (móvil).
- Panel de chat: `0 18px 50px rgba(0,0,0,.55)` (desktop) / `.6` (móvil).

### Breakpoint
- **820px**: ≥820 → Desktop; <820 → Mobile.

---

## Screens / Views

> Ambas versiones cubren las mismas 5 secciones de navegación + intro + overlay de caso. Los índices de sección son: `0` Inicio (intro), `1` Home, `2` Trabajos, `3` Qué hacemos, `4` Sobre, `5` Contacto.

### 0 · Inicio (intro / splash)
- **Propósito:** portada de entrada; el usuario "entra" al sitio.
- **Desktop:** fondo `#283035`. Fila centrada con: isotipo/logotipo Breadman (`#899EAA`, ancho 210px), un **botón circular de anillos concéntricos** (SVG, 240px: círculos r=97/86/75 con stroke `#899EAA` a opacidades 0.4/0.6/0.9, y un punto central r=66 relleno que aparece **al hover**), y el texto "Estudio de diseño" (`letter-spacing:.34em`).
- **Mobile:** logotipo (170px), **botón de pulso** circular de 180px (anillo punteado que gira + disco central sólido `#899EAA`, con animación de "pulso"), y "Estudio de diseño" abajo. Layout `space-between` en columna.
- **Interacción:** clic en el botón central → va a **Home** (sección 1). Marca `sessionStorage` como visitado (`bm-d-visited` desktop / `bm-visited` móvil) para no repetir el intro. Prop `alwaysShowIntro` (default true) fuerza mostrar el intro siempre.

### 1 · Home
- **Propósito:** mensaje de marca + CTA al portafolio.
- **Contenido:** h1 `DISEÑO—MOTION / WEB—SONIDO` (italic, con `<br>`), párrafo "Marcas que funcionan en imagen, movimiento y sonido.", botón pill "Ver Trabajos".
- **Desktop:** nav horizontal arriba (Home resaltado en 700), contenido centrado verticalmente. Fondo `#732706`, acento `#B7D0DE`.
- **Mobile:** header con botón hamburguesa (abre menú), logotipo grande centrado, título, párrafo, botón "Ver Trabajos" con borde. Abajo un botón de flecha "siguiente sección". Los elementos entran con un **reveal escalonado** (`data-reveal="0..4"`, delays 250ms incrementales).
- **CTA:** "Ver Trabajos" → Trabajos (sección 2).

### 2 · Trabajos (Portafolio)
- **Propósito:** listar casos y filtrarlos.
- **Contenido:** h1 "TRABAJOS", intro "Casos de diseño, branding, web y motion. Sectores: arquitectura, salud, finanzas, música y cultura.", filtros pill (**Todo / Branding / Web / Audio**) y grilla de casos.
- **Desktop:** filtros como botones pill con `data-active`; grilla de 3 columnas. Cada tarjeta muestra título (700, `#B7D0DE`) y tags. Hay una tarjeta final punteada "+ próximos casos". **Hover de tarjeta:** `translateY(-5px)` + fondo pasa de `#263038` a `#2C3841` (transición 300ms).
- **Mobile:** filtros como chips (visuales), tarjetas apiladas en columna con gap 28px, con un bloque de imagen (250px) y título/tags debajo. Entrada con reveal escalonado. **Active de tarjeta:** `scale(0.98)`.
- **Interacción:** clic en tarjeta → abre overlay **"Ver trabajo"** con el caso correspondiente.
- **Datos de casos (desktop, 5):** Austral Arquitectura (branding·web), Niukid (identidad·motion·sonido), Claroscuro Records (identidad·sonido), RQ Medical (branding·ilustración), Campo Capital (branding·web). El filtro se aplica por categorías `['branding','web','audio']`.
- **Datos de casos (móvil, 2):** Austral Arquitectura y Niukid.

### Overlay · Ver trabajo (detalle de caso)
- **Propósito:** detalle de un proyecto con imagen, descripción, reproductor de audio opcional y navegación anterior/siguiente.
- **Desktop:** overlay fullscreen `z-index:60`, fondo negro con imagen (placeholder drag-and-drop) + capa oscura `rgba(16,16,16,.6)`. Header con logo + botón cerrar (X). Título italic 44px, tags, descripción, chip de audio opcional, botón "Visitar Sitio ↗". Footer con controles "← Anterior" / "Siguiente →". Aparece por opacidad (transición 500ms).
- **Mobile:** overlay `z-index:300` que entra deslizando desde la izquierda (`translateX(-100%) → 0`, 500ms). Contenido: título, tags, descripción, "Qué se hizo", chip de audio opcional, botón "Visitar Sitio", nav anterior/siguiente.
- **Reproductor de audio:** solo si el caso tiene audio. Botón play/pause (alterna íconos), barra de progreso clicable (**seek** por posición del clic), tiempos `actual / total`. Usa un `<audio>` oculto; sincroniza `src`, `timeupdate`, `loadedmetadata`, `ended`.

### 3 · Qué hacemos (Servicios)
- **Propósito:** listar los 5 servicios.
- **Contenido:** h1 "QUÉ HACEMOS", intro "Servicios integrados según lo que necesite la marca.", y lista numerada 01–05:
  1. **Identidad visual y branding** — "Marcas desde cero o rediseños: logo, sistema, aplicaciones."
  2. **Diseño web** — "Sitios que se ven bien y funcionan: portafolios, marcas, e-commerce."
  3. **Motion graphics** — "Piezas en movimiento para redes, web y presentaciones."
  4. **Dirección creativa** — "La mirada completa: concepto, estética y coherencia de principio a fin."
  5. **Diseño sonoro** — "Identidad de audio, música para piezas audiovisuales, logo sonoro."
- **Desktop:** filas en grilla `64px 1fr 430px` (número · título · descripción) separadas por líneas finas. Fondo `#B65534`, acento `#E7CBAD`.
- **Mobile:** filas en grilla `52px 1fr` (número arriba, título+descripción). Fondo `#B65534`, acento `#D9B395`.

### 4 · Sobre Breadman
- **Propósito:** historia y posicionamiento del estudio.
- **Contenido:** h1 "SOBRE BREADMAN" + dos párrafos:
  - "Breadman es un estudio de diseño y dirección creativa fundado por Fernando, con base en el Valle del Aconcagua. Trabajamos en identidad visual, branding, web design, motion graphics y sonido — todo integrado como una sola disciplina."
  - "Venimos de años de trabajo en sectores distintos: arquitectura, salud, finanzas y cultura. Creemos que las marcas fuertes se construyen con método, criterio y las manos en el barro. Sin sobreproducciones, sin jerga. Bien hechas y a tiempo."
- **Fondo:** `#6F4B52` con imagen de fondo (`assets/sobre-fondo.png` en desktop, `assets/sobre-silueta.png` en móvil) a `object-fit:cover; opacity:.85`. Acento `#C6D2DB` (desktop) / `#899EAA` (móvil). El contenido va sobre la imagen (`z-index`).

### 5 · Contacto
- **Propósito:** captar leads con un formulario.
- **Contenido:** h1 "CONTACTO", intro "¿Proyecto nuevo? Cuéntanos. Respondemos rápido.", formulario (**Nombre, Email, Tipo de proyecto, Mensaje**), botón "Enviar", y línea "Email directo · Instagram · Facebook".
- **Desktop:** grilla 2 columnas (texto | formulario), footer centrado "Hecho con método y tiempo © 2026 Breadman.Studio".
- **Mobile:** formulario en columna, luego links, luego logotipo pequeño y el footer en dos líneas.
- **Interacción:** al enviar, el botón hace un **pulso** (`bmBtnPulse` 500ms) y aparece el texto de confirmación "Recibido. Te respondemos pronto." (estado `sent`). No hay envío real de datos definido — implementar POST al backend del codebase.

### Menú (solo mobile)
- **Propósito:** navegación principal en móvil.
- **Comportamiento:** overlay fullscreen `z-index:400`, fondo `#283035`. Se abre desde el botón hamburguesa presente en cada hoja. Ítems centrados verticalmente con reveal escalonado (`data-mi`, delays 250ms): **Home, Trabajos, Qué hacemos, Sobre Breadman, Contacto**. El ítem de la sección actual se resalta en `#D9B395`, el resto en `#899EAA`. Botón X arriba a la derecha para cerrar. Al elegir un ítem, cierra el menú y navega (con un pequeño delay de 250ms).
- En desktop, la navegación equivalente es el **nav horizontal** siempre visible en la parte superior de cada sección.

### Asistente / Chat (ambas versiones)
- **Propósito:** vendedor + asistente + secretario con IA. Resuelve dudas de servicios, orienta presupuestos y ayuda a agendar / dejar contacto.
- **Trigger:** botón flotante circular (FAB) 58–60px, `position:fixed`, esquina inferior derecha, color = acento de la sección actual, ícono de burbuja de chat.
  - Desktop: siempre visible (`z-index:72`).
  - Mobile: `z-index:350`; se **oculta** en el intro (sección 0), con el menú abierto o con un caso abierto.
- **Panel:** Desktop → tarjeta 360px anclada abajo a la derecha (`z-index:72`), aparece con opacidad + `translateY`. Mobile → panel casi fullscreen (`left/right:12px; top:70px; bottom:12px`, `z-index:360`). Cabecera con "Asistente Breadman" / "Ventas · consultas · agenda" sobre el color de acento, botón cerrar. Lista de mensajes (burbujas: usuario alineado a la derecha con fondo de acento y texto `#16191c`; bot alineado a la izquierda con `rgba(255,255,255,.07)` y texto `#DDE6EA`). Indicador "escribiendo…" mientras carga. Input + botón enviar (Enter envía).
- **IA:** llama a un LLM (en el prototipo, `window.claude.complete({ system, messages, max_tokens: 600 })`). Reemplazar por el proveedor/endpoint del codebase. Mensaje de bienvenida inicial del asistente: "Hola, soy el asistente de Breadman Studio. Te ayudo con servicios, presupuestos o a coordinar una reunión. ¿Qué tienes en mente?"
- **System prompt (usar tal cual como base):** "Eres el asistente virtual de Breadman Studio, un estudio de diseño y dirección creativa con base en el Valle del Aconcagua, Chile, fundado por Fernando. Servicios: identidad visual y branding, diseño web, motion graphics, dirección creativa y diseño sonoro. Actúas como vendedor, asistente y secretario: resuelves dudas sobre los servicios, orientas presupuestos y ayudas a agendar o dejar contacto. Responde en español, en tono cercano, claro y breve (2-4 frases). Para precios exactos, pide detalles del proyecto (alcance, plazos) y ofrece coordinar una reunión o usar la sección Contacto. No inventes datos, clientes ni cifras que no conozcas."
- **En caso de error de red:** mostrar "Uy, tuve un problema para responder. Escríbenos por la sección Contacto y te contactamos pronto."

---

## Interactions & Behavior

### Navegación entre secciones
- **Desktop:** cada sección es un `[data-sec]` en `position:absolute; inset:0` que se muestra/oculta por `opacity` (**crossfade de 850ms ease**) + `pointer-events`. Solo una activa a la vez. La nav superior salta directo a cualquier sección.
- **Mobile:** cada sección es una "hoja" (`[data-sheet]`) apilada por `z-index` que entra/sale con `transform: translateY()` (**500ms cubic-bezier(.65,0,.35,1)**). La navegación es secuencial por gesto:
  - **Wheel / swipe vertical** avanza o retrocede de sección (con bloqueo de 550ms entre cambios, y solo si el scroll interno de la hoja está al tope/fondo).
  - **Arrastre** de la hoja con seguimiento del dedo y umbral de confirmación (movimiento > 22% de la pantalla o velocidad alta).
  - Las **franjas** de color inferiores son un affordance clicable que avanza a la siguiente sección; su alto se reduce a `0` a medida que avanzas (`transition: height 500ms`).

### Animaciones y transiciones (valores exactos)
- `bmHomeBg` — animación de color de fondo en loop, **60s ease-in-out infinite**, ciclo: `#732706 → #5F7884 → #6F4B52 → #283035 → #B65534 → #732706` (aplicada en Inicio y Home). Considerar `prefers-reduced-motion` para desactivarla.
- Crossfade de secciones (desktop): `opacity 850ms ease`.
- Deslizamiento de hojas (móvil): `transform 500ms cubic-bezier(.65,0,.35,1)`.
- Reveal escalonado de contenido (móvil): `opacity + translateY(18px→0)` en 500ms, delays 250/500/750/1000ms según `data-reveal`/`data-mi`.
- Menú (móvil): fade 500ms; ítems con reveal escalonado.
- Overlay de caso: desktop opacidad 500ms; móvil `translateX(-100%→0)` 500ms.
- `bmBtnPulse` — pulso del botón enviar / FAB: `scale(1→0.95→1)` en 500ms.
- `bmPulse` (móvil intro) — `scale(1→1.03→1)` 1000ms infinite. `bmSpin` — rotación del anillo punteado, 16000ms lineal infinite.
- Hover tarjeta portafolio: `transform + background 300ms`. Botones/pills: `background/color 250ms`. FAB: `transform 250ms`, `background 500ms`.
- Punto central del botón intro (desktop): aparece con `opacity 650ms` al hover del botón.

### Estados de interacción clave (solicitados)
- **Isotipo abre menú (móvil):** el header de cada hoja tiene un botón hamburguesa que abre el menú fullscreen. (El logotipo/isotipo actúa como "volver a Home".)
- **Pulso central lleva a Portafolio:** en el intro, el botón circular (anillos en desktop, disco pulsante en móvil) navega a Home; desde Home el CTA "Ver Trabajos" lleva al Portafolio. El punto/disco central es el elemento de acción principal del splash.
- **Tarjetas escalonadas del portafolio:** en móvil las tarjetas y el resto del contenido entran con el reveal escalonado (delays 250ms). En desktop la grilla de 3 columnas anima al hover (elevación + cambio de fondo).

---

## State Management
Variables de estado (por versión):
- `sec` / `cur` — índice de sección activa (0–5).
- `visited` — si ya pasó el intro (persistido en `sessionStorage`: `bm-d-visited` desktop, `bm-visited` móvil).
- `menu` (móvil) — menú abierto.
- `caseOpen`, `caseIdx` — overlay de caso abierto y cuál.
- `filter` (desktop) — `'all' | 'branding' | 'web' | 'audio'`.
- `sent` / `sending` — estado del formulario de contacto.
- `playing`, `audioCur`, `audioDur` — reproductor de audio del caso.
- `chatOpen`, `chatLoading`, `messages[]` — estado del asistente.

Transiciones y disparadores: navegación (gesto/click/nav) cambia `sec`/`cur` con bloqueo temporal; abrir caso setea `caseOpen`+`caseIdx` y detiene el audio; enviar formulario dispara el pulso y setea `sent`; enviar chat agrega mensaje del usuario, marca `chatLoading`, llama al LLM y agrega la respuesta.

Data fetching: (1) el **chat** requiere un endpoint LLM; (2) el **formulario de contacto** debe hacer POST a un backend/servicio de email (no implementado en el prototipo).

Props configurables observados: `alwaysShowIntro` (bool, default true), `whatsapp` (string, número — **el ícono de WhatsApp fue removido del diseño final**, pero el número puede reusarse para el contacto), `stripeHeight` (móvil, px, default 9, rango 5–16).

## Assets
En `assets/`:
- `logo.svg` — logotipo Breadman (también embebido como paths SVG en los componentes; el logotipo desktop se monta vía el componente `BmLogo`).
- `sobre-fondo.png` — imagen de fondo de la sección "Sobre Breadman" (desktop).
- `sobre-silueta.png` — imagen de fondo de "Sobre Breadman" (móvil).

Las imágenes del portafolio (fondo y foto del caso) son **placeholders drag-and-drop** en el prototipo (`<image-slot>`): el cliente debe proveer las imágenes reales de cada proyecto. Íconos (chat, play/pause, enviar, cerrar, flechas, hamburguesa) son SVG inline simples — reemplazar por el set de íconos del codebase si existe.

Fuente: **JetBrains Mono** vía Google Fonts (`https://fonts.googleapis.com/css2?family=JetBrains+Mono...`).

## Files
Archivos de referencia incluidos en este bundle (dentro de `design_files/`):
- `Breadman.dc.html` — contenedor responsivo (switch desktop/mobile en 820px).
- `Breadman Desktop.dc.html` — experiencia desktop completa (6 secciones + overlay de caso + chat).
- `Breadman Mobile.dc.html` — experiencia mobile completa (hojas deslizables + menú + franjas + overlay + chat).
- `BmLogo.dc.html` — componente del logotipo (props: `color`, `w` ancho, y usado con `fs`/`ls` para el lockup de texto).
- `assets/` — imágenes y logo.

> Nota: `support.js` es el runtime del prototipo y **no** debe portarse; es solo lo que hace funcionar los `.dc.html` en el entorno de diseño.
