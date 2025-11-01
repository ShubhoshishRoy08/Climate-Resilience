import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '@shared/schema';

export function useRealtimeAlerts(enabled = true) {
  const { toast } = useToast();
  const previousAlertsRef = useRef<Set<string>>(new Set());

  // Poll for alerts every 10 seconds
  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: enabled ? 10000 : false, // 10 seconds
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!alerts || !enabled) return;

    const currentAlertIds = new Set(alerts.filter(a => a.isActive).map(a => a.id));
    const previousAlertIds = previousAlertsRef.current;

    // Find new alerts that weren't in the previous set
    const newAlerts = alerts.filter(
      alert => alert.isActive && !previousAlertIds.has(alert.id)
    );

    // Show toast notification for new alerts
    newAlerts.forEach(alert => {
      const severity = alert.severity === 'critical' || alert.severity === 'high' 
        ? 'destructive' 
        : 'default';

      toast({
        title: `New ${alert.severity.toUpperCase()} Alert`,
        description: alert.title,
        variant: severity as any,
        duration: 8000,
      });
    });

    // Update the reference for next comparison
    previousAlertsRef.current = currentAlertIds;
  }, [alerts, enabled, toast]);

  return { alerts, activeAlertCount: alerts?.filter(a => a.isActive).length || 0 };
}
