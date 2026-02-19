export default function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/5",
        active ? "bg-blue-50 text-blue-700" : "bg-white text-gray-800 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
