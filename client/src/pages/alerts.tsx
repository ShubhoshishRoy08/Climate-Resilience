import { useQuery } from '@tanstack/react-query';
import { AlertCard } from '@/components/alert-card';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Alert } from '@shared/schema';
import { useState } from 'react';

export default function AlertsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('active');
  
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'active') return alert.isActive;
    if (filter === 'expired') return !alert.isActive;
    return true;
  }) || [];

  const groupedAlerts = {
    critical: filteredAlerts.filter(a => a.severity === 'critical'),
    high: filteredAlerts.filter(a => a.severity === 'high'),
    moderate: filteredAlerts.filter(a => a.severity === 'moderate'),
    low: filteredAlerts.filter(a => a.severity === 'low'),
  };

  return (
    <div className="space-y-6 p-6" data-testid="page-alerts">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <AlertTriangle className="w-10 h-10 text-destructive" />
          Active Disaster Alerts
        </h1>
        <p className="text-muted-foreground">
          Monitor and respond to real-time disaster warnings
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active" data-testid="tab-active">
            Active ({alerts?.filter(a => a.isActive).length || 0})
          </TabsTrigger>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({alerts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="expired" data-testid="tab-expired">
            Expired ({alerts?.filter(a => !a.isActive).length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-6 mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-56 w-full" />
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {filter === 'active' 
                    ? "There are no active disaster alerts at the moment. The system is continuously monitoring for threats."
                    : filter === 'expired'
                    ? "No expired alerts in the system."
                    : "No alerts available in the system."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {groupedAlerts.critical.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-destructive flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    Critical Alerts ({groupedAlerts.critical.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedAlerts.critical.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {groupedAlerts.high.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    High Severity Alerts ({groupedAlerts.high.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedAlerts.high.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {groupedAlerts.moderate.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-warning flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    Moderate Alerts ({groupedAlerts.moderate.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedAlerts.moderate.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {groupedAlerts.low.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    Low Severity Alerts ({groupedAlerts.low.length})
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {groupedAlerts.low.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
