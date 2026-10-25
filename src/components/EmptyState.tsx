import type { ReactNode } from 'react';

export default function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-full flex min-h-[40vh] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 p-8">
      <h3 className="text-lg font-medium text-gray-500">{children}</h3>
    </div>
  );
}
