import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeSubscription(
  table: string,
  filter: string,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel(`${table}:${filter}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter, callback]);
}
