import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { agentData, eventsResponseSchema, type EventData } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all events from agent_response JSON
  app.get("/api/events", async (req, res) => {
    try {
      const agentRecords = await db.select().from(agentData);
      
      let allEvents: EventData[] = [];
      
      // Parse agent_response JSON from each record
      for (const record of agentRecords) {
        if (record.agentResponse) {
          try {
            const parsed = JSON.parse(record.agentResponse);
            const validated = eventsResponseSchema.parse(parsed);
            allEvents = allEvents.concat(validated.events);
          } catch (parseError) {
            console.error("Error parsing agent_response:", parseError);
          }
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
