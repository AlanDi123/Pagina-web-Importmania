'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/storefront/StarRating';
import { ReviewDisplay } from '@/types/review';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  canReview: boolean;
  existingReview?: ReviewDisplay | null;
  onReviewSubmit?: () => void;
}

export function ReviewForm({
  productId,
  canReview,
  existingReview,
  onReviewSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Por favor seleccioná una calificación');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al enviar reseña');
      }

      toast.success('¡Gracias por tu reseña!');
      setRating(0);
      setTitle('');
      setComment('');
      onReviewSubmit?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al enviar reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReview) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">
          Tenés que haber comprado este producto para dejar una reseña.
        </p>
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-lg">
        <p className="font-medium mb-2">Ya dejaste tu reseña</p>
        <div className="max-w-md mx-auto">
          <StarRating rating={existingReview.rating} size="lg" />
          {existingReview.title && (
            <p className="font-semibold mt-2">{existingReview.title}</p>
          )}
          {existingReview.comment && (
            <p className="text-muted-foreground mt-2">{existingReview.comment}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Calificación */}
      <div className="space-y-2">
        <Label>Calificación</Label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            interactive
            size="lg"
          />
          {rating > 0 && (
            <span className="text-sm text-muted-foreground">
              {rating === 1
                ? 'Muy malo'
                : rating === 2
                ? 'Malo'
                : rating === 3
                ? 'Regular'
                : rating === 4
                ? 'Bueno'
                : 'Excelente'}
            </span>
          )}
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <Label htmlFor="title">Título (opcional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resumen de tu opinión"
          maxLength={100}
        />
      </div>

      {/* Comentario */}
      <div className="space-y-2">
        <Label htmlFor="comment">Comentario (opcional)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Contanos tu experiencia con el producto..."
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {comment.length}/500
        </p>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar reseña'
        )}
      </Button>
    </form>
  );
}

export default ReviewForm;
