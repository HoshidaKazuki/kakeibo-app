import { useState } from "react";
import type { Member, Transaction } from "@/types";
import { addMonths, getMonthMatrix } from "@/lib/calendar";
import { formatCompactYen, todayString } from "@/lib/format";
import SummaryBar from "@/components/SummaryBar";
import HouseholdContribution from "@/components/HouseholdContribution";
import { JOINT_MEMBER_ID } from "@/types";

type Props = {
  transactions: Transaction[];
  members: Member[];
  yearMonth: string;
  onChangeMonth: (yearMonth: string) => void;
  onSelectDate: (date: string) => void;
  onAdd: (transaction: Omit<Transaction, "id">) => void;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const FIXED_COST_ITEMS = ["水道", "電気", "ガス", "家賃"] as const;
type FixedCostItem = (typeof FIXED_COST_ITEMS)[number];

function normalizeDateInMonth(yearMonth: string, dayText: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const day = Number(dayText);
  const safeDay = Number.isFinite(day) ? Math.min(Math.max(day, 1), lastDay) : 1;
  return `${yearMonth}-${String(safeDay).padStart(2, "0")}`;
}

export default function CalendarView({
  transactions,
  members,
  yearMonth,
  onChangeMonth,
  onSelectDate,
  onAdd,
}: Props) {
  const [fixedCostDay, setFixedCostDay] = useState("25");
  const [fixedCostMonthly, setFixedCostMonthly] = useState(true);
  const [fixedCostAmounts, setFixedCostAmounts] = useState<Record<FixedCostItem, string>>({
    水道: "",
    電気: "",
    ガス: "",
    家賃: "",
  });

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

  const MONTHLY_FUND_AMOUNT = 60000;
  const MONTHLY_FUND_DAY = 25;
  const monthlyFundDate = `${yearMonth}-${String(MONTHLY_FUND_DAY).padStart(2, "0")}`;
  const monthlyFundIncome = monthlyTransactions
    .filter((t) => t.type === "income" && t.category === "生活費")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyFundRemaining = Math.max(0, MONTHLY_FUND_AMOUNT - monthlyFundIncome);
  const hasMonthlyFundBase = transactions.some(
    (t) =>
      t.type === "income" &&
      t.category === "生活費" &&
      t.amount === MONTHLY_FUND_AMOUNT &&
      t.date === monthlyFundDate &&
      t.isMonthlyFixed,
  );

  function handleCreateMonthlyFund() {
    if (hasMonthlyFundBase) return;
    onAdd({
      type: "income",
      amount: MONTHLY_FUND_AMOUNT,
      category: "生活費",
      date: monthlyFundDate,
      memo: "毎月の固定費入金枠",
      memberId: JOINT_MEMBER_ID,
      isMonthlyFixed: true,
    });
  }

  const fixedCostDate = normalizeDateInMonth(yearMonth, fixedCostDay);
  const hasAnyFixedCostAmount = FIXED_COST_ITEMS.some(
    (item) => Number(fixedCostAmounts[item]) > 0,
  );

  function updateFixedCostAmount(item: FixedCostItem, value: string) {
    setFixedCostAmounts((prev) => ({ ...prev, [item]: value }));
  }

  function handleRegisterFixedCosts() {
    if (!hasAnyFixedCostAmount) return;

    for (const item of FIXED_COST_ITEMS) {
      const amount = Number(fixedCostAmounts[item]);
      if (!amount || amount <= 0) continue;

      onAdd({
        type: "expense",
        amount,
        category: item,
        date: fixedCostDate,
        memo: "固定費",
        memberId: JOINT_MEMBER_ID,
        isMonthlyFixed: fixedCostMonthly,
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="animate-rise flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => onChangeMonth(addMonths(yearMonth, -1))}
          aria-label="前の月"
          className="rounded-full border border-border/70 bg-white/60 px-3 py-1.5 text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          ‹
        </button>
        <h1 className="headline-font text-xl font-bold text-foreground">
          {year}年{Number(month)}月
        </h1>
        <button
          type="button"
          onClick={() => onChangeMonth(addMonths(yearMonth, 1))}
          aria-label="次の月"
          className="rounded-full border border-border/70 bg-white/60 px-3 py-1.5 text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          ›
        </button>
      </div>

      <div className="paper-card animate-rise p-2 sm:p-3">
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-ink-soft">
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
                  className={`flex aspect-square flex-col items-center justify-start gap-0.5 rounded-xl border p-1 pt-1.5 text-center transition-colors hover:bg-accent-soft ${
                    isToday
                      ? "border-accent/50 bg-accent-soft"
                      : "border-transparent bg-white/35"
                  }`}
                >
                  <span
                    className={`text-xs ${
                      isToday
                        ? "font-bold text-accent"
                        : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>
                  {totals?.income ? (
                    <span className="text-[10px] leading-tight text-emerald-600">
                      {formatCompactYen(totals.income)}
                    </span>
                  ) : null}
                  {totals?.expense ? (
                    <span className="text-[10px] leading-tight text-rose-500">
                      {formatCompactYen(totals.expense)}
                    </span>
                  ) : null}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <section className="paper-card animate-rise p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">固定費の別途登録</h2>
            <p className="mt-1 text-xs text-ink-soft">
              水道・電気・ガス・家賃をまとめて登録できます
            </p>
          </div>
          <button
            type="button"
            onClick={handleRegisterFixedCosts}
            disabled={!hasAnyFixedCostAmount}
            className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors enabled:hover:bg-accent-soft enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            固定費を登録
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {FIXED_COST_ITEMS.map((item) => (
            <label key={item} className="flex flex-col gap-1 text-xs text-ink-soft">
              <span>{item}</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={fixedCostAmounts[item]}
                onChange={(e) => updateFixedCostAmount(item, e.target.value)}
                placeholder="0"
                className="rounded-lg border border-border/70 bg-white/70 px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-ink-soft">
            <span>登録日</span>
            <input
              type="number"
              min={1}
              max={31}
              value={fixedCostDay}
              onChange={(e) => setFixedCostDay(e.target.value)}
              className="rounded-lg border border-border/70 bg-white/70 px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-border/70 bg-white/60 px-3 py-2 text-xs text-foreground">
            <input
              type="checkbox"
              checked={fixedCostMonthly}
              onChange={(e) => setFixedCostMonthly(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            毎月同じ日に繰り返す
          </label>
        </div>
      </section>

      <section className="paper-card animate-rise p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">固定費の入金枠</h2>
            <p className="mt-1 text-xs text-ink-soft">
              毎月{MONTHLY_FUND_DAY}日に生活費を{formatCompactYen(MONTHLY_FUND_AMOUNT)}入金
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateMonthlyFund}
            disabled={hasMonthlyFundBase}
            className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors enabled:hover:bg-accent-soft enabled:hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasMonthlyFundBase ? "登録済み" : "入金枠を設定"}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl border border-border/70 bg-white/60 px-2 py-2">
            <p className="text-[11px] text-ink-soft">今月の入金</p>
            <p className="mt-1 text-sm font-bold text-emerald-600">
              {formatCompactYen(monthlyFundIncome)}
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-white/60 px-2 py-2">
            <p className="text-[11px] text-ink-soft">目標まで</p>
            <p className="mt-1 text-sm font-bold text-accent">
              {formatCompactYen(monthlyFundRemaining)}
            </p>
          </div>
        </div>
      </section>

      <SummaryBar
        label={`${year}年${Number(month)}月の貯金`}
        income={monthlyIncome}
        expense={monthlyExpense}
      />

      <HouseholdContribution
        label={`生活費の入金状況（${Number(month)}月）`}
        members={members}
        transactions={monthlyTransactions}
      />
    </div>
  );
}
