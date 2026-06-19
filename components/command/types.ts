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

export type CommandPanelGhostAsset = {
  alt?: string;
  src: string;
  variant?: "badge" | "card" | "network" | "orbital" | "creature";
};

export type CommandStoryboardImage = {
  alt?: string;
  label: string;
  mobileSrc?: string;
  note?: string;
  src?: string;
};

export type CommandStoryboard =
  | {
      layout: "multi-panel";
      story: CommandPanelCopy | CommandPanelCopy[];
      featureImage: CommandStoryboardImage;
      supportImages: CommandStoryboardImage[];
    }
  | {
      layout: "single-image";
      story: CommandPanelCopy | CommandPanelCopy[];
      image: CommandStoryboardImage;
    };

export type CommandPanelIcon =
  | "badge"
  | "wallet"
  | "scroll"
  | "orbital"
  | "creature"
  | "network"
  | "royalty";

export type CommandPanel = {
  id: string;
  number?: string;
  label: string;
  value: string;
  title: string;
  body: CommandPanelCopy | CommandPanelCopy[];
  upperReadouts?: CommandPanelCopy[];
  supportReadouts?: CommandPanelCopy[];
  storyboard?: CommandStoryboard;
  link?: {
    href: string;
    label: string;
  };
  ghostAsset?: CommandPanelGhostAsset;
  icon?: CommandPanelIcon;
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
  groups: CommandPanelGroup[];
  initialPanelId?: string;
  interactionDelayMs?: number;
  sounds?: Partial<CommandShellSounds>;
};
