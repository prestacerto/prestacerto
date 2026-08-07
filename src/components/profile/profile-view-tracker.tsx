"use client";

import { useEffect } from "react";

export function ProfileViewTracker({ freelancerId }: { freelancerId: string }) {
  useEffect(() => {
    fetch(`/api/profile/${freelancerId}/view`, { method: "POST" }).catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- só dispara uma vez no mount
  }, []);

  return null;
}
