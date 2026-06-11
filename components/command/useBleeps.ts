"use client";

import { useCallback, useRef, useState } from "react";

type AudioContextConstructor = typeof AudioContext;

declare global {
  interface Window {
    webkitAudioContext?: AudioContextConstructor;
  }
}

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  return window.AudioContext ?? window.webkitAudioContext;
}

export function useBleeps() {
  const audioContext = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playBleep = useCallback(
    (kind: "select" | "confirm" = "select") => {
      if (!soundEnabled) {
        return;
      }

      const AudioContextCtor = getAudioContextConstructor();

      if (!AudioContextCtor) {
        return;
      }

      const context = audioContext.current ?? new AudioContextCtor();
      audioContext.current = context;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const frequency = kind === "confirm" ? 620 : 420;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.42, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.14);
    },
    [soundEnabled],
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((current) => !current);
  }, []);

  return { playBleep, soundEnabled, toggleSound };
}
