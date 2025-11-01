import { AlertTriangle, MapPin, Clock, TrendingUp, Droplets, Wind, CloudRain, Zap, Flame } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Alert } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
  onViewDetails?: (alert: Alert) => void;
  onGetRoute?: (alert: Alert) => void;
}

export function AlertCard({ alert, onViewDetails, onGetRoute }: AlertCardProps) {
  const getSeverityVariant = (severity: string): 'default' | 'destructive' | 'secondary' => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'moderate':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'flood':
        return <Droplets className="w-6 h-6" />;
      case 'cyclone':
        return <Wind className="w-6 h-6" />;
      case 'heavy_rainfall':
        return <CloudRain className="w-6 h-6" />;
      case 'earthquake':
        return <Zap className="w-6 h-6" />;
      case 'wildfire':
        return <Flame className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const formatDisasterType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card 
      className="hover-elevate transition-all duration-200" 
      data-testid={`card-alert-${alert.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary" data-testid={`icon-disaster-${alert.id}`}>
            {getDisasterIcon(alert.disasterType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={getSeverityVariant(alert.severity)} data-testid={`badge-severity-${alert.id}`}>
                {alert.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" data-testid={`badge-type-${alert.id}`}>
                {formatDisasterType(alert.disasterType)}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold leading-tight" data-testid={`text-title-${alert.id}`}>
              {alert.title}
            </h3>
          </div>
        </div>
        {alert.isActive && (
          <Badge variant="default" className="bg-success text-success-foreground animate-pulse" data-testid={`badge-active-${alert.id}`}>
            ACTIVE
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-description-${alert.id}`}>
          {alert.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2" data-testid={`info-location-${alert.id}`}>
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {alert.affectedRegions.slice(0, 2).join(', ')}
              {alert.affectedRegions.length > 2 && ` +${alert.affectedRegions.length - 2}`}
            </span>
          </div>
          <div className="flex items-center gap-2" data-testid={`info-time-${alert.id}`}>
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2" data-testid={`info-confidence-${alert.id}`}>
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`text-impact-${alert.id}`}>
            {alert.predictedImpact}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap pt-3 border-t">
        <Button 
          size="sm" 
          variant="default" 
          onClick={() => onViewDetails?.(alert)}
          data-testid={`button-view-details-${alert.id}`}
        >
          View Details
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onGetRoute?.(alert)}
          data-testid={`button-get-route-${alert.id}`}
        >
          <MapPin className="w-3 h-3 mr-1" />
          Get Evacuation Route
        </Button>
      </CardFooter>
    </Card>
  );
}
