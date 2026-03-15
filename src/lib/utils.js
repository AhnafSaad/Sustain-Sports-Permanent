import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- New Currency Formatter ---
export const formatPrice = (amount) => {
  // Exchange rate: 1 USD = 120 BDT
  const exchangeRate = 120;
  const bdtAmount = Math.round(amount * exchangeRate);
  
  // Returns format: "$10.00 / ৳1,200"
  return `$${Number(amount).toFixed(2)} / ৳${bdtAmount.toLocaleString('en-BD')}`;
};