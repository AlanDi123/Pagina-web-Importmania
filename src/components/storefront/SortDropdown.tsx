'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ProductSort =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'bestselling'
  | 'rating';

interface SortDropdownProps {
  currentSort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más nuevos' },
  { value: 'bestselling', label: 'Más vendidos' },
  { value: 'rating', label: 'Mejor calificados' },
];

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || 'Relevancia';

  return (
    <Select value={currentSort} onValueChange={(value) => onSortChange(value as ProductSort)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SortDropdown;
