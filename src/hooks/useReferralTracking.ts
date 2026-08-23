import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useReferralTracking() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get('ref');
    if (referralCode) {
      const trackClick = async () => {
        try {
          await fetch('/api/referrals/track-click', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ referral_code: referralCode }),
          });

          localStorage.setItem('referral_code', referralCode);
        } catch (error) {
          console.error('Failed to track referral click:', error);
        }
      };

      trackClick();
    }
  }, [searchParams]);
}
