import type { Member, Transaction } from "@/types";
import { formatDate, formatYen } from "@/lib/format";
import { memberAccent } from "@/lib/memberColors";

type Props = {
  transactions: Transaction[];
  members: Member[];
  onDelete: (id: string) => void;
};

export default function TransactionList({ transactions, members, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  const memberIndex = new Map(members.map((m, i) => [m.id, i] as const));

  if (sorted.length === 0) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-white p-5 text-center text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
        まだ記録がありません。
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none">
      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {sorted.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 rounded-lg bg-stone-100 px-1.5 py-1 text-center text-[11px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                {formatDate(t.date)}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${memberAccent(memberIndex.get(t.memberId) ?? 0).softBg}`}
              >
                {members.find((m) => m.id === t.memberId)?.name ?? "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-50">
                  {t.category}
                </p>
                {t.memo && (
                  <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                    {t.memo}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  t.type === "income"
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-rose-400 dark:text-rose-400"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatYen(t.amount)}
              </span>
              <button
                type="button"
                onClick={() => onDelete(t.id)}
                aria-label="削除"
                className="rounded-full px-2 py-1 text-xs text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
