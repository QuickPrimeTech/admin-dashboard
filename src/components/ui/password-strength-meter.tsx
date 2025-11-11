"use client";
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Check, CircleDashed } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const re = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /\d/,
  symbol: /[^A-Za-z0-9]/,
};

type Rule = "length" | "lower" | "upper" | "digit" | "symbol";
type Rules = Record<Rule, boolean>;

const analyse = (p: string): { score: number; rules: Rules } => {
  const rules: Rules = {
    length: p.length >= 8,
    lower: re.lower.test(p),
    upper: re.upper.test(p),
    digit: re.digit.test(p),
    symbol: re.symbol.test(p),
  };
  return { score: Object.values(rules).filter(Boolean).length, rules };
};

/* ------------------------------------------------------------------ */
/* Messages & Colors                                                  */
/* ------------------------------------------------------------------ */
const msg: Record<Rule, string> = {
  length: "8+ characters",
  lower: "a lowercase letter",
  upper: "an uppercase letter",
  digit: "a number",
  symbol: "a special character",
};

const colors = [
  "bg-gray-300",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];

type Props = { password: string };

export function PasswordStrengthMeter({ password }: Props) {
  const { score, rules } = useMemo(() => analyse(password), [password]);
  const need = (Object.keys(msg) as Rule[]).find((k) => !rules[k]);
  return (
    <div className="mt-2 space-y-1">
      <Progress value={score * 20} indicatorClassName={colors[score]} />
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {need ? (
          <>
            <CircleDashed className="h-4 w-4 animate-pulse" />
            <span>Add {msg[need]}</span>
          </>
        ) : (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Strong password</span>
          </>
        )}
      </div>
    </div>
  );
}
