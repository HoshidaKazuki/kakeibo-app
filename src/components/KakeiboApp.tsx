"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_MEMBERS, type Member, type Transaction } from "@/types";
import { todayString } from "@/lib/format";
import CalendarView from "@/components/CalendarView";
import DayScreen from "@/components/DayScreen";
import MemberNameEditor from "@/components/MemberNameEditor";

type PersistedState = {
  transactions: Transaction[];
  members: Member[];
  yearMonth: string;
};

type Props = {
  persistKey?: string;
  syncEndpoint?: string;
};

function readPersistedState(persistKey?: string): PersistedState | null {
  if (!persistKey || typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(persistKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function clampDateToMonth(baseDate: string, yearMonth: string): string {
  const day = Number(baseDate.slice(8, 10));
  const [year, month] = yearMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const safeDay = Math.min(day, lastDay);
  return `${yearMonth}-${String(safeDay).padStart(2, "0")}`;
}

function expandTransactionsForMonth(
  transactions: Transaction[],
  yearMonth: string,
): Transaction[] {
  const explicit = transactions.filter((t) => t.date.startsWith(yearMonth));
  const projected = transactions
    .filter((t) => t.isMonthlyFixed && !t.date.startsWith(yearMonth))
    .map((t) => ({
      ...t,
      id: `${t.id}::${yearMonth}`,
      date: clampDateToMonth(t.date, yearMonth),
      sourceTransactionId: t.id,
    }));

  return [...explicit, ...projected];
}

export default function KakeiboApp({ persistKey, syncEndpoint }: Props) {
  const syncEnabled = Boolean(syncEndpoint);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const persisted = syncEnabled ? null : readPersistedState(persistKey);
    return Array.isArray(persisted?.transactions) ? persisted.transactions : [];
  });
  const [members, setMembers] = useState(() => {
    const persisted = syncEnabled ? null : readPersistedState(persistKey);
    return Array.isArray(persisted?.members) && persisted.members.length > 0
      ? persisted.members
      : DEFAULT_MEMBERS;
  });
  const [yearMonth, setYearMonth] = useState(() => {
    const persisted = syncEnabled ? null : readPersistedState(persistKey);
    return typeof persisted?.yearMonth === "string" && /^\d{4}-\d{2}$/.test(persisted.yearMonth)
      ? persisted.yearMonth
      : todayString().slice(0, 7);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isHydratingShared, setIsHydratingShared] = useState(syncEnabled);
  const [sharedError, setSharedError] = useState<string | null>(null);

  const sendClientLog = useCallback(async (args: {
    eventType: string;
    level: "info" | "warn" | "error";
    message: string;
    meta?: Record<string, unknown>;
  }) => {
    if (!syncEnabled) return;
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });
    } catch {
      // Ignore logging transport failures.
    }
  }, [syncEnabled]);

  useEffect(() => {
    if (!syncEnabled || !syncEndpoint) return;

    let alive = true;
    const hydrate = async () => {
      try {
        const response = await fetch(syncEndpoint, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`state_load_http_${response.status}`);
        }

        const payload = (await response.json()) as PersistedState;
        if (!alive) return;

        setTransactions(Array.isArray(payload.transactions) ? payload.transactions : []);
        setMembers(
          Array.isArray(payload.members) && payload.members.length > 0
            ? payload.members
            : DEFAULT_MEMBERS,
        );
        setYearMonth(
          typeof payload.yearMonth === "string" && /^\d{4}-\d{2}$/.test(payload.yearMonth)
            ? payload.yearMonth
            : todayString().slice(0, 7),
        );
        setSharedError(null);
      } catch (error) {
        if (!alive) return;
        const message = error instanceof Error ? error.message : "state_load_failed";
        setSharedError("共有データの読み込みに失敗しました");
        await sendClientLog({
          eventType: "shared_state_load_failed",
          level: "error",
          message,
        });
      } finally {
        if (alive) {
          setIsHydratingShared(false);
        }
      }
    };

    void hydrate();

    return () => {
      alive = false;
    };
  }, [syncEnabled, syncEndpoint, sendClientLog]);

  useEffect(() => {
    if (syncEnabled) return;
    if (!persistKey || typeof window === "undefined") return;

    const payload: PersistedState = {
      transactions,
      members,
      yearMonth,
    };
    window.localStorage.setItem(persistKey, JSON.stringify(payload));
  }, [syncEnabled, persistKey, transactions, members, yearMonth]);

  useEffect(() => {
    if (!syncEnabled || !syncEndpoint || isHydratingShared) return;

    const timer = window.setTimeout(() => {
      const payload: PersistedState = {
        transactions,
        members,
        yearMonth,
      };

      void fetch(syncEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        if (!response.ok) {
          await sendClientLog({
            eventType: "shared_state_save_failed",
            level: "error",
            message: `state_save_http_${response.status}`,
          });
          setSharedError("共有データの保存に失敗しました");
        } else {
          setSharedError(null);
        }
      }).catch(async (error) => {
        await sendClientLog({
          eventType: "shared_state_save_exception",
          level: "error",
          message: error instanceof Error ? error.message : "state_save_exception",
        });
        setSharedError("共有データの保存に失敗しました");
      });
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [syncEnabled, syncEndpoint, isHydratingShared, transactions, members, yearMonth, sendClientLog]);

  function handleAdd(transaction: Omit<Transaction, "id">) {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: crypto.randomUUID() },
    ]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function handleRenameMember(id: string, name: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, name } : m)));
  }

  const currentMonthTransactions = expandTransactionsForMonth(transactions, yearMonth);

  const monthCount = currentMonthTransactions.length;
  const monthlyExpense = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlySavings = monthlyIncome - monthlyExpense;

  const mostUsedCategory = (() => {
    const counter = new Map<string, number>();
    for (const t of currentMonthTransactions) {
      counter.set(t.category, (counter.get(t.category) ?? 0) + 1);
    }
    const best = [...counter.entries()].sort((a, b) => b[1] - a[1])[0];
    return best?.[0] ?? "まだ記録なし";
  })();

  const selectedDateTransactions = selectedDate
    ? expandTransactionsForMonth(transactions, selectedDate.slice(0, 7)).filter(
        (t) => t.date === selectedDate,
      )
    : [];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-6 sm:py-8">
      <header className="animate-rise paper-card relative overflow-hidden px-5 py-4">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/15" />
        <div className="absolute -bottom-7 left-6 h-16 w-16 rounded-full bg-orange-200/40" />
        <h1 className="headline-font relative z-10 flex items-center justify-center gap-2 text-center text-xl font-bold text-accent sm:text-2xl">
          <span aria-hidden>🐷</span>
          かけぼっちゃん
        </h1>
        <p className="relative z-10 mt-1 text-center text-xs text-ink-soft sm:text-sm">
          きょうのお金を、手ざわりよく記録する家計簿
        </p>
      </header>

      <MemberNameEditor members={members} onChangeName={handleRenameMember} />

      <section className="paper-card animate-rise rotate-[-0.4deg] px-4 py-3">
        <p className="headline-font text-sm font-bold text-foreground">暮らしメモ</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-border/70 bg-white/60 px-2 py-2">
            <p className="text-[11px] text-ink-soft">今月の支出</p>
            <p className="mt-1 text-sm font-bold text-rose-500">¥{monthlyExpense.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-white/60 px-2 py-2">
            <p className="text-[11px] text-ink-soft">今月の収入</p>
            <p className="mt-1 text-sm font-bold text-emerald-600">¥{monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-white/60 px-2 py-2">
            <p className="text-[11px] text-ink-soft">今月の貯金</p>
            <p className="mt-1 text-sm font-bold text-accent">¥{monthlySavings.toLocaleString()}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          今月の記録件数: <span className="font-semibold text-foreground">{monthCount}件</span>
          <span className="mx-2">|</span>
          よく使ってるカテゴリ: <span className="font-semibold text-foreground">{mostUsedCategory}</span>
        </p>
      </section>

      {syncEnabled && sharedError ? (
        <section className="paper-card animate-rise px-4 py-3">
          <p className="text-xs font-semibold text-rose-600">{sharedError}</p>
          <p className="mt-1 text-[11px] text-ink-soft">
            再読み込みしても改善しない場合は管理者に連絡してください。
          </p>
        </section>
      ) : null}

      {selectedDate ? (
        <DayScreen
          date={selectedDate}
          transactions={selectedDateTransactions}
          members={members}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onBack={() => setSelectedDate(null)}
        />
      ) : (
        <CalendarView
          transactions={currentMonthTransactions}
          members={members}
          yearMonth={yearMonth}
          onChangeMonth={setYearMonth}
          onSelectDate={setSelectedDate}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
