import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import {
  agentData,
  eventsResponseSchema,
  calendarEventSchema,
  type EventData,
  type CalendarEventData,
} from "@shared/schema";
import { and, eq, desc, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get events from the latest successful event_agent record
  app.get("/api/events", async (req, res) => {
    try {
      // Select the latest successful record where agent_name='event_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(
          and(
            eq(agentData.agentName, "event_agent"),
            sql`TRIM(${agentData.status}) = 'success'`
          )
        )
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

  // Get calendar events from the latest successful calendar_agent record
  app.get("/api/calendar", async (req, res) => {
    try {
      // Select the latest successful record where agent_name='calendar_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(
          and(
            eq(agentData.agentName, "calendar_agent"),
            sql`TRIM(${agentData.status}) = 'success'`
          )
        )
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let allCalendarEvents: CalendarEventData[] = [];

      // Parse agent_response JSON from the latest record
      // Note: calendar_agent response is directly an array, not wrapped
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        try {
          // Handle case where agentResponse might already be parsed or is a string
          const response = latestRecord[0].agentResponse;
          const parsed = typeof response === 'string' ? JSON.parse(response) : response;
          
          // Validate it's an array
          if (Array.isArray(parsed)) {
            allCalendarEvents = parsed.map(event => 
              calendarEventSchema.parse(event)
            );
          }
        } catch (parseError) {
          console.error("Error parsing calendar agent_response:", parseError);
        }
      }

      res.json(allCalendarEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
