import { useEffect, useRef, useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Alert, RiskZone } from '@shared/schema';

interface DisasterMapProps {
  alerts: Alert[];
  riskZones?: RiskZone[];
  userLocation?: { lat: number; lng: number };
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function DisasterMap({ alerts, riskZones = [], userLocation, onLocationSelect }: DisasterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<'alerts' | 'risk' | 'both'>('both');

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined' || !window.L) return;

    const L = window.L;
    const newMap = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(newMap);

    if (onLocationSelect) {
      newMap.on('click', (e: any) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !window.L) return;

    const L = window.L;
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    if (activeLayer === 'alerts' || activeLayer === 'both') {
      alerts.forEach((alert) => {
        const color = getSeverityColor(alert.severity);
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">${getDisasterIcon(alert.disasterType)}</div>`,
        });

        const marker = L.marker([alert.latitude, alert.longitude], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: 600; margin: 0 0 8px 0; color: ${color};">${alert.title}</h3>
            <p style="margin: 0 0 4px 0; font-size: 14px;">${alert.description}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;"><strong>Confidence:</strong> ${(alert.confidence * 100).toFixed(0)}%</p>
          </div>
        `);

        L.circle([alert.latitude, alert.longitude], {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          radius: 50000,
        }).addTo(map);
      });
    }

    if (activeLayer === 'risk' || activeLayer === 'both') {
      riskZones.forEach((zone) => {
        const color = getSeverityColor(zone.severity);
        L.polygon(zone.coordinates, {
          color: color,
          fillColor: color,
          fillOpacity: zone.opacity || 0.2,
          weight: 2,
        }).addTo(map);
      });
    }

    if (userLocation) {
      const icon = L.divIcon({
        className: 'user-marker',
        html: `<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      });
      L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map);
    }
  }, [map, alerts, riskZones, activeLayer, userLocation]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'moderate': return '#f59e0b';
      case 'low': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const getDisasterIcon = (type: string) => {
    // Using text symbols instead of emojis
    switch (type) {
      case 'flood': return 'W';
      case 'cyclone': return 'C';
      case 'heavy_rainfall': return 'R';
      case 'earthquake': return 'E';
      case 'wildfire': return 'F';
      default: return 'A';
    }
  };

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const handleLocate = () => {
    if (map && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 10);
    }
  };

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden" data-testid="disaster-map">
      <div ref={mapRef} className="w-full h-full" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]" data-testid="map-controls">
        <div className="flex gap-2 bg-card/95 backdrop-blur-sm p-2 rounded-md shadow-lg border">
          <Button
            size="sm"
            variant={activeLayer === 'alerts' ? 'default' : 'ghost'}
            onClick={() => setActiveLayer('alerts')}
            data-testid="button-layer-alerts"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Alerts
          </Button>
          <Button
            size="sm"
            variant={activeLayer === 'risk' ? 'default' : 'ghost'}
            onClick={() => setActiveLayer('risk')}
            data-testid="button-layer-risk"
          >
            <Layers className="w-4 h-4 mr-1" />
            Risk Zones
          </Button>
          <Button
            size="sm"
            variant={activeLayer === 'both' ? 'default' : 'ghost'}
            onClick={() => setActiveLayer('both')}
            data-testid="button-layer-both"
          >
            Both
          </Button>
        </div>
        
        <div className="flex flex-col gap-1 bg-card/95 backdrop-blur-sm p-1 rounded-md shadow-lg border">
          <Button size="icon" variant="ghost" onClick={handleZoomIn} data-testid="button-zoom-in">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleZoomOut} data-testid="button-zoom-out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          {userLocation && (
            <Button size="icon" variant="ghost" onClick={handleLocate} data-testid="button-locate">
              <Locate className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-4 rounded-md shadow-lg border max-w-xs z-[1000]" data-testid="map-legend">
        <h4 className="text-sm font-semibold mb-3">Severity Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#dc2626]" />
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ea580c]" />
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#84cc16]" />
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
