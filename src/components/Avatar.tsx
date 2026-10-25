import { initial } from '../utils/format';

export default function Avatar({ name, size = 'sm' }: { name?: string; size?: 'sm' | 'md' }) {
  const dims = size === 'md' ? 'h-10 w-10 text-base' : 'h-8 w-8 text-sm';
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full border border-gray-400 bg-gray-50 font-medium text-gray-700 ${dims}`}>
      {initial(name)}
    </div>
  );
}
