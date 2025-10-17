import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { agentData, eventsResponseSchema, type EventData } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get events from the latest event_agent record
  app.get("/api/events", async (req, res) => {
    try {
      // Select the latest record where agent_name='event_agent', LIMIT 1
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(eq(agentData.agentName, 'event_agent'))
        .orderBy(desc(agentData.createdAt))
        .limit(1);
      
      let allEvents: EventData[] = [];
      
      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        try {
          const parsed = JSON.parse(latestRecord[0].agentResponse);
          const validated = eventsResponseSchema.parse(parsed);
          allEvents = validated.events;
        } catch (parseError) {
          console.error("Error parsing agent_response:", parseError);
        }
      }
      
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
