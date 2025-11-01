import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { predictDisaster, generateEvacuationRoute } from "./gemini";
import { insertAlertSchema, insertUserLocationSchema, insertPredictionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Alerts endpoints
  app.get("/api/alerts", async (_req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alert" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validated = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validated);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  // User locations endpoints
  app.get("/api/locations", async (_req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const validated = insertUserLocationSchema.parse(req.body);
      const location = await storage.createLocation(validated);
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLocation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  // Predictions endpoints
  app.get("/api/predictions", async (_req, res) => {
    try {
      const predictions = await storage.getAllPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  app.post("/api/predictions", async (req, res) => {
    try {
      const { location, latitude, longitude } = req.body;

      // Use AI to generate prediction
      const aiPrediction = await predictDisaster(location, latitude, longitude);

      // Create prediction record
      const prediction = await storage.createPrediction({
        disasterType: aiPrediction.disasterType,
        location,
        latitude,
        longitude,
        probability: aiPrediction.probability,
        confidence: aiPrediction.confidence,
        contributingFactors: aiPrediction.contributingFactors,
        dataSources: ["Weather API", "Satellite Imagery", "Historical Data", "Climate Models"],
        predictedTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      });

      // If high probability, create an alert
      if (aiPrediction.probability > 0.6) {
        const severity = aiPrediction.probability > 0.8 ? 'critical' : 
                        aiPrediction.probability > 0.7 ? 'high' : 'moderate';

        await storage.createAlert({
          disasterType: aiPrediction.disasterType,
          severity,
          title: `${aiPrediction.disasterType.toUpperCase()} Warning - ${location}`,
          description: aiPrediction.reasoning,
          affectedRegions: [location],
          latitude,
          longitude,
          predictedImpact: `${severity} impact expected in the region`,
          confidence: aiPrediction.confidence,
          isActive: true,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        });
      }

      res.json(prediction);
    } catch (error) {
      console.error("Prediction error:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  // Evacuation routes endpoints
  app.get("/api/routes", async (_req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.get("/api/routes/alert/:alertId", async (req, res) => {
    try {
      const routes = await storage.getRoutesByAlert(req.params.alertId);
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const { alertId, startLocation, startLat, startLng } = req.body;

      const alert = await storage.getAlert(alertId);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      // Generate primary route using AI
      const primaryRoute = await generateEvacuationRoute(
        startLat,
        startLng,
        alert.disasterType,
        alert.severity
      );

      const route = await storage.createRoute({
        alertId,
        startLocation,
        startLat,
        startLng,
        endLocation: primaryRoute.endLocation,
        endLat: primaryRoute.endLat,
        endLng: primaryRoute.endLng,
        waypoints: primaryRoute.waypoints,
        distance: primaryRoute.distance,
        estimatedTime: primaryRoute.estimatedTime,
        safetyRating: primaryRoute.safetyRating,
        isPrimary: true,
      });

      // Generate 2 alternative routes
      const alternativeRoutes = [];
      for (let i = 0; i < 2; i++) {
        const altRoute = await generateEvacuationRoute(
          startLat,
          startLng,
          alert.disasterType,
          alert.severity
        );

        const alt = await storage.createRoute({
          alertId,
          startLocation,
          startLat,
          startLng,
          endLocation: altRoute.endLocation,
          endLat: altRoute.endLat,
          endLng: altRoute.endLng,
          waypoints: altRoute.waypoints,
          distance: altRoute.distance,
          estimatedTime: altRoute.estimatedTime,
          safetyRating: altRoute.safetyRating,
          isPrimary: false,
        });
        alternativeRoutes.push(alt);
      }

      res.json([route, ...alternativeRoutes]);
    } catch (error) {
      console.error("Route generation error:", error);
      res.status(500).json({ error: "Failed to generate routes" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (_req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Initialize with sample data
  app.post("/api/init-data", async (_req, res) => {
    try {
      // Create sample alerts
      const locations = [
        { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
        { name: "Coastal Odisha", lat: 20.2961, lng: 85.8245 },
      ];

      for (const loc of locations) {
        const aiPrediction = await predictDisaster(loc.name, loc.lat, loc.lng);
        
        if (Math.random() > 0.4) {
          const severity = aiPrediction.probability > 0.8 ? 'critical' :
                          aiPrediction.probability > 0.6 ? 'high' :
                          aiPrediction.probability > 0.4 ? 'moderate' : 'low';

          await storage.createAlert({
            disasterType: aiPrediction.disasterType,
            severity,
            title: `${aiPrediction.disasterType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Warning - ${loc.name}`,
            description: aiPrediction.reasoning || `AI detected potential ${aiPrediction.disasterType} risk in ${loc.name} region based on current weather patterns and historical data.`,
            affectedRegions: [loc.name],
            latitude: loc.lat,
            longitude: loc.lng,
            predictedImpact: `${severity.charAt(0).toUpperCase() + severity.slice(1)} impact expected`,
            confidence: aiPrediction.confidence,
            isActive: Math.random() > 0.3,
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          });
        }

        await storage.createPrediction({
          disasterType: aiPrediction.disasterType,
          location: loc.name,
          latitude: loc.lat,
          longitude: loc.lng,
          probability: aiPrediction.probability,
          confidence: aiPrediction.confidence,
          contributingFactors: aiPrediction.contributingFactors,
          dataSources: ["Weather API", "Satellite Data", "Historical Records", "Climate Models"],
          predictedTime: new Date(Date.now() + (Math.random() * 72 * 60 * 60 * 1000)),
        });
      }

      res.json({ success: true, message: "Sample data initialized" });
    } catch (error) {
      console.error("Init data error:", error);
      res.status(500).json({ error: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
