'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'floating' | 'inline' | 'icon';
  className?: string;
  text?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = 'Hola! Quiero consultar sobre un producto.',
  variant = 'floating',
  className,
  text = 'Consultar por WhatsApp',
}: WhatsAppButtonProps) {
  const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '541112345678';

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'floating') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              className={cn(
                'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110',
                className
              )}
              size="icon"
              aria-label="Consultar por WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Consultar por WhatsApp</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className={cn('text-green-500 hover:text-green-600 hover:bg-green-50', className)}
        aria-label="Consultar por WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="success"
      className={cn('gap-2', className)}
      leftIcon={<MessageCircle className="h-4 w-4" />}
    >
      {text}
    </Button>
  );
}

export default WhatsAppButton;
