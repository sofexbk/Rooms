import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 /*fd*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}