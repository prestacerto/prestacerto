"use client";

import { useEffect } from "react";
import { trackConfirmedPurchase } from "@/components/analytics";

export function ConfirmedPurchaseTracker({ transactionId, value }: { transactionId: string; value: number }) {
  useEffect(() => {
    const send = () => { trackConfirmedPurchase(transactionId, value); };
    send();
    window.addEventListener('prestacerto:tracking-consent', send);
    return () => window.removeEventListener('prestacerto:tracking-consent', send);
  }, [transactionId, value]);
  return null;
}
