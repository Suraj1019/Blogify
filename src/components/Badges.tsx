import { titleCase } from '../utils/format';

interface BadgesProps {
  items?: string[];
  variant?: 'tag' | 'category';
  label?: string;
  hash?: boolean;
}

export default function Badges({ items = [], variant = 'tag', label, hash }: BadgesProps) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="font-medium text-black">{label}</span>}
      {items.map((item, i) => (
        <span key={`${item}-${i}`}className={variant === 'tag' ? 'badge-tag' : 'badge-category'}>
          {hash && '#'}
          {titleCase(item)}
        </span>
      ))}
    </div>
  );
}
