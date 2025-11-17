import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import {
  agentData,
  eventsResponseSchema,
  calendarEventSchema,
  calendarEventsResponseSchema,
  expenseDataSchema,
  investmentDataSchema,
  researchResponseSchema,
  aiNewsResponseSchema,
  type EventData,
  type CalendarEventData,
  type ExpenseData,
  type ExpenseItem,
  type ExpenseDetail,
  type InvestmentData,
  type AINewsSource,
} from "@shared/schema";
import { and, eq, desc, sql } from "drizzle-orm";

// Helper function to transform raw expense data into normalized expense items with details
function transformExpenseData(data: ExpenseData): ExpenseItem[] {
  const items: ExpenseItem[] = [];

  // Helper to convert a record object into detail items, filtering out zero/null values
  const recordToDetails = (
    record: Record<string, number> | undefined,
  ): ExpenseDetail[] => {
    if (!record) return [];
    return Object.entries(record)
      .filter(
        ([key, value]) =>
          key !== "total" &&
          typeof value === "number" &&
          value > 0 &&
          !isNaN(value),
      )
      .map(([label, amount]) => ({
        label: label
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Salary (no details, just a single value)
  if (data.salary && data.salary > 0) {
    items.push({
      category: "Salary",
      amount: data.salary,
      icon: "salary",
    });
  }

  // Expenses with detailed breakdown
  if (data.expenses) {
    const total = data.expenses.total ?? 0;
    const details = recordToDetails(data.expenses);
    if (total > 0 || details.length > 0) {
      items.push({
        category: "Expenses",
        amount: total,
        icon: "expenses",
        details: details.length > 0 ? details : undefined,
      });
    }
  }

  // Subscriptions with detailed breakdown
  if (data.subscriptions) {
    const total = data.subscriptions.total ?? 0;
    const details = recordToDetails(data.subscriptions);
    if (total > 0 || details.length > 0) {
      items.push({
        category: "Subscriptions",
        amount: total,
        icon: "subscriptions",
        details: details.length > 0 ? details : undefined,
      });
    }
  }

  // Investments with detailed breakdown
  if (data.investments) {
    const total = data.investments.total ?? 0;
    const details = recordToDetails(data.investments);
    if (total > 0 || details.length > 0) {
      items.push({
        category: "Investments",
        amount: total,
        icon: "investments",
        details: details.length > 0 ? details : undefined,
      });
    }
  }

  // Savings with net and in_hand breakdown
  if (data.savings) {
    const net = data.savings.net ?? 0;
    const details: ExpenseDetail[] = [];

    if (data.savings.net && data.savings.net > 0) {
      details.push({ label: "Net", amount: data.savings.net });
    }
    if (data.savings.in_hand && data.savings.in_hand > 0) {
      details.push({ label: "In Hand", amount: data.savings.in_hand });
    }

    if (net > 0 || details.length > 0) {
      items.push({
        category: "Net Savings",
        amount: net,
        icon: "savings",
        details: details.length > 0 ? details : undefined,
      });
    }
  }

  return items;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get events from the latest successful event_agent record
  app.get("/api/events", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "event_agent"),
        sql`${agentData.status} = E'success\n'`, // E'' ensures real newline
      ];

      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='event_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let allEvents: EventData[] = [];
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          const parsed = JSON.parse(latestRecord[0].agentResponse);
          const validated = eventsResponseSchema.parse(parsed);
          allEvents = validated.events;
        } catch (parseError) {
          console.error("Error parsing agent_response:", parseError);
        }
      }

      res.json({ data: allEvents, createdAt });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get calendar events from the latest successful calendar_agent record
  app.get("/api/calendar", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "calendar_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];

      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='calendar_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let allCalendarEvents: CalendarEventData[] = [];
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      // Note: calendar_agent response is wrapped in an events object
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          // Handle case where agentResponse might already be parsed or is a string
          const response = latestRecord[0].agentResponse;
          const parsed =
            typeof response === "string" ? JSON.parse(response) : response;

          // Validate with the new schema that has events wrapper
          const validated = calendarEventsResponseSchema.parse(parsed);
          allCalendarEvents = validated.events;
        } catch (parseError) {
          console.error("Error parsing calendar agent_response:", parseError);
        }
      }

      res.json({ data: allCalendarEvents, createdAt });
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  // Get expense data from the latest successful expense_agent record
  app.get("/api/expenses", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "expense_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];

      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='expense_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let expenseItems: ExpenseItem[] = [];
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          // Handle case where agentResponse might already be parsed or is a string
          const response = latestRecord[0].agentResponse;
          const parsed =
            typeof response === "string" ? JSON.parse(response) : response;

          // Validate against schema
          const expenseData = expenseDataSchema.parse(parsed);

          // Transform raw data into normalized items with details
          expenseItems = transformExpenseData(expenseData);
        } catch (parseError) {
          console.error("Error parsing expense agent_response:", parseError);
        }
      }

      res.json({ data: expenseItems, createdAt });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  // Get investment data from the latest successful investment_agent record
  app.get("/api/investments", async (req, res) => {
    try {
      const userId = req.query.userId as string;

      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "investment_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];

      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='investment_agent', LIMIT 1
      // Using TRIM to handle potential newline at the end of status
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let investmentData: InvestmentData | null = null;
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          // Handle case where agentResponse might already be parsed or is a string
          const response = latestRecord[0].agentResponse;
          const parsed =
            typeof response === "string" ? JSON.parse(response) : response;

          // Validate against schema
          investmentData = investmentDataSchema.parse(parsed);
        } catch (parseError) {
          console.error("Error parsing investment agent_response:", parseError);
        }
      }

      res.json({ data: investmentData, createdAt });
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  // Get research data from the latest successful research_agent record
  app.get("/api/research", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "research_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];
      
      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='research_agent', LIMIT 1
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let researchItems: Array<{ task: string; result: string }> = [];
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          // Handle case where agentResponse might already be parsed or is a string
          const response = latestRecord[0].agentResponse;
          const parsed =
            typeof response === "string" ? JSON.parse(response) : response;

          // Handle both new format {"tasks": [...]} and legacy format [...]
          if (Array.isArray(parsed)) {
            // Legacy format: plain array
            console.log("Research agent response using legacy array format");
            researchItems = parsed;
          } else {
            // New format: wrapped in tasks object
            const researchData = researchResponseSchema.parse(parsed);
            researchItems = researchData.tasks;
          }
        } catch (parseError) {
          console.error("Error parsing research agent_response:", parseError);
        }
      }

      res.json({ data: researchItems, createdAt });
    } catch (error) {
      console.error("Error fetching research:", error);
      res.status(500).json({ error: "Failed to fetch research" });
    }
  });

  // Debug endpoint to see raw AI News data
  app.get("/api/ainews/debug", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      const conditions = [
        eq(agentData.agentName, "ainews_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];
      
      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      if (latestRecord.length > 0) {
        const response = latestRecord[0].agentResponse;
        res.json({ 
          raw: response,
          type: typeof response,
          length: typeof response === 'string' ? response.length : 'N/A',
          preview: typeof response === 'string' ? response.substring(8850, 8900) : 'N/A'
        });
      } else {
        res.json({ error: "No records found" });
      }
    } catch (error) {
      console.error("Error fetching debug AI News:", error);
      res.status(500).json({ error: "Failed to fetch debug AI News" });
    }
  });

  // Get AI News data from the latest successful ainews_agent record
  app.get("/api/ainews", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      // Build where conditions
      const conditions = [
        eq(agentData.agentName, "ainews_agent"),
        sql`TRIM(${agentData.status}) = 'success'`,
      ];
      
      if (userId) {
        conditions.push(eq(agentData.userId, userId));
      }

      // Select the latest successful record where agent_name='ainews_agent', LIMIT 1
      const latestRecord = await db
        .select()
        .from(agentData)
        .where(and(...conditions))
        .orderBy(desc(agentData.createdAt))
        .limit(1);

      let aiNewsData = null;
      let createdAt: Date | null = null;

      // Parse agent_response JSON from the latest record
      if (latestRecord.length > 0 && latestRecord[0].agentResponse) {
        createdAt = latestRecord[0].createdAt;
        try {
          // Handle case where agentResponse might already be parsed or is a string
          let response = latestRecord[0].agentResponse;
          let originalResponse = response;
          
          // If it's a string, try to URL-decode it first in case it contains encoded characters
          if (typeof response === "string") {
            try {
              // Try double-decoding in case it was encoded twice
              let decoded = decodeURIComponent(response);
              // Check if there are still encoded characters
              if (decoded.includes('%')) {
                decoded = decodeURIComponent(decoded);
              }
              
              // Fix common JSON formatting issues
              // Replace + characters with spaces (from URL encoding)
              decoded = decoded.replace(/\+/g, ' ');
              
              // Fix incomplete JSON - add missing closing brackets if needed
              if (decoded.endsWith('"}]}')) {
                decoded = decoded + ']}';
              }
              
              response = decoded;
            } catch (decodeError) {
              // If decoding fails, use the original string
              console.warn("Could not URL-decode AI news response, using original");
            }
          }
          
          const parsed =
            typeof response === "string" ? JSON.parse(response) : response;

          // Validate against schema
          aiNewsData = aiNewsResponseSchema.parse(parsed);
        } catch (parseError) {
          console.error("Error parsing ainews agent_response:", parseError);
          // Log more details about the error
          if (typeof latestRecord[0].agentResponse === 'string') {
            console.error("Original JSON around position 8863:", latestRecord[0].agentResponse.substring(8850, 8900));
          }
        }
      }

      res.json({ data: aiNewsData, createdAt });
    } catch (error) {
      console.error("Error fetching AI News:", error);
      res.status(500).json({ error: "Failed to fetch AI News" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
