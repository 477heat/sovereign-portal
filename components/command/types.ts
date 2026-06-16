import type { ReactNode } from "react";
import type { GlossaryTermKey } from "@/lib/glossary";

export type CommandShellSounds = {
  deploy: string;
  cycle: string;
  menu: string;
  panel: string;
  primary: string;
  stow: string;
};

export type CommandPanelCopy =
  | string
  | {
      label?: string;
      items: string[];
    };

export type CommandPanel = {
  id: string;
  number?: string;
  label: string;
  value: string;
  title: string;
  body: CommandPanelCopy | CommandPanelCopy[];
  link?: {
    href: string;
    label: string;
  };
};

export type CommandPanelGroup = {
  label: string;
  eyebrow: string;
  panels: CommandPanel[];
};

export type CommandDrawerAction = {
  href: string;
  label: string;
  variant?: "default" | "opposite" | "primary";
};

export type CommandShellPanel = CommandPanel & {
  groupLabel: string;
  eyebrow: string;
};

export type CommandPageShellProps = {
  drawerActions?: CommandDrawerAction[];
  drawerContentId?: string;
  drawerLabel?: string;
  glossaryTerms?: GlossaryTermKey[];
  groups: CommandPanelGroup[];
  initialPanelId?: string;
  interactionDelayMs?: number;
  renderPanelBackdrop?: (panel: CommandShellPanel) => ReactNode;
  showBackdropRings?: boolean;
  sounds?: Partial<CommandShellSounds>;
};
