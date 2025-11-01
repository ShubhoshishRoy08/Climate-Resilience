import { useQuery, useMutation } from '@tanstack/react-query';
import { LocationForm } from '@/components/location-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserLocation, InsertUserLocation } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function LocationsPage() {
  const { toast } = useToast();
  
  const { data: locations, isLoading } = useQuery<UserLocation[]>({
    queryKey: ['/api/locations'],
  });

  const addLocationMutation = useMutation({
    mutationFn: (data: InsertUserLocation) => 
      apiRequest('POST', '/api/locations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      toast({
        title: 'Location Registered',
        description: 'You will now receive alerts for this location.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to register location. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (id: string) => 
      apiRequest('DELETE', `/api/locations/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      toast({
        title: 'Location Removed',
        description: 'Alert notifications disabled for this location.',
      });
    },
  });

  return (
    <div className="space-y-6 p-6" data-testid="page-locations">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <MapPin className="w-10 h-10 text-primary" />
          My Locations
        </h1>
        <p className="text-muted-foreground">
          Manage locations for personalized disaster alerts
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Registered Locations</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : locations && locations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {locations.map(location => (
                <Card key={location.id} className="hover-elevate" data-testid={`card-location-${location.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-location-name-${location.id}`}>
                            {location.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteLocationMutation.mutate(location.id)}
                        disabled={deleteLocationMutation.isPending}
                        data-testid={`button-delete-${location.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Alert radius: {location.radius} km
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Monitoring:</div>
                      <div className="flex flex-wrap gap-1">
                        {location.notificationPreferences.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Locations Registered</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Register your first location to start receiving personalized disaster alerts for your area.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <LocationForm 
            onSubmit={(data) => addLocationMutation.mutate(data)}
            isPending={addLocationMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
