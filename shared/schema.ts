import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const disasterTypes = ["flood", "cyclone", "heavy_rainfall", "earthquake", "wildfire"] as const;
export type DisasterType = typeof disasterTypes[number];

export const severityLevels = ["low", "moderate", "high", "critical"] as const;
export type SeverityLevel = typeof severityLevels[number];

// Disaster Alerts
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disasterType: text("disaster_type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  affectedRegions: text("affected_regions").array().notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  predictedImpact: text("predicted_impact").notNull(),
  confidence: real("confidence").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// User Locations (for personalized alerts)
export const userLocations = pgTable("user_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: real("radius").notNull().default(10),
  notificationPreferences: text("notification_preferences").array().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserLocationSchema = createInsertSchema(userLocations).omit({
  id: true,
  createdAt: true,
});

export type InsertUserLocation = z.infer<typeof insertUserLocationSchema>;
export type UserLocation = typeof userLocations.$inferSelect;

// Predictions (AI-generated disaster predictions)
export const predictions = pgTable("predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  disasterType: text("disaster_type").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  probability: real("probability").notNull(),
  confidence: real("confidence").notNull(),
  contributingFactors: jsonb("contributing_factors").notNull(),
  dataSources: text("data_sources").array().notNull(),
  predictedTime: timestamp("predicted_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Prediction = typeof predictions.$inferSelect;

// Evacuation Routes
export const evacuationRoutes = pgTable("evacuation_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertId: varchar("alert_id").notNull(),
  startLocation: text("start_location").notNull(),
  startLat: real("start_lat").notNull(),
  startLng: real("start_lng").notNull(),
  endLocation: text("end_location").notNull(),
  endLat: real("end_lat").notNull(),
  endLng: real("end_lng").notNull(),
  waypoints: jsonb("waypoints").notNull(),
  distance: real("distance").notNull(),
  estimatedTime: real("estimated_time").notNull(),
  safetyRating: real("safety_rating").notNull(),
  isPrimary: boolean("is_primary").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEvacuationRouteSchema = createInsertSchema(evacuationRoutes).omit({
  id: true,
  createdAt: true,
});

export type InsertEvacuationRoute = z.infer<typeof insertEvacuationRouteSchema>;
export type EvacuationRoute = typeof evacuationRoutes.$inferSelect;

// Analytics Data
export interface AnalyticsData {
  totalPredictions: number;
  accuracyRate: number;
  activeAlerts: number;
  avgResponseTime: number;
  predictionsByType: Record<DisasterType, number>;
  accuracyTrend: Array<{ date: string; accuracy: number }>;
}

// Map Risk Zone
export interface RiskZone {
  id: string;
  disasterType: DisasterType;
  severity: SeverityLevel;
  coordinates: Array<[number, number]>;
  opacity: number;
}
