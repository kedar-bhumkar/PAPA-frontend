import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { events } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const allEvents = await db.select().from(events);
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
