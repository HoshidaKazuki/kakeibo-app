import type { Member, Transaction } from "@/types";
import SummaryBar from "@/components/SummaryBar";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

type Props = {
  date: string;
  transactions: Transaction[];
  members: Member[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
};

export default function DayScreen({
  date,
  transactions,
  members,
  onAdd,
  onDelete,
  onBack,
}: Props) {
  const [year, month, day] = date.split("-");
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="animate-rise flex items-center gap-3 px-1">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-border/70 bg-white/70 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          ‹ カレンダーへ
        </button>
        <h1 className="headline-font text-lg font-bold text-foreground sm:text-xl">
          {year}年{Number(month)}月{Number(day)}日
        </h1>
      </div>

      <SummaryBar label="この日の貯金" income={income} expense={expense} />

      <TransactionForm members={members} onAdd={onAdd} fixedDate={date} />
      <TransactionList transactions={transactions} members={members} onDelete={onDelete} />
    </div>
  );
}
