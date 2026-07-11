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

const CATEGORY_ICON: Record<string, string> = {
  食費: "🍚",
  外食費: "🍜",
  日用品: "🧻",
  娯楽: "🎬",
  給与: "💼",
  副収入: "🪙",
  生活費: "🤝",
  その他: "📝",
};

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
  const [isMonthlyFixed, setIsMonthlyFixed] = useState(false);

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const quickCategories = categories.slice(0, Math.min(5, categories.length));

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    const nextCategories = nextType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setCategory(nextCategories[0]);
  }

  function handleCategoryChange(nextCategory: string) {
    setCategory(nextCategory);
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
      isMonthlyFixed,
    });

    setAmount("");
    setMemo("");
    setIsMonthlyFixed(false);
  }

  const inputClass =
    "rounded-xl border border-border bg-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40";

  return (
    <form
      onSubmit={handleSubmit}
      className="paper-card animate-rise flex flex-col gap-4 p-5"
    >
      <div className="flex gap-1 rounded-full bg-orange-100/70 p-1">
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
                  : "text-ink-soft"
              }`}
            >
              {member.name}
            </button>
          );
        })}
      </div>

      <div className="flex gap-1 rounded-full bg-orange-100/70 p-1">
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            type === "expense"
              ? "bg-rose-400 text-white shadow-sm"
              : "text-ink-soft"
          }`}
        >
          💸 支出
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            type === "income"
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-ink-soft"
          }`}
        >
          💰 収入
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex flex-col gap-1 text-sm ${fixedDate ? "col-span-2" : ""}`}
        >
          <span className="text-ink-soft">金額</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例: 780"
            className={inputClass}
          />
        </label>

        {fixedDate ? null : (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink-soft">日付</span>
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
          <span className="text-ink-soft">カテゴリ</span>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_ICON[c]} {c}
              </option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quickCategories.map((c) => {
              const selected = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCategoryChange(c)}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    selected
                      ? "border-accent/60 bg-accent-soft text-accent"
                      : "border-border/70 bg-white/60 text-ink-soft hover:bg-orange-100/70"
                  }`}
                >
                  {CATEGORY_ICON[c]} {c}
                </button>
              );
            })}
          </div>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-ink-soft">メモ（任意）</span>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={
              type === "expense"
                ? "例）ドラッグストアで洗剤をまとめ買い"
                : "例）給料日・フリマ売上"
            }
            className={inputClass}
          />
        </label>

        <label className="col-span-2 flex items-start gap-2 rounded-xl border border-border/70 bg-white/55 px-3 py-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={isMonthlyFixed}
            onChange={(e) => setIsMonthlyFixed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-accent"
          />
          <span>
            毎月同じ内容で繰り返す
            <span className="block text-xs text-ink-soft">
              オフのときはこの月だけ登録されます
            </span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="headline-font rounded-full bg-accent py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
      >
        記録する
      </button>
    </form>
  );
}
