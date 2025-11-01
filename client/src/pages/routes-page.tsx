import { useQuery } from '@tanstack/react-query';
import { EvacuationRoutes } from '@/components/evacuation-routes';
import { Card, CardContent } from '@/components/ui/card';
import { Route, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { EvacuationRoute } from '@shared/schema';

export default function RoutesPage() {
  const { data: routes, isLoading } = useQuery<EvacuationRoute[]>({
    queryKey: ['/api/routes'],
  });

  return (
    <div className="space-y-6 p-6" data-testid="page-routes">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Route className="w-10 h-10 text-primary" />
          Evacuation Routes
        </h1>
        <p className="text-muted-foreground">
          AI-optimized evacuation routes for active disaster zones
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : routes && routes.length > 0 ? (
        <EvacuationRoutes routes={routes} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Evacuation Routes Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Evacuation routes will be generated automatically when disaster alerts are active in your registered locations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
