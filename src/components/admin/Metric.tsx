import { Link } from "react-router-dom";

interface MetricProps {
  label: string;
  value: number | string;
  description?: string;
  to?: string;
}

function Metric({
  label,
  value,
  description,
  to,
}: MetricProps) {
  const content = (
    <>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      )}
    </>
  );

  const baseClassName =
    "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClassName} block transition hover:border-gray-400 hover:shadow-md`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClassName}>
      {content}
    </div>
  );
}

export default Metric;