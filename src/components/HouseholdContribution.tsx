import type { Member, Transaction } from "@/types";
import { formatYen } from "@/lib/format";
import { memberAccent } from "@/lib/memberColors";

type Props = {
  label: string;
  members: Member[];
  transactions: Transaction[];
};

const CONTRIBUTION_CATEGORY = "生活費";

export default function HouseholdContribution({
  label,
  members,
  transactions,
}: Props) {
  const totals = members.map((member) =>
    transactions
      .filter(
        (t) =>
          t.memberId === member.id &&
          t.type === "income" &&
          t.category === CONTRIBUTION_CATEGORY,
      )
      .reduce((sum, t) => sum + t.amount, 0),
  );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none">
      <h2 className="mb-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
        {label}
      </h2>
      <div
        className="grid gap-2 text-center"
        style={{ gridTemplateColumns: `repeat(${members.length}, minmax(0, 1fr))` }}
      >
        {members.map((member, i) => (
          <div key={member.id}>
            <p className={`text-xs font-semibold ${memberAccent(i).text}`}>
              {member.name}
            </p>
            <p className="mt-1 text-base font-bold text-stone-900 dark:text-stone-50">
              {formatYen(totals[i])}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
