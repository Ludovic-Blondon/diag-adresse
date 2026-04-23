"use client";

import { useLinkStatus } from "next/link";

export function LinkPendingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent transition-opacity ${
        pending ? "opacity-60" : "opacity-0"
      }`}
    />
  );
}
