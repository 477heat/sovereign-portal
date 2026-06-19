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
        {
          label: "Chapter 1",
          items: [
            "In the very near future, AI creates SI, a Superior Intelligent Machine meant to save us; Humanity Rejoices!",
            "It wasn't to last, Man couldnt satisfy his drive for Progress.",
          ],
        },
        "In an attempt to help its masters, bend Space and Time to their will, SI inadvertently",
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
      story: "opened a Quantum Tunnel that couldn't be controled; nor could they have been prepared.",
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
      story:
        "It began almost instantly; The Great Ruin.\nCreatures from other worlds and dimensions poured through reaking havoc on the planet, Killing Billions.",
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
        "We blamed SI for a long time. We fought always remembering who did this to us; but we were wrong. SI had never stopped trying to reverse its mistake.",
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
        "We found this out the day the first Human came out of the Portal. He was from the future. He turned the tide for us.",
        "He said that his body was not his own and that SI sent him back to attempt to right the wrongs of the past and that had been looking for this time for 300 years. His name was Pea, like a sweetpea.",
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
        "He brought a device that our Machine swallowed up like a long drink of water. Where our machine was superior, AL was virtually omnipotent. He gave us a foothold in our fight to save our future.",
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
        "He described to us that in the future, SI is called AL because he is our Ally; that AL figures out one day how to Quantify a persons energy; allowing their conciousness to traverse the Rift and inhabit the body of other beings or creatures from other realms.",
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
        "Pea told us that time no longer matters because they are getting close to the day that changes humanities fate; that to get there, things must be fixed in a relative order but that order is not known.",
        "We now know that when that day comes, humans in this time must be ready to step up to save the future.",
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
  { href: "/engine", label: "Engine" },
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
