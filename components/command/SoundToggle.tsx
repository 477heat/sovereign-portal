import { HudButton } from "./HudButton";

type SoundToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <HudButton
      active={enabled}
      aria-pressed={enabled}
      className="command-sound-toggle"
      onClick={onToggle}
      tone={enabled ? "gold" : "cyan"}
    >
      {enabled ? "Sound On" : "Sound Off"}
    </HudButton>
  );
}
