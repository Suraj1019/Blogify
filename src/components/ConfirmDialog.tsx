import { useEffect } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        className="flex w-full max-w-xs flex-col items-center rounded-xl bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-6 text-center text-sm text-gray-500">{message}</p>
        <div className="flex gap-4">
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
