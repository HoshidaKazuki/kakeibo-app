import { formatYen } from "@/lib/format";

type Props = {
  label: string;
  income: number;
  expense: number;
};

export default function SummaryBar({ label, income, expense }: Props) {
  const balance = income - expense;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none">
      <h2 className="mb-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
        {label}
      </h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">収入</p>
          <p className="mt-1 text-base font-bold text-emerald-500 dark:text-emerald-400">
            {formatYen(income)}
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">支出</p>
          <p className="mt-1 text-base font-bold text-rose-400 dark:text-rose-400">
            {formatYen(expense)}
          </p>
        </div>
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">収支</p>
          <p
            className={`mt-1 text-base font-bold ${
              balance >= 0
                ? "text-accent"
                : "text-rose-400"
            }`}
          >
            {formatYen(balance)}
          </p>
        </div>
      </div>
    </section>
  );
}
