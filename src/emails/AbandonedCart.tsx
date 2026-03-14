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

interface CartItem {
  name: string;
  price: string;
  image?: string;
}

interface AbandonedCartProps {
  userName: string;
  items: CartItem[];
  total: string;
  recoveryUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function AbandonedCart({
  userName,
  items,
  total,
  recoveryUrl,
}: AbandonedCartProps) {
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
          <Heading style={heading}>¿Te olvidaste algo, {userName}? 👀</Heading>

          <Text style={text}>
            Vimos que dejaste productos en tu carrito. ¡No te preocupes, todavía están disponibles!
          </Text>

          <Text style={text}>
            Completá tu compra antes de que se agoten.
          </Text>

          {/* Items del carrito */}
          <Section style={itemsSection}>
            <Heading style={itemsHeading}>Tu carrito</Heading>
            {items.slice(0, 3).map((item, index) => (
              <Section key={index} style={itemRow}>
                {item.image && (
                  <Img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    height="60"
                    style={itemImage}
                  />
                )}
                <Section style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemPrice}>{item.price}</Text>
                </Section>
              </Section>
            ))}
            {items.length > 3 && (
              <Text style={moreItems}>
                + {items.length - 3} productos más
              </Text>
            )}
          </Section>

          {/* Total */}
          <Section style={totalSection}>
            <Text style={totalLabel}>Total del carrito</Text>
            <Text style={totalValue}>{total}</Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={recoveryUrl}>
              Completar tu compra
            </Button>
          </Section>

          {/* Incentivo opcional */}
          <Section style={incentiveSection}>
            <Text style={incentiveText}>
              💡 ¿Necesitás ayuda para finalizar tu compra? Respondé este email o contactanos por WhatsApp.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿No querés recibir más emails como este?{' '}
              <Link href={`${baseUrl}/cuenta/configuracion`} style={footerLink}>
                Gestionar preferencias
              </Link>
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

export default AbandonedCart;

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

const itemsSection = {
  padding: '20px 30px',
  backgroundColor: '#f9f9f9',
  margin: '20px 30px',
  borderRadius: '8px',
};

const itemsHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '16px',
};

const itemRow = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #eeeeee',
};

const itemImage = {
  borderRadius: '8px',
  marginRight: '16px',
};

const itemDetails = {
  flex: 1,
};

const itemName = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '4px',
};

const itemPrice = {
  fontSize: '14px',
  color: '#00BFFF',
  fontWeight: 'bold',
};

const moreItems = {
  fontSize: '14px',
  color: '#999999',
  textAlign: 'center' as const,
  marginTop: '12px',
};

const totalSection = {
  padding: '20px 30px',
  backgroundColor: '#E3F2FD',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const totalLabel = {
  fontSize: '14px',
  color: '#1976D2',
  marginBottom: '8px',
};

const totalValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1976D2',
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

const incentiveSection = {
  padding: '20px 30px',
  backgroundColor: '#FFF8E1',
  margin: '0 30px 20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const incentiveText = {
  fontSize: '14px',
  color: '#F57C00',
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
