"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

export function ConfettiEffect({
  trigger,
  duration = 3000,
}: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    const colors = ["#FF6B35", "#F7931E", "#FBB03B"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [trigger, duration]);

  return null;
}

export function celebrateSuccess() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#FF6B35", "#F7931E", "#FBB03B", "#4CAF50"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
