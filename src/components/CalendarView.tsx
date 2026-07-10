import type { Member, Transaction } from "@/types";
import { addMonths, getMonthMatrix } from "@/lib/calendar";
import { formatCompactYen, todayString } from "@/lib/format";
import SummaryBar from "@/components/SummaryBar";
import HouseholdContribution from "@/components/HouseholdContribution";

type Props = {
  transactions: Transaction[];
  members: Member[];
  yearMonth: string;
  onChangeMonth: (yearMonth: string) => void;
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarView({
  transactions,
  members,
  yearMonth,
  onChangeMonth,
  onSelectDate,
}: Props) {
  const weeks = getMonthMatrix(yearMonth);
  const [year, month] = yearMonth.split("-");
  const todayStr = todayString();

  const monthlyTransactions = transactions.filter((t) =>
    t.date.startsWith(yearMonth),
  );

  const totalsByDate = new Map<string, { income: number; expense: number }>();
  for (const t of monthlyTransactions) {
    const entry = totalsByDate.get(t.date) ?? { income: 0, expense: 0 };
    if (t.type === "income") entry.income += t.amount;
    else entry.expense += t.amount;
    totalsByDate.set(t.date, entry);
  }

  const monthlyIncome = [...totalsByDate.values()].reduce(
    (sum, v) => sum + v.income,
    0,
  );
  const monthlyExpense = [...totalsByDate.values()].reduce(
    (sum, v) => sum + v.expense,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChangeMonth(addMonths(yearMonth, -1))}
          aria-label="前の月"
          className="rounded-full px-3 py-1.5 text-stone-500 transition-colors hover:bg-accent-soft hover:text-accent dark:text-stone-400 dark:hover:bg-stone-800"
        >
          ‹
        </button>
        <h1 className="text-lg font-bold text-stone-900 dark:text-stone-50">
          {year}年{Number(month)}月
        </h1>
        <button
          type="button"
          onClick={() => onChangeMonth(addMonths(yearMonth, 1))}
          aria-label="次の月"
          className="rounded-full px-3 py-1.5 text-stone-500 transition-colors hover:bg-accent-soft hover:text-accent dark:text-stone-400 dark:hover:bg-stone-800"
        >
          ›
        </button>
      </div>

      <SummaryBar
        label={`${year}年${Number(month)}月の収支`}
        income={monthlyIncome}
        expense={monthlyExpense}
      />

      <HouseholdContribution
        label={`生活費の入金状況（${Number(month)}月）`}
        members={members}
        transactions={monthlyTransactions}
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none">
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-stone-400 dark:text-stone-500">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1.5">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weeks.flatMap((week, wi) =>
            week.map((date, di) => {
              if (!date) {
                return <div key={`empty-${wi}-${di}`} className="aspect-square" />;
              }

              const day = Number(date.slice(-2));
              const totals = totalsByDate.get(date);
              const isToday = date === todayStr;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`flex aspect-square flex-col items-center justify-start gap-0.5 rounded-xl p-1 pt-1.5 text-center transition-colors hover:bg-accent-soft dark:hover:bg-stone-800 ${
                    isToday ? "bg-accent-soft ring-1 ring-accent/50" : ""
                  }`}
                >
                  <span
                    className={`text-xs ${
                      isToday
                        ? "font-bold text-accent"
                        : "text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    {day}
                  </span>
                  {totals?.income ? (
                    <span className="text-[10px] leading-tight text-emerald-500 dark:text-emerald-400">
                      {formatCompactYen(totals.income)}
                    </span>
                  ) : null}
                  {totals?.expense ? (
                    <span className="text-[10px] leading-tight text-rose-400 dark:text-rose-400">
                      {formatCompactYen(totals.expense)}
                    </span>
                  ) : null}
                </button>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
