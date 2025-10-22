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

// Calendar event data structure (parsed from JSON array)
export const calendarEventSchema = z.object({
  summary: z.string(),
  startTime: z.string(),
  link: z.string(),
  id: z.string(),
});

export type CalendarEventData = z.infer<typeof calendarEventSchema>;

// Expense data structure (parsed from JSON)
export const expenseDataSchema = z.object({
  salary: z.number().optional(),
  expenses: z.record(z.number()).optional(),
  subscriptions: z.record(z.number()).optional(),
  investments: z.record(z.number()).optional(),
  savings: z.object({
    net: z.number().optional(),
    in_hand: z.number().optional(),
  }).optional(),
});

export type ExpenseData = z.infer<typeof expenseDataSchema>;

// Expense detail line item
export const expenseDetailSchema = z.object({
  label: z.string(),
  amount: z.number(),
});

export type ExpenseDetail = z.infer<typeof expenseDetailSchema>;

// Normalized expense item with optional details for expansion
export const expenseItemSchema = z.object({
  category: z.string(),
  amount: z.number(),
  icon: z.enum(["salary", "expenses", "subscriptions", "investments", "savings"]),
  details: z.array(expenseDetailSchema).optional(),
});

export type ExpenseItem = z.infer<typeof expenseItemSchema>;

// Investment data structure (parsed from JSON)
export const investmentDataSchema = z.object({
  us_projected_balance: z.object({
    amex: z.string(),
    vanguard: z.string(),
    crypto: z.string(),
    stocks: z.string(),
  }),
  india_projected_balance: z.object({
    savings: z.string(),
    stocks: z.string(),
    FD: z.string(),
    RD: z.string(),
  }),
  projection: z.object({
    us_investments: z.string(),
    india_investments: z.string(),
  }),
  advice: z.object({
    us_investments: z.string(),
    india_investments: z.string(),
    notes: z.string(),
  }).optional(),
});

export type InvestmentData = z.infer<typeof investmentDataSchema>;
