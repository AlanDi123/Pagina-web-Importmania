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

interface ReferralInviteProps {
  referrerName: string;
  referralLink: string;
  rewardDescription: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function ReferralInvite({
  referrerName,
  referralLink,
  rewardDescription,
}: ReferralInviteProps) {
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
          <Heading style={heading}>¡{referrerName} te invita a iMPORTMANIA! 🎁</Heading>

          <Text style={text}>
            Tu amigo/a <strong>{referrerName}</strong> te está invitando a conocer iMPORTMANIA, tu nueva tienda online de productos importados.
          </Text>

          {/* Beneficio */}
          <Section style={rewardSection}>
            <Text style={rewardTitle}>Tu beneficio exclusivo</Text>
            <Text style={rewardDescription}>{rewardDescription}</Text>
          </Section>

          <Text style={text}>
            Además, {referrerName} también recibirá una recompensa cuando hagas tu primera compra. ¡Todos ganan!
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={referralLink}>
              Activar mi descuento
            </Button>
          </Section>

          {/* Qué encontrarás */}
          <Section style={featuresSection}>
            <Heading style={featuresHeading}>¿Qué vas a encontrar en iMPORTMANIA?</Heading>
            <Text style={featureItem}>🛍️ Productos importados de calidad</Text>
            <Text style={featureItem}>🚚 Envíos a todo el país</Text>
            <Text style={featureItem}>💳 Múltiples medios de pago</Text>
            <Text style={featureItem}>🔒 Compra 100% segura</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este email fue enviado porque {referrerName} compartió su código de referido con vos.
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

export default ReferralInvite;

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

const rewardSection = {
  padding: '24px 30px',
  backgroundColor: '#FFF8E1',
  margin: '20px 30px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const rewardTitle = {
  fontSize: '14px',
  color: '#F57C00',
  fontWeight: 'bold' as const,
  marginBottom: '8px',
  textTransform: 'uppercase' as const,
};

const rewardDescription = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  color: '#E65100',
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

const featuresSection = {
  padding: '20px 30px',
  backgroundColor: '#E3F2FD',
  margin: '0 30px 20px',
  borderRadius: '8px',
};

const featuresHeading = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#1976D2',
  marginBottom: '16px',
};

const featureItem = {
  fontSize: '14px',
  color: '#555555',
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
  fontSize: '13px',
  color: '#999999',
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
