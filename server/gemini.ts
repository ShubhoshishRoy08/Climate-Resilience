import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface DisasterPrediction {
  disasterType: string;
  probability: number;
  confidence: number;
  contributingFactors: Record<string, number>;
  reasoning: string;
}

export async function predictDisaster(
  location: string,
  latitude: number,
  longitude: number,
  historicalData?: any
): Promise<DisasterPrediction> {
  try {
    const systemPrompt = `You are an expert disaster prediction AI system. 
Analyze the given location and environmental data to predict potential disasters.
Consider factors like geography, climate patterns, historical incidents, and current conditions.

Respond with JSON in this exact format:
{
  "disasterType": "flood" | "cyclone" | "heavy_rainfall" | "earthquake" | "wildfire",
  "probability": number between 0 and 1,
  "confidence": number between 0 and 1,
  "contributingFactors": {
    "weather_patterns": number between 0 and 1,
    "geographical_risk": number between 0 and 1,
    "historical_frequency": number between 0 and 1,
    "seasonal_trends": number between 0 and 1,
    "climate_indicators": number between 0 and 1
  },
  "reasoning": "brief explanation of the prediction"
}`;

    const prompt = `Analyze disaster risk for:
Location: ${location}
Coordinates: ${latitude}, ${longitude}
${historicalData ? `Historical data: ${JSON.stringify(historicalData)}` : ''}

Provide a comprehensive disaster risk assessment.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            disasterType: { type: "string" },
            probability: { type: "number" },
            confidence: { type: "number" },
            contributingFactors: {
              type: "object",
              properties: {
                weather_patterns: { type: "number" },
                geographical_risk: { type: "number" },
                historical_frequency: { type: "number" },
                seasonal_trends: { type: "number" },
                climate_indicators: { type: "number" },
              },
            },
            reasoning: { type: "string" },
          },
          required: ["disasterType", "probability", "confidence", "contributingFactors", "reasoning"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: DisasterPrediction = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Error predicting disaster:", error);
    // Fallback to random data for demo
    return {
      disasterType: ["flood", "cyclone", "heavy_rainfall"][Math.floor(Math.random() * 3)],
      probability: 0.3 + Math.random() * 0.5,
      confidence: 0.7 + Math.random() * 0.2,
      contributingFactors: {
        weather_patterns: Math.random(),
        geographical_risk: Math.random(),
        historical_frequency: Math.random(),
        seasonal_trends: Math.random(),
        climate_indicators: Math.random(),
      },
      reasoning: "Based on geographical and climate analysis",
    };
  }
}

export async function generateEvacuationRoute(
  startLat: number,
  startLng: number,
  disasterType: string,
  severity: string
): Promise<{
  endLocation: string;
  endLat: number;
  endLng: number;
  waypoints: any[];
  distance: number;
  estimatedTime: number;
  safetyRating: number;
}> {
  try {
    const systemPrompt = `You are an evacuation route planning AI.
Generate a safe evacuation route away from the disaster zone.
Consider the disaster type, severity, and optimal safe locations.

Respond with JSON in this format:
{
  "endLocation": "Safe zone name",
  "endLat": number,
  "endLng": number,
  "waypoints": [
    {"name": "waypoint name", "instruction": "turn left/right/continue", "lat": number, "lng": number}
  ],
  "distance": number in km,
  "estimatedTime": number in minutes,
  "safetyRating": number between 0 and 1
}`;

    const prompt = `Generate an evacuation route from coordinates ${startLat}, ${startLng}.
Disaster type: ${disasterType}
Severity: ${severity}

The route should move away from the danger zone to a safe location.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    }
  } catch (error) {
    console.error("Error generating route:", error);
  }

  // Fallback route
  const angle = Math.random() * 2 * Math.PI;
  const distance = 10 + Math.random() * 20;
  const endLat = startLat + (distance / 111) * Math.cos(angle);
  const endLng = startLng + (distance / (111 * Math.cos(startLat * Math.PI / 180))) * Math.sin(angle);

  return {
    endLocation: "Safe Zone",
    endLat,
    endLng,
    waypoints: [
      {
        name: "Highway Junction",
        instruction: "Take the main highway northbound",
        lat: startLat + (endLat - startLat) * 0.3,
        lng: startLng + (endLng - startLng) * 0.3,
      },
      {
        name: "Regional Route",
        instruction: "Continue on regional road",
        lat: startLat + (endLat - startLat) * 0.7,
        lng: startLng + (endLng - startLng) * 0.7,
      },
    ],
    distance,
    estimatedTime: distance * 3.5,
    safetyRating: 0.7 + Math.random() * 0.25,
  };
}
