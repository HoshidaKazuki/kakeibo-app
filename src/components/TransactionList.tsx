import type { Member, Transaction } from "@/types";
import { formatDate, formatYen } from "@/lib/format";
import { memberAccent } from "@/lib/memberColors";
import { JOINT_MEMBER_ID, JOINT_MEMBER_LABEL } from "@/types";

const CATEGORY_ICON: Record<string, string> = {
  食費: "🍚",
  外食費: "🍜",
  日用品: "🧻",
  水道: "🚰",
  電気: "⚡",
  ガス: "🔥",
  家賃: "🏠",
  娯楽: "🎬",
  給与: "💼",
  副収入: "🪙",
  生活費: "🤝",
  その他: "📝",
};

type Props = {
  transactions: Transaction[];
  members: Member[];
  onDelete: (id: string) => void;
};

export default function TransactionList({ transactions, members, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  const memberIndex = new Map(members.map((m, i) => [m.id, i] as const));

  function memberBadge(memberId: string) {
    if (memberId === JOINT_MEMBER_ID) {
      return {
        label: JOINT_MEMBER_LABEL,
        className: "bg-stone-200 text-stone-700",
      };
    }

    const index = memberIndex.get(memberId) ?? 0;
    return {
      label: members.find((m) => m.id === memberId)?.name ?? "?",
      className: memberAccent(index).softBg,
    };
  }

  if (sorted.length === 0) {
    return (
      <section className="paper-card animate-rise p-5 text-center text-sm text-ink-soft">
        まだ記録がありません。買い物や入金をひとつ記録して、暮らしのログを始めましょう。
      </section>
    );
  }

  return (
    <section className="paper-card animate-rise overflow-hidden">
      <ul className="divide-y divide-border/50">
        {sorted.map((t) => {
          const badge = memberBadge(t.memberId);

          return (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-white/70"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-lg bg-orange-100/80 px-1.5 py-1 text-center text-[11px] font-medium text-ink-soft">
                  {formatDate(t.date)}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  <span className="mr-1" aria-hidden>
                    {CATEGORY_ICON[t.category] ?? "📝"}
                  </span>
                  {t.category}
                  {t.isMonthlyFixed ? (
                    <span className="ml-1 rounded-full bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">
                      毎月
                    </span>
                  ) : null}
                </p>
                {t.memo && (
                  <p className="truncate text-xs text-ink-soft">
                    {t.memo}
                  </p>
                )}
              </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatYen(t.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(t.sourceTransactionId ?? t.id)}
                  aria-label="削除"
                  className="rounded-full px-2 py-1 text-xs text-ink-soft transition-colors hover:bg-rose-100/60 hover:text-rose-600"
                >
                  削除
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
