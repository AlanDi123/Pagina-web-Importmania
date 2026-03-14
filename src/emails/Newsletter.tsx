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

interface NewsletterProps {
  subject: string;
  htmlContent: string;
  unsubscribeUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function Newsletter({ subject, htmlContent, unsubscribeUrl }: NewsletterProps) {
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

          {/* Subject */}
          <Heading style={heading}>{subject}</Heading>

          {/* Contenido HTML */}
          <Section style={contentSection}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={contentHtml} />
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={baseUrl}>
              Ver más productos
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Estás recibiendo este email porque te suscribiste al newsletter de iMPORTMANIA.
            </Text>
            <Text style={footerUnsubscribe}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Darse de baja del newsletter
              </Link>
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

export default Newsletter;

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

const contentSection = {
  padding: '0 30px 30px',
};

const contentHtml = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const buttonContainer = {
  padding: '0 30px 30px',
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
  margin: '0 30px',
};

const footer = {
  padding: '30px',
  backgroundColor: '#f9f9f9',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '13px',
  color: '#999999',
  marginBottom: '12px',
};

const footerUnsubscribe = {
  fontSize: '13px',
  color: '#999999',
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
