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
    <section className="paper-card animate-rise p-4">
      <h2 className="mb-2 text-xs font-semibold text-ink-soft">
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
            <p className="mt-1 text-base font-bold text-foreground">
              {formatYen(totals[i])}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
