export type TransactionType = "expense" | "income";

export type Member = {
  id: string;
  name: string;
};

// 二人暮らし用のローカル既定値。Supabase側はまだ personId 相当のカラムがない。
export const DEFAULT_MEMBERS: Member[] = [
  { id: "member-1", name: "自分" },
  { id: "member-2", name: "パートナー" },
];

export const JOINT_MEMBER_ID = "joint";
export const JOINT_MEMBER_LABEL = "共同";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  memo?: string;
  memberId: string;
  isMonthlyFixed?: boolean;
  sourceTransactionId?: string;
};

export const EXPENSE_CATEGORIES = [
  "食費",
  "外食費",
  "日用品",
  "娯楽",
  "その他",
] as const;

export const INCOME_CATEGORIES = ["給与", "副収入", "生活費", "その他"] as const;

// Supabase の transactions テーブルに対応する型（supabase/migrations 参照）
export type TransactionRow = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  memo: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: TransactionRow;
        Insert: Omit<TransactionRow, "id" | "user_id" | "created_at" | "memo"> &
          Partial<Pick<TransactionRow, "memo">>;
        Update: Partial<Omit<TransactionRow, "id" | "user_id">>;
      };
    };
  };
};
