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

interface NotificationEmailProps {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const typeIcons: Record<string, string> = {
  NEW_ORDER: '📦',
  PAYMENT_RECEIVED: '💰',
  ORDER_SHIPPED: '🚚',
  ORDER_DELIVERED: '✅',
  LOW_STOCK: '⚠️',
  NEW_REVIEW: '⭐',
  NEW_USER: '👤',
  ABANDONED_CART: '🛒',
  REFERRAL_COMPLETED: '🎁',
  SYSTEM: '🔔',
};

const typeLabels: Record<string, string> = {
  NEW_ORDER: 'Nuevo pedido',
  PAYMENT_RECEIVED: 'Pago recibido',
  ORDER_SHIPPED: 'Pedido enviado',
  ORDER_DELIVERED: 'Pedido entregado',
  LOW_STOCK: 'Stock bajo',
  NEW_REVIEW: 'Nueva reseña',
  NEW_USER: 'Nuevo usuario',
  ABANDONED_CART: 'Carrito abandonado',
  REFERRAL_COMPLETED: 'Referido completado',
  SYSTEM: 'Sistema',
};

export function NotificationEmail({
  type,
  title,
  message,
  data,
}: NotificationEmailProps) {
  const icon = typeIcons[type] || '🔔';
  const label = typeLabels[type] || type;

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

          {/* Icono y título */}
          <Section style={headerSection}>
            <Text style={iconText}>{icon}</Text>
            <Heading style={heading}>{title}</Heading>
            <Text style={labelText}>{label}</Text>
          </Section>

          {/* Mensaje */}
          <Section style={messageSection}>
            <Text style={messageText}>{message}</Text>
          </Section>

          {/* Datos adicionales (si existen) */}
          {data && Object.keys(data).length > 0 && (
            <Section style={dataSection}>
              {Object.entries(data).map(([key, value]) => (
                <Section key={key} style={dataRow}>
                  <Text style={dataLabel}>{key}:</Text>
                  <Text style={dataValue}>{String(value)}</Text>
                </Section>
              ))}
            </Section>
          )}

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/admin/notificaciones`}>
              Ver todas las notificaciones
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Este es un email automático del sistema de iMPORTMANIA.
            </Text>
            <Text style={footerLinks}>
              <Link href={`${baseUrl}/cuenta/configuracion`} style={footerLink}>
                Gestionar notificaciones
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default NotificationEmail;

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

const headerSection = {
  padding: '30px 30px 20px',
  textAlign: 'center' as const,
};

const iconText = {
  fontSize: '48px',
  marginBottom: '16px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '8px',
};

const labelText = {
  fontSize: '14px',
  color: '#999999',
  textTransform: 'uppercase' as const,
};

const messageSection = {
  padding: '0 30px 20px',
  textAlign: 'center' as const,
};

const messageText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555555',
};

const dataSection = {
  padding: '20px 30px',
  backgroundColor: '#f9f9f9',
  margin: '0 30px 20px',
  borderRadius: '8px',
};

const dataRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const dataLabel = {
  fontSize: '14px',
  color: '#666666',
  textTransform: 'capitalize' as const,
};

const dataValue = {
  fontSize: '14px',
  color: '#333333',
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
