import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de iMPORTMANIA',
};

export default function PrivacidadPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">
        Política de Privacidad
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            1. Introducción
          </h2>
          <p className="text-text-secondary mb-4">
            En iMPORTMANIA S.R.L. (en adelante, "iMPORTMANIA", "nosotros" o "el Sitio"), 
            nos comprometemos a proteger tu privacidad y garantizar la seguridad de tus 
            datos personales. Esta Política de Privacidad describe cómo recopilamos, 
            usamos y protegemos tu información personal de acuerdo con la Ley 25.326 de 
            Protección de Datos Personales de la República Argentina.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            2. Datos que Recopilamos
          </h2>
          <p className="text-text-secondary mb-4">
            Podemos recopilar los siguientes tipos de datos personales:
          </p>
          <h3 className="text-xl font-semibold mt-4 mb-2 text-text-primary">
            2.1. Datos que nos proporcionás directamente:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Nombre y apellido</li>
            <li>Dirección de email</li>
            <li>Número de teléfono</li>
            <li>Dirección de envío (calle, número, ciudad, provincia, código postal)</li>
            <li>Datos de pago (procesados de forma segura por terceros)</li>
            <li>Preferencias de comunicación</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-text-primary">
            2.2. Datos recopilados automáticamente:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Dirección IP</li>
            <li>Tipo de navegador y dispositivo</li>
            <li>Páginas visitadas en el Sitio</li>
            <li>Fecha y hora de acceso</li>
            <li>Cookies y tecnologías similares</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            3. Uso de los Datos
          </h2>
          <p className="text-text-secondary mb-4">
            Utilizamos tus datos personales para los siguientes fines:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Procesar y gestionar tus pedidos de compra</li>
            <li>Comunicarnos sobre el estado de tus pedidos</li>
            <li>Enviar notificaciones relacionadas con tu cuenta</li>
            <li>Responder a tus consultas y solicitudes de atención al cliente</li>
            <li>Enviar comunicaciones comerciales (solo con tu consentimiento)</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Prevenir fraudes y garantizar la seguridad del Sitio</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            4. Cookies y Analytics
          </h2>
          <p className="text-text-secondary mb-4">
            Nuestro Sitio utiliza cookies y tecnologías similares para mejorar tu experiencia:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>Cookies necesarias:</strong> Esenciales para el funcionamiento del Sitio
            </li>
            <li>
              <strong>Cookies de analytics:</strong> Nos ayudan a entender cómo usás el Sitio 
              (Google Analytics)
            </li>
            <li>
              <strong>Cookies de marketing:</strong> Para mostrarte publicidad relevante 
              (Facebook Pixel, TikTok Pixel)
            </li>
          </ul>
          <p className="text-text-secondary mt-4">
            Podés configurar tu navegador para rechazar las cookies, aunque esto puede 
            afectar la funcionalidad del Sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            5. Compartir Datos con Terceros
          </h2>
          <p className="text-text-secondary mb-4">
            Podemos compartir tus datos personales con los siguientes terceros:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>Procesadores de pago:</strong> MercadoPago para procesar transacciones
            </li>
            <li>
              <strong>Servicios de envío:</strong> Correo Argentino, Andreani, OCA para 
              entregar tus pedidos
            </li>
            <li>
              <strong>Proveedores de servicios:</strong> Hosting, email marketing, analytics
            </li>
            <li>
              <strong>Autoridades:</strong> Cuando sea requerido por ley o orden judicial
            </li>
          </ul>
          <p className="text-text-secondary mt-4">
            No vendemos ni alquilamos tus datos personales a terceros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            6. Derechos del Usuario (ARCO)
          </h2>
          <p className="text-text-secondary mb-4">
            De acuerdo con la Ley 25.326, tenés los siguientes derechos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre vos
            </li>
            <li>
              <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
            </li>
            <li>
              <strong>Cancelación:</strong> Solicitar la eliminación de tus datos
            </li>
            <li>
              <strong>Oposición:</strong> Oponerte al uso de tus datos para ciertos fines
            </li>
          </ul>
          <p className="text-text-secondary mt-4">
            Para ejercer estos derechos, podés contactarnos a:
            <br />
            Email: privacidad@importmania.com.ar
            <br />
            Dirección: Av. Corrientes 1234, CABA, Argentina
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            7. Seguridad de los Datos
          </h2>
          <p className="text-text-secondary mb-4">
            Implementamos medidas de seguridad técnicas y organizativas para proteger 
            tus datos personales:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Encriptación SSL/TLS para todas las transacciones</li>
            <li>Almacenamiento seguro de datos en servidores protegidos</li>
            <li>Acceso restringido a datos personales solo para personal autorizado</li>
            <li>Monitoreo regular de vulnerabilidades</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            8. Conservación de Datos
          </h2>
          <p className="text-text-secondary mb-4">
            Conservamos tus datos personales durante el tiempo necesario para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Cumplir con los fines descritos en esta política</li>
            <li>Cumplir con obligaciones legales (ej: facturación por 10 años)</li>
            <li>Resolver disputas y hacer cumplir nuestros acuerdos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            9. Transferencias Internacionales
          </h2>
          <p className="text-text-secondary mb-4">
            Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de 
            Argentina. En tales casos, nos aseguramos de que existan garantías adecuadas 
            para la protección de tus datos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            10. Menores de Edad
          </h2>
          <p className="text-text-secondary mb-4">
            Nuestro Sitio no está dirigido a menores de 18 años. No recopilamos 
            intencionalmente datos personales de menores. Si descubrimos que hemos 
            recopilado datos de un menor, los eliminaremos inmediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            11. Modificaciones a esta Política
          </h2>
          <p className="text-text-secondary mb-4">
            Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos 
            sobre cambios significativos mediante email o un aviso destacado en el Sitio. 
            Te recomendamos revisar esta página regularmente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            12. Autoridad de Control
          </h2>
          <p className="text-text-secondary mb-4">
            La autoridad de control en materia de protección de datos personales en 
            Argentina es la Agencia de Acceso a la Información Pública (AAIP). 
            Podés presentar reclamos ante esta autoridad si considerás que tus 
            derechos han sido vulnerados.
          </p>
          <p className="text-text-secondary">
            Más información en: www.argentina.gob.ar/aaip
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            13. Contacto
          </h2>
          <p className="text-text-secondary">
            Para consultas sobre esta Política de Privacidad o para ejercer tus derechos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary mt-2">
            <li>Email: privacidad@importmania.com.ar</li>
            <li>Teléfono: +54 11 1234-5678</li>
            <li>Dirección: Av. Corrientes 1234, CABA, Argentina</li>
          </ul>
        </section>

        <p className="text-sm text-text-secondary mt-12 pt-8 border-t border-border">
          Última actualización: {new Date().toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  );
}
