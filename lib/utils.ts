import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPrice(price: number, currency: string = "XAF"): string {
  return new Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: currency,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}


export function formatTime(
  date: Date | string,
  locale: string = "en-US",
  timeZone: string = "Africa/Lagos"
): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: locale.startsWith("en"),
    timeZone,
    timeZoneName: "short",
  }).format(new Date(date));
}