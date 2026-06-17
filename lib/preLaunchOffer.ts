export const preLaunchOffer = {
  amount: "3.00",
  displayPrice: "$3",
  audience: "first 100 users",
  honor: "Vanguard Honor",
  label: "Pre-launch rate",
  launchWindow: "before launch",
} as const;

export const preLaunchOfferSummary = `${preLaunchOffer.displayPrice} for the ${preLaunchOffer.audience}, including ${preLaunchOffer.honor}.`;
