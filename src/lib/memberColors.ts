type MemberAccent = {
  text: string;
  solidBg: string;
  softBg: string;
  border: string;
};

const MEMBER_ACCENTS: MemberAccent[] = [
  {
    text: "text-amber-600 dark:text-amber-400",
    solidBg: "bg-amber-500 text-white",
    softBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
  },
  {
    text: "text-sky-600 dark:text-sky-400",
    solidBg: "bg-sky-500 text-white",
    softBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-800",
  },
];

export function memberAccent(index: number): MemberAccent {
  return MEMBER_ACCENTS[index % MEMBER_ACCENTS.length];
}
