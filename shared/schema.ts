import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Supabase agent data table
export const agentData = pgTable("agent_output", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  agentName: text("agent_name"),
  agentResponse: text("agent_response"),
  status: text("status"),
});

export type AgentData = typeof agentData.$inferSelect;

// Event data structure (parsed from JSON)
export const eventSchema = z.object({
  name: z.string(),
  date: z.string(),
  location: z.string(),
  url: z.string().optional(),
});

export const eventsResponseSchema = z.object({
  events: z.array(eventSchema),
});

export type EventData = z.infer<typeof eventSchema>;
export type EventsResponse = z.infer<typeof eventsResponseSchema>;
