"use client";

import type { ReactNode } from "react";
import { useLinkStatus } from "next/link";

function Spinner() {
  return (
    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

export function LinkPendingIndicator() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`inline-flex transition-opacity ${
        pending ? "opacity-60" : "opacity-0"
      }`}
    >
      <Spinner />
    </span>
  );
}

/**
 * Libellé de lien qui s'estompe sous un spinner centré pendant la navigation.
 * Pour les liens compacts (pastilles de villes), où un indicateur à côté du
 * texte décentrerait le libellé : rien ne bouge, le spinner se superpose. Le
 * lien parent doit être `relative`.
 */
export function LinkPendingLabel({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <>
      <span className={`transition-opacity ${pending ? "opacity-25" : ""}`}>
        {children}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${
          pending ? "opacity-80" : "opacity-0"
        }`}
      >
        <Spinner />
      </span>
    </>
  );
}
