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

interface PasswordResetProps {
  resetUrl: string;
  expiresIn?: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function PasswordReset({ resetUrl, expiresIn = 1 }: PasswordResetProps) {
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
          <Heading style={heading}>Recuperación de contraseña</Heading>

          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta de iMPORTMANIA.
          </Text>

          {/* Botón de reset */}
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Restablecer contraseña
            </Button>
          </Section>

          <Text style={text}>
            O copiá y pegá este enlace en tu navegador:
          </Text>

          <Text style={linkText}>{resetUrl}</Text>

          {/* Expiración */}
          <Section style={expirySection}>
            <Text style={expiryText}>
              ⏱️ Este enlace expirará en {expiresIn} hora{expiresIn !== 1 ? 's' : ''}.
            </Text>
          </Section>

          {/* Advertencia de seguridad */}
          <Section style={warningSection}>
            <Text style={warningText}>
              <strong>¿No solicitaste este cambio?</strong> Si no pediste restablecer tu contraseña, podés ignorar este email de forma segura. Tu contraseña actual seguirá siendo válida.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Tenés dudas? Contactanos por WhatsApp o respondé este email.
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

export default PasswordReset;

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

const linkText = {
  fontSize: '14px',
  color: '#00BFFF',
  padding: '0 30px',
  marginBottom: '24px',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
};

const expirySection = {
  padding: '16px 30px',
  backgroundColor: '#FFF8E1',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const expiryText = {
  fontSize: '14px',
  color: '#F57C00',
  margin: 0,
};

const warningSection = {
  padding: '16px 30px',
  backgroundColor: '#FFEBEE',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const warningText = {
  fontSize: '14px',
  color: '#D32F2F',
  margin: 0,
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
