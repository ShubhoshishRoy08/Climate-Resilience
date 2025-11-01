import type {
  Alert,
  InsertAlert,
  UserLocation,
  InsertUserLocation,
  Prediction,
  InsertPrediction,
  EvacuationRoute,
  InsertEvacuationRoute,
  AnalyticsData,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Alerts
  getAllAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | undefined>;
  deleteAlert(id: string): Promise<boolean>;

  // User Locations
  getAllLocations(): Promise<UserLocation[]>;
  getLocation(id: string): Promise<UserLocation | undefined>;
  createLocation(location: InsertUserLocation): Promise<UserLocation>;
  deleteLocation(id: string): Promise<boolean>;

  // Predictions
  getAllPredictions(): Promise<Prediction[]>;
  getPrediction(id: string): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;

  // Evacuation Routes
  getAllRoutes(): Promise<EvacuationRoute[]>;
  getRoute(id: string): Promise<EvacuationRoute | undefined>;
  getRoutesByAlert(alertId: string): Promise<EvacuationRoute[]>;
  createRoute(route: InsertEvacuationRoute): Promise<EvacuationRoute>;

  // Analytics
  getAnalytics(): Promise<AnalyticsData>;
  getStats(): Promise<{
    activeAlerts: number;
    totalPredictions: number;
    highRiskAreas: number;
    avgConfidence: number;
  }>;
}

export class MemStorage implements IStorage {
  private alerts: Map<string, Alert>;
  private locations: Map<string, UserLocation>;
  private predictions: Map<string, Prediction>;
  private routes: Map<string, EvacuationRoute>;

  constructor() {
    this.alerts = new Map();
    this.locations = new Map();
    this.predictions = new Map();
    this.routes = new Map();
  }

  // Alerts
  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;

    const updated = { ...alert, ...updates };
    this.alerts.set(id, updated);
    return updated;
  }

  async deleteAlert(id: string): Promise<boolean> {
    return this.alerts.delete(id);
  }

  // User Locations
  async getAllLocations(): Promise<UserLocation[]> {
    return Array.from(this.locations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getLocation(id: string): Promise<UserLocation | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertUserLocation): Promise<UserLocation> {
    const id = randomUUID();
    const location: UserLocation = {
      ...insertLocation,
      id,
      createdAt: new Date(),
    };
    this.locations.set(id, location);
    return location;
  }

  async deleteLocation(id: string): Promise<boolean> {
    return this.locations.delete(id);
  }

  // Predictions
  async getAllPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPrediction(id: string): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = randomUUID();
    const prediction: Prediction = {
      ...insertPrediction,
      id,
      createdAt: new Date(),
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  // Evacuation Routes
  async getAllRoutes(): Promise<EvacuationRoute[]> {
    return Array.from(this.routes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getRoute(id: string): Promise<EvacuationRoute | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByAlert(alertId: string): Promise<EvacuationRoute[]> {
    return Array.from(this.routes.values()).filter(r => r.alertId === alertId);
  }

  async createRoute(insertRoute: InsertEvacuationRoute): Promise<EvacuationRoute> {
    const id = randomUUID();
    const route: EvacuationRoute = {
      ...insertRoute,
      id,
      createdAt: new Date(),
    };
    this.routes.set(id, route);
    return route;
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const predictions = Array.from(this.predictions.values());
    const alerts = Array.from(this.alerts.values());

    const predictionsByType: Record<string, number> = {
      flood: 0,
      cyclone: 0,
      heavy_rainfall: 0,
      earthquake: 0,
      wildfire: 0,
    };

    predictions.forEach(p => {
      if (p.disasterType in predictionsByType) {
        predictionsByType[p.disasterType]++;
      }
    });

    // Generate mock accuracy trend data
    const accuracyTrend = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      accuracy: 82 + Math.random() * 10,
    }));

    const avgConfidence = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      : 0;

    return {
      totalPredictions: predictions.length,
      accuracyRate: avgConfidence * 100,
      activeAlerts: alerts.filter(a => a.isActive).length,
      avgResponseTime: 3.2,
      predictionsByType: predictionsByType as any,
      accuracyTrend,
    };
  }

  async getStats(): Promise<{
    activeAlerts: number;
    totalPredictions: number;
    highRiskAreas: number;
    avgConfidence: number;
  }> {
    const predictions = Array.from(this.predictions.values());
    const alerts = Array.from(this.alerts.values());

    const avgConfidence = predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length
      : 0;

    const highRiskAreas = alerts.filter(
      a => a.isActive && (a.severity === 'critical' || a.severity === 'high')
    ).length;

    return {
      activeAlerts: alerts.filter(a => a.isActive).length,
      totalPredictions: predictions.filter(p => 
        new Date(p.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      highRiskAreas,
      avgConfidence: avgConfidence * 100,
    };
  }
}

export const storage = new MemStorage();
