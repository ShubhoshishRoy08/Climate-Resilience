import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { insertUserLocationSchema, disasterTypes } from '@shared/schema';

const formSchema = insertUserLocationSchema.extend({
  name: z.string().min(2, 'Location name must be at least 2 characters'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1).max(100),
  notificationPreferences: z.array(z.string()).min(1, 'Select at least one disaster type'),
});

type FormData = z.infer<typeof formSchema>;

interface LocationFormProps {
  onSubmit: (data: FormData) => void;
  isPending?: boolean;
  defaultLocation?: { lat: number; lng: number };
}

export function LocationForm({ onSubmit, isPending, defaultLocation }: LocationFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      latitude: defaultLocation?.lat || 0,
      longitude: defaultLocation?.lng || 0,
      radius: 10,
      notificationPreferences: [],
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Card data-testid="card-location-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Register Your Location
        </CardTitle>
        <CardDescription>
          Get personalized disaster alerts for your area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              placeholder="e.g., Home, Office, School"
              {...form.register('name')}
              data-testid="input-location-name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive" data-testid="error-name">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="20.5937"
                {...form.register('latitude', { valueAsNumber: true })}
                data-testid="input-latitude"
              />
              {form.formState.errors.latitude && (
                <p className="text-sm text-destructive" data-testid="error-latitude">
                  {form.formState.errors.latitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="78.9629"
                {...form.register('longitude', { valueAsNumber: true })}
                data-testid="input-longitude"
              />
              {form.formState.errors.longitude && (
                <p className="text-sm text-destructive" data-testid="error-longitude">
                  {form.formState.errors.longitude.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Alert Radius (km)</Label>
            <Input
              id="radius"
              type="number"
              min="1"
              max="100"
              {...form.register('radius', { valueAsNumber: true })}
              data-testid="input-radius"
            />
            <p className="text-xs text-muted-foreground">
              You'll receive alerts for disasters within this radius
            </p>
            {form.formState.errors.radius && (
              <p className="text-sm text-destructive" data-testid="error-radius">
                {form.formState.errors.radius.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Disaster Types to Monitor</Label>
            <div className="grid grid-cols-2 gap-3">
              {disasterTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={form.watch('notificationPreferences')?.includes(type)}
                    onCheckedChange={(checked) => {
                      const current = form.getValues('notificationPreferences') || [];
                      if (checked) {
                        form.setValue('notificationPreferences', [...current, type]);
                      } else {
                        form.setValue(
                          'notificationPreferences',
                          current.filter((t) => t !== type)
                        );
                      }
                    }}
                    data-testid={`checkbox-${type}`}
                  />
                  <Label
                    htmlFor={type}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.notificationPreferences && (
              <p className="text-sm text-destructive" data-testid="error-preferences">
                {form.formState.errors.notificationPreferences.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            data-testid="button-submit-location"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isPending ? 'Registering...' : 'Register Location'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
