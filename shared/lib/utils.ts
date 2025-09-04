import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ["#E57373", "#9575CD", "#4FC3F7", "#81C784", "#FF8A65", "#F06292", "#7986CB"];

export function getUserColor(email: string): string {
  const hash = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
}
