import { Link } from "react-router-dom";

interface MetricProps {
  label: string;
  value: number | string;
  description?: string;
  to?: string;
}

function Metric({ label, value, description, to }: MetricProps) {
  const content = (
    <>
      <p className="text-sm text-[#8592B4]">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-white">{value}</p>
      {description && <p className="mt-1 text-xs text-[#5b6785]">{description}</p>}
    </>
  );

  const base = "glass-card rounded-2xl p-5";

  if (to) {
    return (
      <Link
        to={to}
        className={`${base} block transition hover:border-[#4C7CFF]/40 hover:shadow-[0_0_30px_rgba(76,124,255,0.15)]`}
      >
        {content}
      </Link>
    );
  }

  return <div className={base}>{content}</div>;
}

export default Metric;