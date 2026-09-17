"use client";

import { useEffect } from "react";

export function ProfileViewTracker({ freelancerId }: { freelancerId: string }) {
  useEffect(() => {
    fetch(`/api/profile/${freelancerId}/view`, { method: 'POST', keepalive: true }).catch(() => null);
  }, [freelancerId]);

  return null;
}
