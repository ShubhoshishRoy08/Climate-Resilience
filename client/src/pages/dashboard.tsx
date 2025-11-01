import { useQuery } from '@tanstack/react-query';
import { DisasterMap } from '@/components/disaster-map';
import { AlertCard } from '@/components/alert-card';
import { PredictionPanel } from '@/components/prediction-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, MapPin, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Alert, Prediction } from '@shared/schema';

export default function Dashboard() {
  const { data: alerts, isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions'],
  });

  const { data: stats } = useQuery<{
    activeAlerts: number;
    totalPredictions: number;
    highRiskAreas: number;
    avgConfidence: number;
  }>({
    queryKey: ['/api/stats'],
  });

  const activeAlerts = alerts?.filter(a => a.isActive) || [];
  const recentPredictions = predictions?.slice(0, 3) || [];

  return (
    <div className="space-y-6 p-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-4xl font-bold mb-2">Disaster Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time AI-powered disaster forecasting and response coordination
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-stat-active-alerts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive" data-testid="text-active-alerts-count">
              {stats?.activeAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-predictions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Predictions
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary" data-testid="text-predictions-count">
              {stats?.totalPredictions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Generated in last 24h
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-high-risk">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Risk Areas
            </CardTitle>
            <MapPin className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning" data-testid="text-high-risk-count">
              {stats?.highRiskAreas || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently monitored
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-confidence">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Confidence
            </CardTitle>
            <Activity className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success" data-testid="text-avg-confidence">
              {stats?.avgConfidence ? `${stats.avgConfidence.toFixed(0)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Prediction accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-map">
            <CardHeader>
              <CardTitle>Risk Map</CardTitle>
              <CardDescription>
                Interactive map showing active disaster zones and risk areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <DisasterMap alerts={activeAlerts} />
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Alerts</h2>
            {alertsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : activeAlerts.length > 0 ? (
              <div className="space-y-4">
                {activeAlerts.slice(0, 3).map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No active alerts at the moment
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card data-testid="card-ai-predictions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI Predictions
              </CardTitle>
              <CardDescription>
                Latest disaster forecasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : recentPredictions.length > 0 ? (
                <div className="space-y-4">
                  {recentPredictions.map(prediction => (
                    <PredictionPanel key={prediction.id} prediction={prediction} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    No predictions available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
