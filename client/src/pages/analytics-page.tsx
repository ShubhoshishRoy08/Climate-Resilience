import { useQuery } from '@tanstack/react-query';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalyticsData } from '@shared/schema';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });

  return (
    <div className="space-y-6 p-6" data-testid="page-analytics">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 className="w-10 h-10 text-primary" />
          Analytics & Performance
        </h1>
        <p className="text-muted-foreground">
          System performance metrics and prediction accuracy tracking
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      ) : analytics ? (
        <AnalyticsDashboard data={analytics} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Analytics will be available once the system starts generating predictions and alerts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
