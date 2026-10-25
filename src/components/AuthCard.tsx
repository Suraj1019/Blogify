import type { ReactNode } from 'react';

/** Centered card used by the login and signup pages. */
export default function AuthCard({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-sm shadow-lg">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">{title}</h2>
        {children}
        <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>
      </div>
    </div>
  );
}
