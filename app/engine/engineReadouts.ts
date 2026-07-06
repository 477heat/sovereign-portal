export type ReadoutMode =
  | "sovereign"
  | "rpg"
  | "d20"
  | "metaverse"
  | "transit";

export type EngineStat = {
  label: string;
  value: number;
  signal: string;
};

export type EngineProfile = {
  mark: string;
  dob: string;
  seed: number;
  alignment: string;
  archetype: string;
  resonance: number;
  transit: string;
  shareCode: string;
  core: Record<string, number>;
};

export type EngineReadout = {
  id: ReadoutMode;
  label: string;
  eyebrow: string;
  title: string;
  summary: string;
  tone: string;
  stats: EngineStat[];
  diagnostics: string[];
  primaryValue: string;
  primaryLabel: string;
};

const alignments = [
  "Harmonic Vector",
  "Mirrored Current",
  "Diverse Orbit",
  "Balanced Relay",
  "Threshold Bloom",
];

const archetypes = [
  "Quiet Cartographer",
  "Circuit Pilgrim",
  "Liminal Broker",
  "Bright Witness",
  "Static Oracle",
  "Threshold Keeper",
];

const transitWindows = [
  "Auric crossing",
  "Lunar relay",
  "Mercury flare",
  "Outer-ring hush",
  "Venus echo",
  "Mars pressure",
];

const baseStatLabels = [
  "Presence",
  "Wealth",
  "Fortitude",
  "Cunning",
  "Flair",
  "Vigor",
  "Kinship",
  "Potency",
  "Wisdom",
  "Prestige",
  "Influence",
  "Arcana",
] as const;

function titleCaseMark(value: string) {
  const clean = value.trim().replace(/\s+/g, " ").slice(0, 42);
  return clean || "Unmarked Signal";
}

function foldSeed(value: string) {
  return value.split("").reduce((total, character, index) => {
    return total + character.charCodeAt(0) * (index + 7);
  }, 0);
}

function scaled(seed: number, index: number, floor = 24, spread = 73) {
  return floor + ((seed * (index + 11) + index * index * 17) % spread);
}

function statSignal(value: number) {
  if (value >= 82) return "surge";
  if (value >= 62) return "bright";
  if (value >= 42) return "stable";
  return "quiet";
}

function statsForLabels(
  labels: string[],
  profile: EngineProfile,
  offset: number,
  mapValue?: (value: number, index: number) => number,
) {
  const values = Object.values(profile.core);

  return labels.map((label, index) => {
    const value = values[(index + offset) % values.length];
    const nextValue = mapValue ? mapValue(value, index) : value;

    return {
      label,
      value: nextValue,
      signal: statSignal(nextValue),
    };
  });
}

export function buildEngineProfile(
  dob: string,
  mark: string,
  seedContext = "",
): EngineProfile {
  const normalizedDob = dob || "1988-08-08";
  const markLabel = titleCaseMark(mark);
  const seed = foldSeed(`${normalizedDob}:${markLabel}:${seedContext}`);
  const core = Object.fromEntries(
    baseStatLabels.map((label, index) => [label, scaled(seed, index)]),
  );
  const resonance = 31 + (seed % 68);
  const shareCore = seed.toString(36).toUpperCase().slice(-5).padStart(5, "0");

  return {
    mark: markLabel,
    dob: normalizedDob,
    seed,
    alignment: alignments[seed % alignments.length],
    archetype: archetypes[(seed + 3) % archetypes.length],
    resonance,
    transit: transitWindows[(seed + 5) % transitWindows.length],
    shareCode: `SIG-${shareCore}`,
    core,
  };
}

export function buildReadouts(profile: EngineProfile): EngineReadout[] {
  const power = Object.values(profile.core).reduce((total, value) => total + value, 0);

  return [
    {
      id: "sovereign",
      label: "Sovereign",
      eyebrow: "Native Matrix",
      title: profile.archetype,
      summary:
        "The house table keeps the full twelve-signal readout before future chart multipliers alter the field.",
      tone: "cyan",
      stats: statsForLabels([...baseStatLabels], profile, 0),
      diagnostics: [
        `Alignment ${profile.alignment}`,
        `Soul stat total ${power}`,
        `Signature ${profile.shareCode}`,
      ],
      primaryValue: String(profile.resonance),
      primaryLabel: "Karmic Debt",
    },
    {
      id: "rpg",
      label: "RPG",
      eyebrow: "Adventurer Sheet",
      title: `${profile.archetype} Loadout`,
      summary:
        "A role-playing combat shell distills the same seed into movement, survival, social force, and magic pressure.",
      tone: "amber",
      stats: statsForLabels(
        ["Vitality", "Resolve", "Guile", "Aura", "Fate", "Lore", "Drive", "Ward"],
        profile,
        2,
      ),
      diagnostics: [
        `Encounter tier ${1 + (profile.seed % 7)}`,
        `Party signal ${profile.alignment}`,
        `Loot drift ${38 + (profile.seed % 55)}%`,
      ],
      primaryValue: `${40 + (profile.seed % 58)}%`,
      primaryLabel: "Quest Readiness",
    },
    {
      id: "d20",
      label: "Illvium",
      eyebrow: "Tabletop Lens",
      title: `${profile.mark} Ability Array`,
      summary:
        "A d20-style mask converts the console seed into compact ability scores for playtesting persona balance.",
      tone: "rose",
      stats: statsForLabels(
        ["Strength", "Dexterity", "Constitution", "Intellect", "Insight", "Charisma"],
        profile,
        4,
        (value, index) => 7 + ((value + index * 3) % 13),
      ),
      diagnostics: [
        `Initiative trace +${1 + (profile.seed % 6)}`,
        `Saving arc ${profile.transit}`,
        `Legend threshold ${13 + (profile.seed % 8)}`,
      ],
      primaryValue: `+${1 + (profile.seed % 7)}`,
      primaryLabel: "Proficiency Pulse",
    },
    {
      id: "metaverse",
      label: "Metaverse",
      eyebrow: "World Presence",
      title: `${profile.mark} Spatial Identity`,
      summary:
        "A social-world readout exposes how the same profile might present across districts, wearables, and guild spaces.",
      tone: "lime",
      stats: statsForLabels(
        [
          "Avatar Signal",
          "Parcel Gravity",
          "Wearable Flair",
          "Social Reach",
          "DAO Voice",
          "Trade Echo",
        ],
        profile,
        6,
      ),
      diagnostics: [
        `District affinity ${profile.archetype}`,
        `Presence beacon ${profile.shareCode}`,
        `Crowd sync ${44 + (profile.seed % 52)}%`,
      ],
      primaryValue: `${profile.resonance + 12}`,
      primaryLabel: "World Resonance",
    },
    {
      id: "transit",
      label: "Creature",
      eyebrow: "Sky Preview",
      title: profile.transit,
      summary:
        "A placeholder transit channel reserves the console path for future live sky-state and natal-chart overlays.",
      tone: "violet",
      stats: statsForLabels(
        ["Solar Pressure", "Lunar Drift", "Mercury Relay", "Venus Pull", "Mars Heat"],
        profile,
        8,
      ),
      diagnostics: [
        "Ephemeris link reserved",
        `Seed date ${profile.dob}`,
        `Overlay lane ${profile.alignment}`,
      ],
      primaryValue: `${18 + (profile.seed % 79)}h`,
      primaryLabel: "Window Forecast",
    },
  ];
}
