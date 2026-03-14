import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
  Link,
  Hr,
  Table,
  TableRow,
  TableCell,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderConfirmationProps {
  orderNumber: string;
  total: string;
  items: OrderItem[];
  shippingMethod: string;
  estimatedDelivery?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function OrderConfirmation({
  orderNumber,
  total,
  items,
  shippingMethod,
  estimatedDelivery,
}: OrderConfirmationProps) {
  const shippingMethodLabels: Record<string, string> = {
    HOME_DELIVERY: 'Envío a domicilio',
    ANDREANI: 'Andreani',
    OCA: 'OCA',
    CORREO_ARGENTINO: 'Correo Argentino',
    PICKUP: 'Retiro en persona',
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logo}>
            <Img
              src={`${baseUrl}/logo.png`}
              alt="iMPORTMANIA"
              width="180"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Heading */}
          <Heading style={heading}>¡Gracias por tu compra!</Heading>

          <Text style={text}>
            Tu pedido <strong>#{orderNumber}</strong> fue confirmado exitosamente.
          </Text>

          <Text style={text}>
            Te enviaremos otro email cuando tu pedido sea despachado.
          </Text>

          {/* Número de pedido destacado */}
          <Section style={orderNumberSection}>
            <Text style={orderNumberLabel}>Número de pedido</Text>
            <Text style={orderNumberValue}>{orderNumber}</Text>
          </Section>

          {/* Tabla de items */}
          <Section style={itemsSection}>
            <Heading style={itemsHeading}>Detalle del pedido</Heading>
            <Table style={table}>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={tableCell}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQuantity}>Cantidad: {item.quantity}</Text>
                  </TableCell>
                  <TableCell style={tableCellPrice}>{item.price}</TableCell>
                </TableRow>
              ))}
            </Table>
          </Section>

          {/* Resumen de totales */}
          <Section style={totalsSection}>
            <Section style={totalRow}>
              <Text style={totalLabel}>Subtotal</Text>
              <Text style={totalValue}>{total}</Text>
            </Section>
            <Section style={totalRow}>
              <Text style={totalLabel}>Envío ({shippingMethodLabels[shippingMethod] || shippingMethod})</Text>
              <Text style={totalValue}>Calculado en checkout</Text>
            </Section>
            <Hr style={totalHr} />
            <Section style={totalRow}>
              <Text style={totalLabelBold}>Total</Text>
              <Text style={totalValueBold}>{total}</Text>
            </Section>
          </Section>

          {/* Entrega estimada */}
          {estimatedDelivery && (
            <Section style={deliverySection}>
              <Text style={deliveryText}>
                📦 Entrega estimada: <strong>{estimatedDelivery}</strong>
              </Text>
            </Section>
          )}

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/cuenta/pedidos`}>
              Ver estado de tu pedido
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Tenés dudas? Respondé este email o contactanos por WhatsApp.
            </Text>
            <Text style={footerLinks}>
              <Link href={`${baseUrl}/terminos`} style={footerLink}>Términos y condiciones</Link>
              {' | '}
              <Link href={`${baseUrl}/privacidad`} style={footerLink}>Política de privacidad</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmation;

// Estilos
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '40px 20px',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const logo = {
  padding: '30px',
  textAlign: 'center' as const,
  backgroundColor: '#00BFFF',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333',
  textAlign: 'center' as const,
  padding: '30px 30px 20px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
  padding: '0 30px',
  marginBottom: '16px',
  textAlign: 'center' as const,
};

const orderNumberSection = {
  padding: '20px 30px',
  backgroundColor: '#E3F2FD',
  margin: '20px 30px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const orderNumberLabel = {
  fontSize: '14px',
  color: '#1976D2',
  marginBottom: '4px',
};

const orderNumberValue = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1976D2',
};

const itemsSection = {
  padding: '20px 30px',
};

const itemsHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '16px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableCell = {
  padding: '12px 0',
  borderBottom: '1px solid #eeeeee',
  textAlign: 'left' as const,
};

const tableCellPrice = {
  padding: '12px 0',
  borderBottom: '1px solid #eeeeee',
  textAlign: 'right' as const,
  fontWeight: 'bold' as const,
};

const itemName = {
  fontSize: '14px',
  color: '#333333',
  marginBottom: '4px',
};

const itemQuantity = {
  fontSize: '13px',
  color: '#999999',
};

const totalsSection = {
  padding: '20px 30px',
  backgroundColor: '#f9f9f9',
  margin: '20px 30px',
  borderRadius: '8px',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '14px',
  color: '#666666',
};

const totalValue = {
  fontSize: '14px',
  color: '#333333',
  fontWeight: 'bold' as const,
};

const totalLabelBold = {
  fontSize: '16px',
  color: '#333333',
  fontWeight: 'bold' as const,
};

const totalValueBold = {
  fontSize: '18px',
  color: '#00BFFF',
  fontWeight: 'bold' as const,
};

const totalHr = {
  border: 'none',
  borderTop: '1px solid #dddddd',
  margin: '12px 0',
};

const deliverySection = {
  padding: '16px 30px',
  backgroundColor: '#E8F5E9',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const deliveryText = {
  fontSize: '14px',
  color: '#2E7D32',
};

const buttonContainer = {
  padding: '30px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#00BFFF',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eeeeee',
  margin: '30px',
};

const footer = {
  padding: '30px',
  backgroundColor: '#f9f9f9',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '14px',
  color: '#666666',
  marginBottom: '12px',
};

const footerLinks = {
  fontSize: '13px',
  color: '#999999',
};

const footerLink = {
  color: '#00BFFF',
  textDecoration: 'none',
};
