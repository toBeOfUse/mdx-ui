import { type ReactNode } from "react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const reactChildIsTag = (c: ReactNode, tag: string) =>
  !!c && typeof c === "object" && "type" in c && c.type.toString() === tag;

export const scanForTag = (tag: string) => (c: ReactNode) => reactChildIsTag(c, tag);
