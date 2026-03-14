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

interface ReviewRequestProps {
  productName: string;
  reviewUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function ReviewRequest({ productName, reviewUrl }: ReviewRequestProps) {
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
          <Heading style={heading}>¿Qué te pareció tu compra? ⭐</Heading>

          <Text style={text}>
            ¡Gracias por confiar en iMPORTMANIA! Tu opinión es muy importante para nosotros y para otros compradores.
          </Text>

          <Text style={text}>
            Contanos qué te pareció <strong>{productName}</strong> y ayudá a otros clientes a tomar su decisión.
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={reviewUrl}>
              Dejar mi reseña
            </Button>
          </Section>

          {/* Beneficios */}
          <Section style={benefitsSection}>
            <Text style={benefitItem}>✨ Tu reseña aparecerá en la página del producto</Text>
            <Text style={benefitItem}>🎁 Acumulá puntos para futuros descuentos</Text>
            <Text style={benefitItem}>💬 Ayudá a otros compradores</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Tenés algún problema con tu producto? Contactanos directamente y te ayudaremos.
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

export default ReviewRequest;

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

const benefitsSection = {
  padding: '20px 30px',
  backgroundColor: '#E8F5E9',
  margin: '0 30px 20px',
  borderRadius: '8px',
};

const benefitItem = {
  fontSize: '14px',
  color: '#2E7D32',
  marginBottom: '8px',
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
