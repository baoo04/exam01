export function LoadingSpinner({ label = "Đang tải…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-600">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600"
        aria-hidden
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
