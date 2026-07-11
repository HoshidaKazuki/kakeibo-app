import { formatYen } from "@/lib/format";

type Props = {
  label: string;
  income: number;
  expense: number;
};

export default function SummaryBar({ label, income, expense }: Props) {
  const balance = income - expense;

  return (
    <section className="paper-card animate-rise p-4">
      <h2 className="mb-2 text-xs font-semibold text-ink-soft">
        {label}
      </h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-ink-soft">収入</p>
          <p className="mt-1 text-base font-bold text-emerald-600">
            {formatYen(income)}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-soft">支出</p>
          <p className="mt-1 text-base font-bold text-rose-500">
            {formatYen(expense)}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-soft">貯金</p>
          <p
            className={`mt-1 text-base font-bold ${
              balance >= 0
                ? "text-accent"
                : "text-rose-500"
            }`}
          >
            {formatYen(balance)}
          </p>
        </div>
      </div>
    </section>
  );
}
