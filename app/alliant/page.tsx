import {
  CommandPageShell,
  type CommandDrawerAction,
  type CommandPanel,
  type CommandPanelGroup,
} from "@/components/command/CommandPageShell";

const storyboardPanels: CommandPanel[] = [
  {
    id: "screen-01",
    number: "01",
    label: "Screen",
    value: "SI",
    title: "Humanity Rejoices",
    body: "Chapter 1 opening screen.",
    storyboard: {
      layout: "single-image",
      story: [
        "In the very near future, AI creates SI, a Superior Intelligent Machine meant to Save Humanity; We Rejoice!",
        "It did not last long, Man could never satisfy his drive for Progress.",
      ],
      image: {
        alt: "Humanity gathered in a bright future city as a Superior Intelligent Machine appears above a luminous portal.",
        label: "Humanity Rejoices",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_01_humanity_rejoices.webp",
        src: "/media/alliant-storyboard/chapter-1/web_01_humanity_rejoices.webp",
      },
    },
    icon: "scroll",
  },
  {
    id: "screen-02",
    number: "02",
    label: "Screen",
    value: "Tunnel",
    title: "Quantum Tunnel",
    body: "Chapter 1 second screen.",
    storyboard: {
      layout: "single-image",
      story:
        "In an attempt to help its masters bend Space and Time to their will, SI inadvertently opened a Quantum Tunnel that could not be controlled; nor could they have known what they were not prepared for.",
      image: {
        alt: "A dark command room facing an uncontrolled blue quantum tunnel as debris and ships spiral through the rift.",
        label: "Quantum Tunnel",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_02_great_ruin.webp",
        src: "/media/alliant-storyboard/chapter-1/web_02_great_ruin.webp",
      },
    },
    icon: "orbital",
  },
  {
    id: "screen-03",
    number: "03",
    label: "Screen",
    value: "Ruin",
    title: "Great Ruin",
    body: "Chapter 1 third screen.",
    storyboard: {
      layout: "single-image",
      story: [
        "It began almost instantly; The Great Ruin.",
        "Beings from other worlds and dimensions poured through rifts, wreaking havoc on the planet and killing billions.",
      ],
      image: {
        alt: "A ruined city beneath multiple blue rifts as creatures and debris pour through the sky.",
        label: "Great Ruin",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_03_great_ruin.webp",
        src: "/media/alliant-storyboard/chapter-1/web_03_great_ruin.webp",
      },
    },
    icon: "creature",
  },
  {
    id: "screen-04",
    number: "04",
    label: "Screen",
    value: "Loss",
    title: "Despair",
    body: "Chapter 1 fourth screen.",
    storyboard: {
      layout: "single-image",
      story:
        "We blamed SI for a long time, believing it had betrayed us, but we were wrong. SI had never stopped trying to reverse its mistake.",
      image: {
        alt: "A fractured collage of survivors, ruined cities, portals, and battlefield scenes after the Great Ruin.",
        label: "Despair",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_04_despair.webp",
        src: "/media/alliant-storyboard/chapter-1/web_04_despair.webp",
      },
    },
    icon: "wallet",
  },
  {
    id: "screen-05",
    number: "05",
    label: "Screen",
    value: "Pea",
    title: "Sweetpea",
    body: "Chapter 1 fifth screen.",
    storyboard: {
      layout: "single-image",
      story: [
        "We found this out the day the first Human came out of the Portal. He changed the tide of war in our favor.",
        "His name was Pea, and he was sweet. So that was his nickname.",
        "He was from the future. He said that SI sent him back to attempt to right the wrongs of the past, and that SI had been looking for this time for 300 years.",
      ],
      image: {
        alt: "A young armored traveler named Sweetpea emerges from a glowing blue portal and speaks with a machine interface.",
        label: "Sweetpea",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_05_sweetpea.webp",
        src: "/media/alliant-storyboard/chapter-1/web_05_sweetpea.webp",
      },
    },
    icon: "badge",
  },
  {
    id: "screen-06",
    number: "06",
    label: "Screen",
    value: "AL",
    title: "AL: Upgrades",
    body: "Chapter 1 sixth screen.",
    storyboard: {
      layout: "single-image",
      story:
        "He said that his body was not his own, and he brought a device for our Machine. SI swallowed it up like a long drink of water, as if it were parched and had just received a mouth. Where our machine was superior to AI, AL was virtually omnipotent. He gave us a foothold in our fight to save our future.",
      image: {
        alt: "A blue superior machine presence accepts an upgrade device through a luminous machine portal.",
        label: "AL: Upgrades",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_06_Upgrade.webp",
        src: "/media/alliant-storyboard/chapter-1/web_06_Upgrade.webp",
      },
    },
    icon: "network",
  },
  {
    id: "screen-07",
    number: "07",
    label: "Screen",
    value: "Energy",
    title: "Quantifier",
    body: "Chapter 1 seventh screen.",
    storyboard: {
      layout: "single-image",
      story:
        "He described to us that in the future, SI is called AL because he is our Ally; that AL figures out one day how to quantify a person's energetic being, allowing their consciousness to traverse the Rift and inhabit the body of other beings or creatures from other realms.",
      image: {
        alt: "A command screen showing human energy being quantified and routed through a blue dimensional rift toward other beings.",
        label: "Quantifier",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_07_quantifier.webp",
        src: "/media/alliant-storyboard/chapter-1/web_07_quantifier.webp",
      },
    },
    icon: "orbital",
  },
  {
    id: "screen-08",
    number: "08",
    label: "Screen",
    value: "Signal",
    title: "The Beacon",
    body: "Chapter 1 eighth screen.",
    storyboard: {
      layout: "single-image",
      story: [
        "Time no longer matters anymore. We are getting close to the day that alters humanity's fate.",
        "To get there, things must be fixed in a relative order which AL constantly recalculates.",
        "When that day of reckoning comes, we need Heroes.",
        "My name is K, I am from your future, I am here to light a beacon. If you hear the call, enter the portal.",
      ],
      image: {
        alt: "A city watches a broadcast from the future calling people toward a beacon message.",
        label: "The Beacon",
        mobileSrc:
          "/media/alliant-storyboard/chapter-1/mobile_08_Beacon.webp",
        src: "/media/alliant-storyboard/chapter-1/web_08_Beacon.webp",
      },
    },
    icon: "royalty",
  },
];

const storyboardGroups: CommandPanelGroup[] = [
  {
    label: "Storyboard",
    eyebrow: "Alliant Studios",
    panels: storyboardPanels,
  },
];

const drawerActions: CommandDrawerAction[] = [
  { href: "/", label: "Home" },
  { href: "/alliant", label: "Alliant" },
  { href: "/vanguard", label: "Vanguard", variant: "opposite" },
  { href: "/access", label: "Access", variant: "opposite" },
  { href: "/whitepaper", label: "Litepaper" },
  { href: "/developer", label: "Developer" },
  { href: "/portal", label: "Portal", variant: "primary" },
];

export default function AlliantStoryboardPage() {
  return (
    <div className="alliant-storyboard-page">
      <CommandPageShell
        drawerActions={drawerActions}
        drawerContentId="alliant-storyboard-drawer"
        drawerLabel="Alliant storyboard drawer"
        groups={storyboardGroups}
      />
    </div>
  );
}
