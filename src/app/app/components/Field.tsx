export default function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-3 ring-1 ring-black/5 focus-within:ring-black/10">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
