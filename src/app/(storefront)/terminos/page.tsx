import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de iMPORTMANIA',
};

export default function TerminosPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">
        Términos y Condiciones
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            1. Objeto
          </h2>
          <p className="text-text-secondary mb-4">
            El presente documento establece los términos y condiciones de uso del sitio web 
            iMPORTMANIA (en adelante, "el Sitio"), propiedad de iMPORTMANIA S.R.L., 
            con domicilio en Av. Corrientes 1234, Ciudad Autónoma de Buenos Aires, Argentina.
          </p>
          <p className="text-text-secondary">
            El acceso y uso del Sitio implica la aceptación plena y sin reservas de estos 
            Términos y Condiciones. Si no estás de acuerdo con los mismos, te solicitamos 
            no utilizar este Sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            2. Proceso de Compra
          </h2>
          <p className="text-text-secondary mb-4">
            El proceso de compra en iMPORTMANIA se realiza de la siguiente manera:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-text-secondary">
            <li>Selección de productos y agregado al carrito de compras</li>
            <li>Revisión del carrito y aplicación de cupones de descuento (si corresponde)</li>
            <li>Ingreso de datos de envío y selección del método de entrega</li>
            <li>Selección del método de pago</li>
            <li>Confirmación del pedido y procesamiento del pago</li>
            <li>Envío de email de confirmación con el número de pedido</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            3. Precios e Impuestos
          </h2>
          <p className="text-text-secondary mb-4">
            Todos los precios publicados en el Sitio están expresados en Pesos Argentinos (ARS) 
            e incluyen IVA. Los precios pueden estar sujetos a cambios sin previo aviso.
          </p>
          <p className="text-text-secondary">
            iMPORTMANIA se reserva el derecho de modificar los precios en cualquier momento, 
            aunque los cambios no afectarán los pedidos ya confirmados y pagos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            4. Formas de Pago
          </h2>
          <p className="text-text-secondary mb-4">
            Los métodos de pago disponibles son:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>MercadoPago:</strong> Tarjetas de crédito y débito, dinero en cuenta. 
              El pago se procesa de forma segura a través de la plataforma de MercadoPago.
            </li>
            <li>
              <strong>Transferencia bancaria:</strong> Con un 10% de descuento. 
              El pedido se procesará una vez confirmado el pago (1-2 días hábiles).
            </li>
            <li>
              <strong>Efectivo:</strong> Solo disponible para retiro en persona. 
              El pago se realiza al momento de retirar el pedido.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            5. Envíos
          </h2>
          <p className="text-text-secondary mb-4">
            Realizamos envíos a todo el territorio argentino a través de:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Correo Argentino</li>
            <li>Andreani</li>
            <li>OCA</li>
            <li>Envío propio (solo AMBA)</li>
          </ul>
          <p className="text-text-secondary mt-4">
            Los tiempos de entrega estimados son:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary mt-2">
            <li>AMBA: 1-3 días hábiles</li>
            <li>Interior del país: 3-7 días hábiles</li>
            <li>Patagonia: 5-10 días hábiles</li>
          </ul>
          <p className="text-text-secondary mt-4">
            El envío es gratuito para compras superiores a $50.000 ARS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            6. Productos Importados
          </h2>
          <p className="text-text-secondary mb-4">
            iMPORTMANIA comercializa productos importados. El cliente reconoce que:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              Las imágenes de los productos son ilustrativas y pueden existir diferencias 
              estéticas menores respecto a las fotografías publicadas.
            </li>
            <li>
              Los productos pueden no contar con garantía oficial del fabricante en Argentina, 
              aunque iMPORTMANIA ofrece garantía de funcionamiento por 90 días.
            </li>
            <li>
              Los manuales e instrucciones pueden estar en idiomas extranjeros.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            7. Responsabilidad del Comprador
          </h2>
          <p className="text-text-secondary mb-4">
            El comprador se compromete a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Proporcionar datos veraces y completos en el proceso de compra</li>
            <li>Verificar la información del pedido antes de confirmarlo</li>
            <li>Estar disponible en la dirección de envío en el horario estimado</li>
            <li>Revisar el producto al momento de la entrega</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            8. Propiedad Intelectual
          </h2>
          <p className="text-text-secondary mb-4">
            Todo el contenido del Sitio (textos, imágenes, logotipos, diseños) es propiedad 
            exclusiva de iMPORTMANIA y se encuentra protegido por las leyes de propiedad 
            intelectual. Queda prohibida su reproducción, distribución o modificación sin 
            autorización expresa.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            9. Modificaciones
          </h2>
          <p className="text-text-secondary mb-4">
            iMPORTMANIA se reserva el derecho de modificar estos Términos y Condiciones en 
            cualquier momento. Los cambios entrarán en vigencia inmediatamente después de 
            su publicación en el Sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            10. Legislación Aplicable y Jurisdicción
          </h2>
          <p className="text-text-secondary mb-4">
            Estos Términos y Condiciones se rigen por las leyes de la República Argentina. 
            Para cualquier controversia que pudiera derivarse de la interpretación o 
            cumplimiento de los presentes términos, las partes se someten a la jurisdicción 
            de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            11. Contacto
          </h2>
          <p className="text-text-secondary">
            Para consultas sobre estos Términos y Condiciones, podés contactarnos a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary mt-2">
            <li>Email: legales@importmania.com.ar</li>
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
