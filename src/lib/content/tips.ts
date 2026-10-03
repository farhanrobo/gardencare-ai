/**
 * Static care-tips content — written by hand for this prototype.
 * This is general good-practice gardening information, not AI-generated
 * advice and not a replacement for local, professional guidance.
 */
import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Droplets,
  Leaf,
  ScanSearch,
  Sparkles,
  Sun,
  Trash2,
} from "lucide-react";

export interface CareTip {
  id: string;
  title: string;
  icon: LucideIcon;
  intro: string;
  points: string[];
}

export const CARE_TIPS: CareTip[] = [
  {
    id: "watering",
    title: "Watering",
    icon: Droplets,
    intro: "Most plant problems start with watering that is either too much or too little.",
    points: [
      "Water deeply and less often — this encourages roots to grow downward.",
      "Prefer morning watering so wet foliage dries during the day.",
      "Water the soil, not the leaves; splashing spreads fungal spores.",
      "Check the top few centimeters of soil before watering again.",
      "Use drip lines or a watering can instead of sprinklers where possible.",
    ],
  },
  {
    id: "sunlight",
    title: "Sunlight",
    icon: Sun,
    intro: "Light drives plant health — match each plant to the light your space actually gets.",
    points: [
      "Watch your garden at morning, noon and late afternoon to see real light levels.",
      "Rotate potted plants a quarter turn each week for even growth.",
      "Leaves that turn pale and leggy usually need more light, not more fertilizer.",
      "Burned or scorched patches on leaves can mean too much direct sun.",
      "Keep light-loving vegetables out of the shadow of walls and hedges.",
    ],
  },
  {
    id: "pest-prevention",
    title: "Pest prevention",
    icon: Bug,
    intro: "A weekly five-minute check stops most pest outbreaks before they spread.",
    points: [
      "Inspect leaf undersides, new shoots and stem joints — pests hide there.",
      "Encourage ladybirds, hoverflies and birds; they eat common garden pests.",
      "Remove weeds and plant debris that shelter slugs and aphids.",
      "Use yellow sticky traps to spot whiteflies and aphid flights early.",
      "Take a photo of anything unusual so you can compare again in a few days.",
    ],
  },
  {
    id: "disease-prevention",
    title: "Plant disease prevention",
    icon: Sparkles,
    intro: "Good airflow, dry foliage and clean tools prevent most outbreaks.",
    points: [
      "Space and prune plants so leaves dry quickly after rain.",
      "Disinfect pruners with alcohol wipes between plants.",
      "Water at the base and avoid working among plants when they are wet.",
      "Rotate crops so soil-borne disease is not fed the same host year after year.",
      "Remove and bin (don't compost) heavily diseased leaves and fruit.",
    ],
  },
  {
    id: "leaf-inspection",
    title: "Leaf inspection",
    icon: ScanSearch,
    intro: "Leaves tell the story first — know what a healthy leaf looks like for your crop.",
    points: [
      "Check both sides of leaves; many problems start underneath.",
      "Look for spots with rings, powdery coatings, mottling or curled edges.",
      "Note whether symptoms start low on the plant and work up.",
      "Photograph changes over a few days — pace matters as much as appearance.",
      "Scan a suspect leaf with GardenCare AI and keep the record in your history.",
    ],
  },
  {
    id: "garden-cleanliness",
    title: "Garden cleanliness",
    icon: Trash2,
    intro: "Many spores and pests overwinter in the tidiest-looking corners.",
    points: [
      "Clear fallen leaves and fruit from around plants at least weekly.",
      "Clean pots, stakes and trays before reuse.",
      "Keep a clearly marked spot for green waste separate from compost.",
      "Don't compost diseased plant material unless you know your pile gets hot enough.",
      "Dispose of pruning waste promptly rather than leaving it beside healthy plants.",
    ],
  },
];

export interface ScanQualityTip {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SCAN_QUALITY_TIPS: ScanQualityTip[] = [
  {
    icon: Leaf,
    title: "One leaf, close up",
    description: "Fill most of the frame with a single affected leaf so detail is visible.",
  },
  {
    icon: Sun,
    title: "Natural, even light",
    description: "Daylight without harsh shadows and glare works best.",
  },
  {
    icon: ScanSearch,
    title: "Show the symptoms",
    description: "Keep spots, discoloration or curling centered and in focus.",
  },
];
