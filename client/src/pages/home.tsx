import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format, subDays, addDays, startOfDay } from "date-fns";
import ConceptCarousel from "@/components/ConceptCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type ConceptBoxProps } from "@/components/ConceptBox";
import { type EventData, type CalendarEventData, type ExpenseItem, type InvestmentData, type ResearchItem, type AINewsResponse, type ScrapedResponse } from "@shared/schema";
import eventBg1 from "@assets/generated_images/Event_card_gradient_background_8c68dd6e.png";
import calendarBg from "@assets/generated_images/Calendar_card_gradient_background_f49550e0.png";
import expensesBg from "@assets/generated_images/Expenses_card_gradient_background_dd3e9188.png";
import investmentBg from "@assets/generated_images/Investment_card_gradient_background_8a3e8035.png";
import researchBg from "@assets/generated_images/Research_card_gradient_background_b8c29afa.png";

export default function Home() {
  // State for scraped data date navigation
  const [scrapedDate, setScrapedDate] = useState<Date>(startOfDay(new Date()));
  const today = startOfDay(new Date());
  const isScrapedDateToday = scrapedDate.getTime() === today.getTime();
  const scrapedDateStr = format(scrapedDate, "yyyy-MM-dd");
  // Get userId from URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userId');
  
  // Build query URL with userId parameter if present
  const buildQueryUrl = (endpoint: string) => {
    if (userId) {
      return `${endpoint}?userId=${encodeURIComponent(userId)}`;
    }
    return endpoint;
  };

  const { data: eventsResponse, isLoading: eventsLoading } = useQuery<{ data: EventData[], createdAt: string | null }>({
    queryKey: ["/api/events", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/events"));
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  const { data: calendarResponse, isLoading: calendarLoading } = useQuery<{ data: CalendarEventData[], createdAt: string | null }>({
    queryKey: ["/api/calendar", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/calendar"));
      if (!response.ok) throw new Error("Failed to fetch calendar");
      return response.json();
    },
  });

  const { data: expensesResponse, isLoading: expensesLoading } = useQuery<{ data: ExpenseItem[], createdAt: string | null }>({
    queryKey: ["/api/expenses", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/expenses"));
      if (!response.ok) throw new Error("Failed to fetch expenses");
      return response.json();
    },
  });

  const { data: investmentsResponse, isLoading: investmentsLoading } = useQuery<{ data: InvestmentData | null, createdAt: string | null }>({
    queryKey: ["/api/investments", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/investments"));
      if (!response.ok) throw new Error("Failed to fetch investments");
      return response.json();
    },
  });

  const { data: researchResponse, isLoading: researchLoading } = useQuery<{ data: ResearchItem[], createdAt: string | null }>({
    queryKey: ["/api/research", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/research"));
      if (!response.ok) throw new Error("Failed to fetch research");
      return response.json();
    },
  });

  const { data: aiNewsResponse, isLoading: aiNewsLoading } = useQuery<{ data: AINewsResponse | null, createdAt: string | null }>({
    queryKey: ["/api/ainews", userId],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl("/api/ainews"));
      if (!response.ok) throw new Error("Failed to fetch AI news");
      return response.json();
    },
  });

  const { data: scrapedResponse, isLoading: scrapedLoading } = useQuery<{ data: ScrapedResponse | null, createdAt: string | null }>({
    queryKey: ["/api/scraped", userId, scrapedDateStr],
    queryFn: async () => {
      let url = buildQueryUrl("/api/scraped");
      // Add date parameter
      url += url.includes('?') ? `&date=${scrapedDateStr}` : `?date=${scrapedDateStr}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch scraped data");
      return response.json();
    },
  });

  // Extract data from responses
  const events = eventsResponse?.data;
  const eventsCreatedAt = eventsResponse?.createdAt;
  const calendarEvents = calendarResponse?.data;
  const calendarCreatedAt = calendarResponse?.createdAt;
  const expenseItems = expensesResponse?.data;
  const expensesCreatedAt = expensesResponse?.createdAt;
  const investmentData = investmentsResponse?.data;
  const investmentsCreatedAt = investmentsResponse?.createdAt;
  const researchItems = researchResponse?.data;
  const researchCreatedAt = researchResponse?.createdAt;
  const aiNewsData = aiNewsResponse?.data;
  const aiNewsCreatedAt = aiNewsResponse?.createdAt;
  const scrapedData = scrapedResponse?.data;
  const scrapedCreatedAt = scrapedResponse?.createdAt;

  const isLoading = eventsLoading || calendarLoading || expensesLoading || investmentsLoading || researchLoading || aiNewsLoading || scrapedLoading;

  const concepts: ConceptBoxProps[] = [];

  // Add Events card if we have events
  if (events && events.length > 0) {
    concepts.push({
      title: "This week's picks",
      category: "Events",
      imageUrl: eventBg1,
      categoryColor: "bg-primary/20",
      createdAt: eventsCreatedAt,
      items: events.map((event) => ({
        type: "event" as const,
        date: event.date,
        location: event.location,
        name: event.name,
        url: event.url,
      })),
    });
  }

  // Add Calendar card if we have calendar events
  if (calendarEvents && calendarEvents.length > 0) {
    concepts.push({
      title: "Upcoming",
      category: "Calendar",
      imageUrl: calendarBg,
      categoryColor: "bg-cyan-500/20",
      createdAt: calendarCreatedAt,
      items: calendarEvents.map((calEvent) => ({
        type: "calendar" as const,
        summary: calEvent.summary,
        startTime: calEvent.startTime,
        link: calEvent.link,
        research: calEvent.research,
      })),
    });
  }

  // Add Research card if we have research items
  if (researchItems && researchItems.length > 0) {
    concepts.push({
      title: "Research Insights",
      category: "Research",
      imageUrl: researchBg,
      categoryColor: "bg-purple-500/20",
      createdAt: researchCreatedAt,
      items: researchItems.map((researchItem) => ({
        type: "research" as const,
        task: researchItem.task,
        result: researchItem.result,
      })),
    });
  }

  // Add AI News card if we have AI news data
  // Show summary first, then group by sources
  if (aiNewsData && aiNewsData.details && aiNewsData.details.length > 0) {
    const aiNewsItems = [];
    
    // Add summary item first
    if (aiNewsData.summary) {
      aiNewsItems.push({
        type: "ainews-summary" as const,
        summary: aiNewsData.summary,
      });
    }
    
    // Add source-level items
    aiNewsData.details.forEach((sourceData) => {
      if (sourceData.item_details && sourceData.item_details.length > 0) {
        aiNewsItems.push({
          type: "ainews-source" as const,
          source: sourceData.source,
          items: sourceData.item_details,
          message_id: sourceData.message_id,
        });
      }
    });

    if (aiNewsItems.length > 0) {
      concepts.push({
        title: "AI News",
        category: "AI News",
        imageUrl: researchBg, // Using research background temporarily
        categoryColor: "bg-blue-500/20",
        createdAt: aiNewsCreatedAt,
        items: aiNewsItems,
      });
    }
  }

  // Add Scraped Data card with date navigation
  // Show the card even if empty when navigating dates (so user can navigate back)
  const scrapedHasData = scrapedData && scrapedData.llm_summary && scrapedData.llm_summary.length > 0;
  if (scrapedHasData || !isScrapedDateToday) {
    concepts.push({
      title: scrapedHasData ? "Scraped Insights" : `No data for ${format(scrapedDate, "MMM d, yyyy")}`,
      category: "Scraped Data",
      imageUrl: researchBg,
      categoryColor: "bg-teal-500/20",
      createdAt: scrapedCreatedAt,
      dateNavigation: {
        currentDate: scrapedDateStr,
        isToday: isScrapedDateToday,
        onPrevious: () => setScrapedDate(subDays(scrapedDate, 1)),
        onNext: () => setScrapedDate(addDays(scrapedDate, 1)),
      },
      items: scrapedHasData ? scrapedData.llm_summary.map((item) => ({
        type: "scraped" as const,
        title: item.title,
        link: item.link,
        summary: item.summary,
      })) : [],
    });
  }

  // Add Expenses card if we have expense items (at the end)
  if (expenseItems && expenseItems.length > 0) {
    concepts.push({
      title: "Financial Overview",
      category: "Expenses",
      imageUrl: expensesBg,
      categoryColor: "bg-amber-500/20",
      createdAt: expensesCreatedAt,
      items: expenseItems.map((item) => ({
        type: "expense" as const,
        ...item,
      })),
    });
  }

  // Add Investment card if we have valid investment data (at the end)
  if (investmentData && investmentData.us_current_balance && investmentData.india_current_balance && investmentData.projection_12months) {
    concepts.push({
      title: "Investment Portfolio",
      category: "Investments",
      imageUrl: investmentBg,
      categoryColor: "bg-emerald-500/20",
      createdAt: investmentsCreatedAt,
      items: [{
        type: "investment" as const,
        ...investmentData,
      }],
    });
  }

  const hasAnyData = concepts.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto relative flex items-center justify-center px-6 py-6">
          <div className="text-center">
            <h1
              className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              style={{ fontFamily: "Manrope, sans-serif" }}
              data-testid="text-app-title"
            >
              PAPA
            </h1>
            <p
              className="text-xs text-muted-foreground mt-1 tracking-wide"
              style={{ fontFamily: "Inter, sans-serif" }}
              data-testid="text-app-subtitle"
            >
              Persistent Ambient Personal agents
            </p>
          </div>
          <div className="absolute right-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        {isLoading ? (
          <LoadingSkeleton />
        ) : hasAnyData ? (
          <ConceptCarousel concepts={concepts} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center px-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                No Data Yet
              </h2>
              <p className="text-muted-foreground">
                Events and calendar items will appear here when they are added to your Supabase
                database.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer">
            © 2025 Events Showcase. Discover and explore amazing events.
          </p>
        </div>
      </footer>
    </div>
  );
}
