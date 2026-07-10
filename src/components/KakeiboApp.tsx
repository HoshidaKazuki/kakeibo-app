"use client";

import { useState } from "react";
import { DEFAULT_MEMBERS, type Transaction } from "@/types";
import { todayString } from "@/lib/format";
import CalendarView from "@/components/CalendarView";
import DayScreen from "@/components/DayScreen";
import MemberNameEditor from "@/components/MemberNameEditor";

export default function KakeiboApp() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [yearMonth, setYearMonth] = useState(todayString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
      <h1 className="flex items-center justify-center gap-1.5 text-center text-base font-bold text-accent">
        <span aria-hidden>🐷</span>
        かけぼっちゃん
      </h1>

      <MemberNameEditor members={members} onChangeName={handleRenameMember} />

      {selectedDate ? (
        <DayScreen
          date={selectedDate}
          transactions={transactions.filter((t) => t.date === selectedDate)}
          members={members}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onBack={() => setSelectedDate(null)}
        />
      ) : (
        <CalendarView
          transactions={transactions}
          members={members}
          yearMonth={yearMonth}
          onChangeMonth={setYearMonth}
          onSelectDate={setSelectedDate}
        />
      )}
    </div>
  );
}
