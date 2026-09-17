"use client";

import { useEffect, useRef } from "react";
import { trackLandingEvent } from "@/lib/landing-tracking";

export function LandingPageTracking({ journey }: { journey: "client" | "provider" }) {
  const lastViewedJourney = useRef<string | null>(null);

  useEffect(() => {
    const trackView = () => {
      if (lastViewedJourney.current !== journey && trackLandingEvent("presta_certo_landing_view", journey)) lastViewedJourney.current = journey;
    };
    trackView();
    window.addEventListener('prestacerto:tracking-consent', trackView);

    const root = document.getElementById(`landing-${journey}`);
    const trackClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-landing-event]");
      if (!link || !root?.contains(link)) return;
      const action = link.dataset.landingEvent;
      if (action === "cta") trackLandingEvent("presta_certo_cta_click", journey);
      if (action === "journey_switch") trackLandingEvent("presta_certo_journey_switch", journey);
    };

    root?.addEventListener("click", trackClick);
    return () => {
      root?.removeEventListener("click", trackClick);
      window.removeEventListener('prestacerto:tracking-consent', trackView);
    };
  }, [journey]);

  return null;
}
