"use client";

import { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Member,
  type Transaction,
  type TransactionType,
} from "@/types";
import { todayString } from "@/lib/format";
import { memberAccent } from "@/lib/memberColors";

type Props = {
  members: Member[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  fixedDate?: string;
};

export default function TransactionForm({ members, onAdd, fixedDate }: Props) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(fixedDate ?? todayString());
  const [memo, setMemo] = useState("");
  const [memberId, setMemberId] = useState(members[0].id);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    const nextCategories = nextType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setCategory(nextCategories[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0 || !date) return;

    onAdd({
      type,
      amount: parsedAmount,
      category,
      date,
      memo: memo.trim() || undefined,
      memberId,
    });

    setAmount("");
    setMemo("");
  }

  const inputClass =
    "rounded-xl border border-stone-300 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 dark:border-stone-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/60 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none"
    >
      <div className="flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
        {members.map((member, i) => {
          const selected = memberId === member.id;
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => setMemberId(member.id)}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                selected
                  ? `${memberAccent(i).solidBg} shadow-sm`
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {member.name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            type === "expense"
              ? "bg-rose-400 text-white shadow-sm"
              : "text-stone-500 dark:text-stone-400"
          }`}
        >
          💸 支出
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            type === "income"
              ? "bg-emerald-400 text-white shadow-sm"
              : "text-stone-500 dark:text-stone-400"
          }`}
        >
          💰 収入
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex flex-col gap-1 text-sm ${fixedDate ? "col-span-2" : ""}`}
        >
          <span className="text-stone-500 dark:text-stone-400">金額</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </label>

        {fixedDate ? null : (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-stone-500 dark:text-stone-400">日付</span>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </label>
        )}

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-stone-500 dark:text-stone-400">カテゴリ</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-stone-500 dark:text-stone-400">メモ（任意）</span>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="例）スーパーで買い物"
            className={inputClass}
          />
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
      >
        記録する
      </button>
    </form>
  );
}
