"use client";

import { Progress } from "@ui/progress";

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  const strength = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];
  return { score, label: strength[score - 1] || "Too short" };
}

type PasswordStrengthMeterProps = {
  password: string;
};

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const { score, label } = getPasswordStrength(password);

  // Map score (0–5) to percentage and color class
  const progressValue = (score / 5) * 100;
  const progressColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-600",
  ];

  return (
    <div className="mt-2 space-y-1">
      <Progress
        value={progressValue}
        indicatorClassName={`h-2 transition-all duration-300 ${
          progressColors[score - 1]
        }`}
      />
      <p className="text-xs text-muted-foreground text-right">{label}</p>
    </div>
  );
}
