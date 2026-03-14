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
} from '@react-email/components';

interface NewOrderAdminProps {
  orderNumber: string;
  total: string;
  customerName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function NewOrderAdmin({ orderNumber, total, customerName }: NewOrderAdminProps) {
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
          <Heading style={heading}>📦 Nuevo pedido recibido</Heading>

          <Text style={text}>
            Se recibió un nuevo pedido en la tienda.
          </Text>

          {/* Detalles del pedido */}
          <Section style={detailsSection}>
            <Section style={detailRow}>
              <Text style={detailLabel}>Número de pedido</Text>
              <Text style={detailValue}>{orderNumber}</Text>
            </Section>
            <Section style={detailRow}>
              <Text style={detailLabel}>Cliente</Text>
              <Text style={detailValue}>{customerName}</Text>
            </Section>
            <Section style={detailRow}>
              <Text style={detailLabel}>Total</Text>
              <Text style={detailValueTotal}>{total}</Text>
            </Section>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/admin/pedidos`}>
              Ver pedido en el admin
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un email automático del sistema de iMPORTMANIA.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default NewOrderAdmin;

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

const detailsSection = {
  padding: '20px 30px',
  backgroundColor: '#E3F2FD',
  margin: '20px 30px',
  borderRadius: '8px',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const detailLabel = {
  fontSize: '14px',
  color: '#1976D2',
};

const detailValue = {
  fontSize: '14px',
  color: '#333333',
  fontWeight: 'bold' as const,
};

const detailValueTotal = {
  fontSize: '18px',
  color: '#00BFFF',
  fontWeight: 'bold' as const,
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
  fontSize: '13px',
  color: '#999999',
};
