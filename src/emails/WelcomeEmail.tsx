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

interface WelcomeEmailProps {
  name: string;
  referralCode?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function WelcomeEmail({ name, referralCode }: WelcomeEmailProps) {
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
          <Heading style={heading}>¡Bienvenido a iMPORTMANIA, {name}!</Heading>

          <Text style={text}>
            Gracias por crear tu cuenta. Estamos muy contentos de tenerte con nosotros.
          </Text>

          <Text style={text}>
            En iMPORTMANIA vas a encontrar los mejores productos importados con envíos a todo el país.
          </Text>

          {/* Beneficios */}
          <Section style={benefits}>
            <Text style={benefitItem}>🎁 Acceso a ofertas exclusivas</Text>
            <Text style={benefitItem}>📦 Seguimiento de tus pedidos en tiempo real</Text>
            <Text style={benefitItem}>💳 Múltiples medios de pago</Text>
            <Text style={benefitItem}>🚚 Envíos a todo el país</Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={baseUrl}>
              Explorar la tienda
            </Button>
          </Section>

          {/* Referido (opcional) */}
          {referralCode && (
            <Section style={referralSection}>
              <Text style={referralText}>
                <strong>Tu código de referido:</strong> {referralCode}
              </Text>
              <Text style={referralSubtext}>
                Compartilo con tus amigos y ganá recompensas cuando se registren.
              </Text>
            </Section>
          )}

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
            <Text style={footerSocial}>
              <Link href="https://instagram.com/importmania">Instagram</Link>
              {' | '}
              <Link href="https://facebook.com/importmania">Facebook</Link>
              {' | '}
              <Link href="https://tiktok.com/@importmania">TikTok</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

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
};

const benefits = {
  padding: '20px 30px',
  backgroundColor: '#f9f9f9',
  margin: '20px 30px',
  borderRadius: '8px',
};

const benefitItem = {
  fontSize: '14px',
  color: '#333333',
  marginBottom: '8px',
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

const referralSection = {
  padding: '20px 30px',
  backgroundColor: '#FFF8E1',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const referralText = {
  fontSize: '16px',
  color: '#333333',
  marginBottom: '8px',
};

const referralSubtext = {
  fontSize: '14px',
  color: '#666666',
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
  marginBottom: '12px',
};

const footerLink = {
  color: '#00BFFF',
  textDecoration: 'none',
};

const footerSocial = {
  fontSize: '13px',
  color: '#999999',
};
