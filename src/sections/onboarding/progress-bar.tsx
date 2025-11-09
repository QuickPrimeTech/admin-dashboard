"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type Step = {
  key: string;
  label: string;
};

interface ProgressBarProps {
  steps: Step[];
  currentStep: string;
}

/* 🟢 StepIndicator: Circle showing state */
function StepIndicator({
  isActive,
  isCompleted,
  index,
}: {
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}) {
  const baseClasses =
    "size-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300";
  const stateClasses = cn({
    "bg-muted text-muted-foreground": !isActive && !isCompleted,
    "bg-primary text-primary-foreground": isCompleted || isActive,
    "shadow-md scale-105": isActive,
  });

  return (
    <div className={cn(baseClasses, stateClasses)}>
      {isCompleted ? (
        <CheckCircle className="size-5 text-primary-foreground" />
      ) : (
        index + 1
      )}
    </div>
  );
}

/* 🏷️ StepLabel: Label below indicator */
function StepLabel({ label, isActive }: { label: string; isActive: boolean }) {
  return (
    <span
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-12 text-xs font-medium hidden md:block transition-colors text-center",
        {
          "text-primary": isActive,
          "text-muted-foreground": !isActive,
        }
      )}
    >
      {label}
    </span>
  );
}

/* 🔗 StepConnector: The connecting line between steps */
function StepConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div
      className={cn(
        "h-1 flex-1 rounded transition-all duration-300",
        isCompleted ? "bg-primary" : "bg-muted"
      )}
    />
  );
}

/* 🧱 StepItem: One single step (indicator + label) */
function StepItem({
  step,
  index,
  isActive,
  isCompleted,
  position,
}: {
  step: Step;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  position: "start" | "center" | "end";
}) {
  const alignment =
    position === "start"
      ? "items-start text-left"
      : position === "end"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <div className={cn("relative flex flex-col", alignment)}>
      <StepIndicator
        isActive={isActive}
        isCompleted={isCompleted}
        index={index}
      />
      <StepLabel label={step.label} isActive={isActive} />
    </div>
  );
}

/* 🚀 Main ProgressBar */
export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const position =
          index === 0 ? "start" : index === steps.length - 1 ? "end" : "center";

        return (
          <React.Fragment key={step.key}>
            <StepItem
              step={step}
              index={index}
              isActive={isActive}
              isCompleted={isCompleted}
              position={position}
            />

            {/* Only show connector *between* steps */}
            {index < steps.length - 1 && (
              <StepConnector isCompleted={isCompleted} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
