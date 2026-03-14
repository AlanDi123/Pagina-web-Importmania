import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Devoluciones',
  description: 'Política de devoluciones y reembolsos de iMPORTMANIA',
};

export default function DevolucionesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">
        Política de Devoluciones y Reembolsos
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            1. Derecho de Devolución
          </h2>
          <p className="text-text-secondary mb-4">
            De acuerdo con la Ley 24.240 de Defensa del Consumidor, tenés un plazo de 
            <strong> 10 (diez) días corridos</strong> desde la recepción del producto 
            para ejercer tu derecho de devolución sin necesidad de invocar causa alguna.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            2. Condiciones para la Devolución
          </h2>
          <p className="text-text-secondary mb-4">
            Para que la devolución sea procesada, el producto debe cumplir con las 
            siguientes condiciones:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Estar en su embalaje original sin abrir</li>
            <li>Incluir todos los accesorios, manuales y documentos originales</li>
            <li>No haber sido usado o manipulado</li>
            <li>Contar con todas sus etiquetas y precintos de seguridad</li>
            <li>Estar en perfectas condiciones, sin daños ni defectos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            3. Proceso de Devolución
          </h2>
          <p className="text-text-secondary mb-4">
            Para iniciar una devolución, seguí estos pasos:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>Contactanos:</strong> Envianos un email a 
              devoluciones@importmania.com.ar o escribinos por WhatsApp al 
              +54 11 1234-5678 dentro de los 10 días corridos desde la recepción.
            </li>
            <li>
              <strong>Proporcioná información:</strong> Indicá tu número de pedido, 
              el producto que querés devolver y el motivo de la devolución.
            </li>
            <li>
              <strong>Recibí instrucciones:</strong> Te enviaremos las instrucciones 
              para el envío del producto, incluyendo la dirección de devolución.
            </li>
            <li>
              <strong>Envíá el producto:</strong> Empaquetá el producto de forma segura 
              y envialo a la dirección indicada. Guardá el comprobante de envío.
            </li>
            <li>
              <strong>Recepción y verificación:</strong> Una vez recibido, verificaremos 
              que el producto cumpla con las condiciones establecidas (3-5 días hábiles).
            </li>
            <li>
              <strong>Procesamiento del reembolso:</strong> Si la devolución es aprobada, 
              procesaremos el reembolso en un plazo de 10 días hábiles.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            4. Costos de Envío de Devolución
          </h2>
          <p className="text-text-secondary mb-4">
            Los costos de envío de la devolución serán abonados por:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>El comprador:</strong> Cuando la devolución es por arrepentimiento 
              o cambio de opinión.
            </li>
            <li>
              <strong>iMPORTMANIA:</strong> Cuando el producto tiene defectos de fabricación, 
              daños ocurridos durante el envío, o si enviamos un producto incorrecto.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            5. Reembolsos
          </h2>
          <p className="text-text-secondary mb-4">
            Los reembolsos se procesarán de la siguiente manera:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>
              <strong>MercadoPago:</strong> El reembolso se acreditará en la misma cuenta 
              de MercadoPago utilizada para la compra. Si el pago fue con tarjeta de 
              crédito, el acreditamiento dependerá del banco emisor (1-30 días hábiles).
            </li>
            <li>
              <strong>Transferencia bancaria:</strong> El reembolso se realizará mediante 
              transferencia a la cuenta bancaria que nos indiques. Deberás proporcionarnos 
              CBU/CVU, nombre del titular y CUIT/CUIL.
            </li>
            <li>
              <strong>Efectivo:</strong> El reembolso se realizará mediante transferencia 
              bancaria.
            </li>
          </ul>
          <p className="text-text-secondary mt-4">
            El monto reembolsado incluirá el precio del producto y los costos de envío 
            originales (si corresponde). Los costos de envío de la devolución serán 
            descontados del reembolso, salvo que la devolución sea por error nuestro o 
            producto defectuoso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            6. Productos No Reembolsables
          </h2>
          <p className="text-text-secondary mb-4">
            No aceptamos devoluciones de los siguientes productos:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Productos digitales una vez descargados o accedidos</li>
            <li>Productos personalizados o hechos a medida</li>
            <li>Productos perecederos o con fecha de vencimiento</li>
            <li>Productos de higiene personal o cuidado íntimo</li>
            <li>Productos cuyo embalaje haya sido violado o abierto</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            7. Productos Defectuosos
          </h2>
          <p className="text-text-secondary mb-4">
            Si recibís un producto con defectos de fabricación o daños:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Contactanos dentro de los 30 días desde la recepción</li>
            <li>Proporcioná fotos o videos que muestren el defecto/daño</li>
            <li>Te ofreceremos: reemplazo del producto, reembolso completo o nota de crédito</li>
            <li>iMPORTMANIA cubrirá todos los costos de envío</li>
          </ul>
          <p className="text-text-secondary mt-4">
            Además del derecho de devolución de 10 días, los productos cuentan con una 
            <strong> garantía de funcionamiento de 90 días</strong> desde la fecha de 
            compra para defectos de fabricación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            8. Cambios
          </h2>
          <p className="text-text-secondary mb-4">
            Si querés cambiar un producto por otro:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>El producto debe cumplir con las condiciones de devolución</li>
            <li>El cambio puede ser por un producto de igual o mayor valor</li>
            <li>Si el nuevo producto tiene mayor valor, deberás abonar la diferencia</li>
            <li>Si tiene menor valor, te acreditaremos la diferencia como nota de crédito</li>
            <li>Los costos de envío del nuevo producto corren por cuenta del comprador</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            9. Plazos
          </h2>
          <p className="text-text-secondary mb-4">
            Resumen de plazos importantes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Derecho de arrepentimiento: 10 días corridos desde la recepción</li>
            <li>Garantía por defectos: 90 días desde la compra</li>
            <li>Verificación del producto devuelto: 3-5 días hábiles</li>
            <li>Procesamiento de reembolso: 10 días hábiles tras la aprobación</li>
            <li>Acreditación en tarjeta de crédito: 1-30 días hábiles (según banco)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            10. Contacto
          </h2>
          <p className="text-text-secondary mb-4">
            Para iniciar una devolución o realizar consultas:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-text-secondary">
            <li>Email: devoluciones@importmania.com.ar</li>
            <li>WhatsApp: +54 11 1234-5678</li>
            <li>Horario de atención: Lunes a Viernes de 9:00 a 18:00 hs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">
            11. Legislación Aplicable
          </h2>
          <p className="text-text-secondary">
            Esta política de devoluciones se rige por la Ley 24.240 de Defensa del 
            Consumidor y sus modificatorias. Para cualquier reclamo, podés contactar 
            a la Dirección de Defensa del Consumidor de tu provincia.
          </p>
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
