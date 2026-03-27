export function MiniBar({
  values = [],
  color,
}: {
  values?: number[];
  color: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} transition-all duration-300`}
          style={{
            height: `${Math.max((v / max) * 100, 4)}%`,
            opacity:
              i === values.length - 1 ? 1 : 0.4 + (i / values.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}
