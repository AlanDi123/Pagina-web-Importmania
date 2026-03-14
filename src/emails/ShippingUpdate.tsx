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

interface ShippingUpdateProps {
  orderNumber: string;
  status: string;
  trackingCode?: string;
  trackingUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const statusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  PAYMENT_RECEIVED: 'Pago confirmado',
  PROCESSING: 'En preparación',
  SHIPPED: 'Despachado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
  PICKUP_READY: 'Listo para retirar',
  PICKED_UP: 'Retirado',
};

const statusColors: Record<string, string> = {
  PENDING: '#FFA726',
  PAYMENT_RECEIVED: '#42A5F5',
  PROCESSING: '#AB47BC',
  SHIPPED: '#26A69A',
  DELIVERED: '#66BB6A',
  CANCELLED: '#EF5350',
  REFUNDED: '#9E9E9E',
  PICKUP_READY: '#66BB6A',
  PICKED_UP: '#66BB6A',
};

export function ShippingUpdate({
  orderNumber,
  status,
  trackingCode,
  trackingUrl,
}: ShippingUpdateProps) {
  const statusLabel = statusLabels[status] || status;
  const statusColor = statusColors[status] || '#666666';

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
          <Heading style={heading}>Actualización de tu pedido</Heading>

          <Text style={text}>
            Tu pedido <strong>#{orderNumber}</strong> ha sido actualizado:
          </Text>

          {/* Estado actual */}
          <Section style={statusSection}>
            <Section
              style={{
                ...statusBadge,
                backgroundColor: statusColor,
              }}
            >
              <Text style={statusBadgeText}>{statusLabel}</Text>
            </Section>
          </Section>

          {/* Tracking */}
          {trackingCode && (
            <Section style={trackingSection}>
              <Text style={trackingLabel}>Código de seguimiento</Text>
              <Text style={trackingCode}>{trackingCode}</Text>
              {trackingUrl && (
                <Button style={trackingButton} href={trackingUrl}>
                  Seguir envío
                </Button>
              )}
            </Section>
          )}

          {/* Timeline de estados */}
          <Section style={timelineSection}>
            <Text style={timelineTitle}>Progreso de tu pedido</Text>
            <Section style={timelineItem}>
              <Text style={timelineDot}>✓</Text>
              <Text style={timelineText}>Pedido confirmado</Text>
            </Section>
            <Section style={timelineItem}>
              <Text style={timelineDot}>✓</Text>
              <Text style={timelineText}>Pago procesado</Text>
            </Section>
            {(status === 'SHIPPED' || status === 'DELIVERED') && (
              <>
                <Section style={timelineItem}>
                  <Text style={timelineDot}>✓</Text>
                  <Text style={timelineText}>Enviado</Text>
                </Section>
                {status === 'DELIVERED' && (
                  <Section style={timelineItem}>
                    <Text style={timelineDot}>✓</Text>
                    <Text style={timelineText}>Entregado</Text>
                  </Section>
                )}
              </>
            )}
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/cuenta/pedidos`}>
              Ver detalle completo
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

export default ShippingUpdate;

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

const statusSection = {
  padding: '30px',
  textAlign: 'center' as const,
};

const statusBadge = {
  display: 'inline-block',
  padding: '12px 32px',
  borderRadius: '24px',
};

const statusBadgeText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: 0,
};

const trackingSection = {
  padding: '20px 30px',
  backgroundColor: '#E3F2FD',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const trackingLabel = {
  fontSize: '14px',
  color: '#1976D2',
  marginBottom: '8px',
};

const trackingCode = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1976D2',
  fontFamily: 'monospace',
  marginBottom: '16px',
};

const trackingButton = {
  backgroundColor: '#1976D2',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 24px',
};

const timelineSection = {
  padding: '20px 30px',
  backgroundColor: '#f9f9f9',
  margin: '20px 30px',
  borderRadius: '8px',
};

const timelineTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '16px',
};

const timelineItem = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
};

const timelineDot = {
  fontSize: '18px',
  color: '#66BB6A',
  marginRight: '12px',
  width: '24px',
};

const timelineText = {
  fontSize: '14px',
  color: '#555555',
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
