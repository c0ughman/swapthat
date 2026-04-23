/**
 * Public FitBudd pack (Swap That App). Override for builds with `NEXT_PUBLIC_APP_DOWNLOAD_URL`.
 */
export const DEFAULT_SWAP_THAT_APP_URL =
  "https://avasquez.fitbudd.com/packs/Fwfph4dB9RO0II1sEnU2" as const;

export function getSwapThatAppHref(): string {
  return process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL ?? DEFAULT_SWAP_THAT_APP_URL;
}
