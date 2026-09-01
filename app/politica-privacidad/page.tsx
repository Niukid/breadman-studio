import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidad | Breadman Studio",
  description:
    "Política de privacidad de Breadman Studio: cómo recopilamos, usamos y protegemos tus datos, incluyendo el uso de WhatsApp Business.",
  alternates: { canonical: `${SITE_URL}/politica-privacidad` },
};

export default function PrivacyPolicyPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#101010", color: "#EDEAE2" }}
    >
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a
          href="/"
          className="text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          ← Breadman Studio
        </a>

        <h1 className="text-3xl font-medium mt-8 mb-2">
          Política de Privacidad
        </h1>
        <p className="text-sm opacity-60 mb-12">
          Última actualización: 31 de agosto de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed opacity-90">
          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              1. Quiénes somos
            </h2>
            <p>
              Breadman Studio (&quot;Breadman&quot;, &quot;nosotros&quot;) es
              una agencia creativa con sede en Valle del Aconcagua, Chile.
              Esta política aplica a los datos que recopilamos a través de
              nuestro sitio web, nuestros canales de contacto y nuestros
              agentes automatizados, incluyendo la comunicación por WhatsApp
              Business Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              2. Qué datos recopilamos
            </h2>
            <p>
              Cuando nos contactas por WhatsApp, formulario web o correo
              electrónico, podemos recopilar: tu número de teléfono, nombre
              de perfil, el contenido de los mensajes que nos envías, y
              cualquier información que compartas voluntariamente durante la
              conversación (por ejemplo, detalles de un proyecto o solicitud
              de diseño).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              3. Para qué usamos tus datos
            </h2>
            <p>Usamos esta información exclusivamente para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Responder tus consultas y solicitudes.</li>
              <li>
                Generar piezas de diseño, propuestas o cotizaciones que nos
                solicites.
              </li>
              <li>
                Dar seguimiento comercial a proyectos en curso con Breadman
                Studio o sus marcas asociadas.
              </li>
              <li>
                Mejorar nuestros procesos internos de atención y
                automatización.
              </li>
            </ul>
            <p className="mt-2">
              No usamos tus datos para fines distintos a los aquí descritos,
              ni los vendemos a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              4. Con quién compartimos tus datos
            </h2>
            <p>
              Para operar nuestros servicios, trabajamos con proveedores
              tecnológicos que procesan datos en nuestro nombre, bajo sus
              propios términos de privacidad y seguridad:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Meta / WhatsApp Business Platform</strong> — para el
                envío y recepción de mensajes.
              </li>
              <li>
                <strong>n8n</strong> — plataforma de automatización que
                procesa los mensajes para generar respuestas.
              </li>
              <li>
                <strong>GitHub</strong> — almacenamiento técnico del código y
                los datos de las solicitudes de diseño procesadas.
              </li>
            </ul>
            <p className="mt-2">
              Estos proveedores actúan como encargados de tratamiento y no
              están autorizados a usar tus datos para sus propios fines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              5. Conservación de datos
            </h2>
            <p>
              Conservamos tus datos mientras exista una relación comercial o
              de contacto activa, y por el tiempo adicional necesario para
              cumplir obligaciones legales o resolver eventuales disputas.
              Puedes solicitar la eliminación de tus datos en cualquier
              momento (ver sección 6).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              6. Tus derechos
            </h2>
            <p>
              De acuerdo con la Ley N° 19.628 sobre Protección de la Vida
              Privada (Chile), tienes derecho a acceder, rectificar, cancelar
              y oponerte al tratamiento de tus datos personales. Para
              ejercer estos derechos, escríbenos a{" "}
              <a
                href="mailto:contacto@breadman.studio"
                className="underline hover:opacity-70"
              >
                contacto@breadman.studio
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              7. Cambios a esta política
            </h2>
            <p>
              Podemos actualizar esta política ocasionalmente. La fecha de la
              última actualización aparece al inicio de este documento.
              Te recomendamos revisarla periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-2 opacity-100">
              8. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre esta política o sobre cómo tratamos
              tus datos, contáctanos en{" "}
              <a
                href="mailto:contacto@breadman.studio"
                className="underline hover:opacity-70"
              >
                contacto@breadman.studio
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
