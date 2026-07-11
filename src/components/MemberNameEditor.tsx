"use client";

import type { Member } from "@/types";
import { memberAccent } from "@/lib/memberColors";

type Props = {
  members: Member[];
  onChangeName: (id: string, name: string) => void;
};

export default function MemberNameEditor({ members, onChangeName }: Props) {
  return (
    <div className="animate-rise paper-card flex gap-2 p-3">
      {members.map((member, i) => (
        <input
          key={member.id}
          type="text"
          value={member.name}
          onChange={(e) => onChangeName(member.id, e.target.value)}
          aria-label={`メンバー${i + 1}の名前`}
          className={`min-w-0 flex-1 rounded-full border bg-white/75 px-3 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/30 ${memberAccent(i).border}`}
        />
      ))}
    </div>
  );
}
