/** Full-screen loading overlay. */
export default function Loader({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/75" role="status" aria-label="Loading">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-500 border-t-transparent" />
    </div>
  );
}
