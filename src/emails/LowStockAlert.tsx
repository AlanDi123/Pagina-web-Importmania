import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Img,
  Link,
  Hr,
} from '@react-email/components';

interface LowStockAlertProps {
  productName: string;
  currentStock: number;
  threshold: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function LowStockAlert({
  productName,
  currentStock,
  threshold,
}: LowStockAlertProps) {
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
          <Heading style={heading}>⚠️ Alerta de stock bajo</Heading>

          <Text style={text}>
            El siguiente producto está por agotarse:
          </Text>

          {/* Producto */}
          <Section style={productSection}>
            <Text style={productName}>{productName}</Text>
            <Section style={stockRow}>
              <Text style={stockLabel}>Stock actual</Text>
              <Text style={stockValue}>{currentStock} unidades</Text>
            </Section>
            <Section style={stockRow}>
              <Text style={stockLabel}>Umbral de alerta</Text>
              <Text style={stockValue}>{threshold} unidades</Text>
            </Section>
          </Section>

          {/* Recomendación */}
          <Section style={recommendationSection}>
            <Text style={recommendationText}>
              💡 Recomendación: Reponer stock lo antes posible para evitar interrupciones en las ventas.
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/admin/productos`}>
              Gestionar productos
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

export default LowStockAlert;

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

const productSection = {
  padding: '20px 30px',
  backgroundColor: '#FFF8E1',
  margin: '20px 30px',
  borderRadius: '8px',
};

const productName = {
  fontSize: '18px',
  fontWeight: 'bold' as const,
  color: '#E65100',
  marginBottom: '16px',
};

const stockRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const stockLabel = {
  fontSize: '14px',
  color: '#F57C00',
};

const stockValue = {
  fontSize: '14px',
  color: '#333333',
  fontWeight: 'bold' as const,
};

const recommendationSection = {
  padding: '16px 30px',
  backgroundColor: '#E3F2FD',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const recommendationText = {
  fontSize: '14px',
  color: '#1976D2',
  margin: 0,
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
