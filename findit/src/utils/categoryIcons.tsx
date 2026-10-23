import {
  BookOpen,
  Droplet,
  Backpack,
  Watch,
  Shirt,
  Umbrella,
  Headphones,
  Trophy,
  KeyRound,
  Package,
} from "lucide-react";
import type { ComponentType } from "react";

type IconType = ComponentType<{ size?: number; className?: string }>;

export const CATEGORY_ICON_MAP: Record<string, IconType> = {
  "Books & Notebooks": BookOpen,
  "Water Bottles": Droplet,
  "Bags & Pencil Cases": Backpack,
  "School Accessories": Watch,
  "Clothing & Uniforms": Shirt,
  Umbrellas: Umbrella,
  Electronics: Headphones,
  "Sports Equipment": Trophy,
  "Keys & Personal Items": KeyRound,
  Other: Package,
};

export function getCategoryIcon(category: string): IconType {
  return CATEGORY_ICON_MAP[category] || Package;
}
