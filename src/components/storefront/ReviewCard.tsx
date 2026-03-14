import { formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';
import { StarRating } from '@/components/storefront/StarRating';
import { ReviewDisplay } from '@/types/review';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: ReviewDisplay;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const relativeTime = formatRelative(new Date(review.createdAt), new Date(), {
    locale: es,
  });

  const initials = review.userName
    ? review.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{review.userName || 'Usuario'}</p>
            <p className="text-xs text-muted-foreground">{relativeTime}</p>
          </div>
        </div>
        {review.isVerified && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Compra verificada
          </Badge>
        )}
      </div>

      {/* Estrellas */}
      <StarRating rating={review.rating} size="sm" />

      {/* Título */}
      {review.title && (
        <p className="font-semibold">{review.title}</p>
      )}

      {/* Comentario */}
      {review.comment && (
        <p className="text-muted-foreground whitespace-pre-wrap">{review.comment}</p>
      )}

      {/* Imágenes (si hay) */}
      {review.productImages && review.productImages.length > 0 && (
        <div className="flex gap-2">
          {review.productImages.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Imagen de reseña ${index + 1}`}
              className="w-16 h-16 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      {/* Votación de utilidad (opcional) */}
      {(review.helpful > 0 || review.notHelpful > 0) && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <span>¿Te fue útil esta reseña?</span>
          <span>👍 {review.helpful}</span>
          <span>👎 {review.notHelpful}</span>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
