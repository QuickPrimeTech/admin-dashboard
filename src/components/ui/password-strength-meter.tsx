"use client";
import { useMemo, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress"; // your existing one
import { Check, CircleDashed } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const re = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /[0-9]/,
  symbol: /[!@#$%^&*(),.?":{}|<>]/,
};

type Rule = "length" | "lower" | "upper" | "digit" | "symbol";
type Rules = Record<Rule, boolean>;

function analyse(password: string): { score: number; rules: Rules } {
  const rules: Rules = {
    length: password.length >= 8,
    lower: re.lower.test(password),
    upper: re.upper.test(password),
    digit: re.digit.test(password),
    symbol: re.symbol.test(password),
  };
  const score = Object.values(rules).filter(Boolean).length;
  return { score, rules };
}

/* ------------------------------------------------------------------ */
/* Micro-copy that changes based on what the user *just* completed    */
/* ------------------------------------------------------------------ */
function getMessage(rules: Rules, prev: Rules | null): string {
  const diff = (r: Rule): boolean => rules[r] && !prev?.[r];

  if (diff("length")) return "Nice start! 8+ characters ✅";
  if (diff("lower")) return "Lower-case letters added ✅";
  if (diff("upper")) return "Upper-case letters added ✅";
  if (diff("digit")) return "Numbers added ✅";
  if (diff("symbol")) return "Special characters added ✅";

  if (!rules.length) return "Start typing…";
  if (!rules.lower && !rules.upper) return "Add upper & lower case letters";
  if (!rules.lower) return "Add a lower-case letter";
  if (!rules.upper) return "Add an upper-case letter";
  if (!rules.digit) return "Add a number";
  if (!rules.symbol) return "Add a special character (!@#$%)";
  return "Your password is rock-solid 🔒";
}

/* ------------------------------------------------------------------ */
/* Styling variants                                                   */
/* ------------------------------------------------------------------ */
const strengthVariants = cva("h-2 w-full rounded-full transition-colors", {
  variants: {
    strength: {
      0: "bg-gray-200 dark:bg-gray-700",
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-green-500",
      5: "bg-emerald-600",
    },
  },
  defaultVariants: { strength: 0 },
});

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
type Props = { password: string };

export function PasswordStrengthMeter({ password }: Props) {
  const { score, rules } = useMemo(() => analyse(password), [password]);
  const [prev, setPrev] = useState<Rules | null>(null);

  useEffect(() => setPrev(rules), [rules]);

  const strengthLabel = [
    "",
    "Very weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very strong",
  ][score];

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <Progress
        value={(score / 5) * 100}
        indicatorClassName={cn(strengthVariants({ strength: score }))}
      />

      {/* Label row */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{strengthLabel}</span>
        {score < 3 && (
          <span className="text-destructive font-medium">Too weak</span>
        )}
      </div>

      {/* Live tip */}
      <div
        aria-live="polite"
        className="text-xs text-muted-foreground min-h-5 flex items-center gap-1.5"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center">
          {score === 5 ? (
            <Check className="h-3 w-3 text-emerald-600" />
          ) : (
            <CircleDashed className="h-3 w-3 animate-pulse" />
          )}
        </span>
        <span key={password} className="animate-in fade-in-0 duration-300">
          {getMessage(rules, prev)}
        </span>
      </div>
    </div>
  );
}
