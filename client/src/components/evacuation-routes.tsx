import { Navigation, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EvacuationRoute } from '@shared/schema';

interface EvacuationRoutesProps {
  routes: EvacuationRoute[];
  onSelectRoute?: (route: EvacuationRoute) => void;
}

export function EvacuationRoutes({ routes, onSelectRoute }: EvacuationRoutesProps) {
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) {
        next.delete(routeId);
      } else {
        next.add(routeId);
      }
      return next;
    });
  };

  const getSafetyBadge = (rating: number) => {
    if (rating >= 0.8) return { variant: 'default' as const, label: 'Very Safe', color: 'bg-success' };
    if (rating >= 0.6) return { variant: 'secondary' as const, label: 'Safe', color: 'bg-info' };
    if (rating >= 0.4) return { variant: 'default' as const, label: 'Moderate', color: 'bg-warning' };
    return { variant: 'destructive' as const, label: 'Caution', color: 'bg-destructive' };
  };

  const primaryRoute = routes.find(r => r.isPrimary);
  const alternativeRoutes = routes.filter(r => !r.isPrimary);

  return (
    <div className="space-y-4" data-testid="evacuation-routes">
      {primaryRoute && (
        <Card className="border-primary" data-testid="card-primary-route">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Recommended Route
              </CardTitle>
              <Badge variant="default" className="bg-primary">PRIMARY</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <RouteDetails route={primaryRoute} onSelect={onSelectRoute} />
          </CardContent>
        </Card>
      )}

      {alternativeRoutes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            Alternative Routes ({alternativeRoutes.length})
          </h3>
          {alternativeRoutes.map((route) => (
            <Card key={route.id} data-testid={`card-route-${route.id}`}>
              <CardHeader className="cursor-pointer hover-elevate" onClick={() => toggleRoute(route.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{route.startLocation} → {route.endLocation}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                        <span>{route.distance.toFixed(1)} km</span>
                        <span>•</span>
                        <span>{Math.round(route.estimatedTime)} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSafetyBadge(route.safetyRating).label && (
                      <Badge variant={getSafetyBadge(route.safetyRating).variant}>
                        {getSafetyBadge(route.safetyRating).label}
                      </Badge>
                    )}
                    {expandedRoutes.has(route.id) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedRoutes.has(route.id) && (
                <CardContent className="pt-0">
                  <RouteDetails route={route} onSelect={onSelectRoute} />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RouteDetails({ route, onSelect }: { route: EvacuationRoute; onSelect?: (route: EvacuationRoute) => void }) {
  const safety = getSafetyBadge(route.safetyRating);
  const waypoints = (route.waypoints as any[]) || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Distance</div>
          <div className="text-2xl font-bold">{route.distance.toFixed(1)} km</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Est. Time</div>
          <div className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {Math.round(route.estimatedTime)} min
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">Safety Rating:</div>
        <Badge variant={safety.variant}>{safety.label}</Badge>
        <div className="text-sm font-mono ml-auto">{(route.safetyRating * 100).toFixed(0)}%</div>
      </div>

      {waypoints.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Route Steps</div>
          <div className="space-y-2 pl-4 border-l-2 border-muted">
            <div className="flex items-start gap-2 -ml-[9px]">
              <div className="w-4 h-4 rounded-full bg-success border-2 border-background mt-0.5" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{route.startLocation}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {route.startLat.toFixed(4)}, {route.startLng.toFixed(4)}
                </div>
              </div>
            </div>
            {waypoints.map((waypoint: any, index: number) => (
              <div key={index} className="flex items-start gap-2 -ml-[9px]">
                <div className="w-4 h-4 rounded-full bg-muted border-2 border-background mt-0.5" />
                <div className="flex-1 text-sm">
                  <div className="text-muted-foreground">{waypoint.name || `Waypoint ${index + 1}`}</div>
                  {waypoint.instruction && (
                    <div className="text-xs text-muted-foreground mt-0.5">{waypoint.instruction}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-2 -ml-[9px]">
              <div className="w-4 h-4 rounded-full bg-primary border-2 border-background mt-0.5" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{route.endLocation}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {route.endLat.toFixed(4)}, {route.endLng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {onSelect && (
        <Button className="w-full" onClick={() => onSelect(route)} data-testid={`button-select-route-${route.id}`}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Select This Route
        </Button>
      )}
    </div>
  );
}

function getSafetyBadge(rating: number) {
  if (rating >= 0.8) return { variant: 'default' as const, label: 'Very Safe', color: 'bg-success' };
  if (rating >= 0.6) return { variant: 'secondary' as const, label: 'Safe', color: 'bg-info' };
  if (rating >= 0.4) return { variant: 'default' as const, label: 'Moderate', color: 'bg-warning' };
  return { variant: 'destructive' as const, label: 'Caution', color: 'bg-destructive' };
}
