import { useQuery } from "@tanstack/react-query";
import ConceptCarousel from "@/components/ConceptCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type ConceptBoxProps } from "@/components/ConceptBox";
import { type EventData, type CalendarEventData } from "@shared/schema";
import eventBg1 from "@assets/generated_images/Event_card_gradient_background_8c68dd6e.png";
import calendarBg from "@assets/generated_images/Calendar_card_gradient_background_f49550e0.png";

export default function Home() {
  const { data: events, isLoading: eventsLoading } = useQuery<EventData[]>({
    queryKey: ["/api/events"],
  });

  const { data: calendarEvents, isLoading: calendarLoading } = useQuery<CalendarEventData[]>({
    queryKey: ["/api/calendar"],
  });

  const isLoading = eventsLoading || calendarLoading;

  const concepts: ConceptBoxProps[] = [];

  // Add Events card if we have events
  if (events && events.length > 0) {
    concepts.push({
      title: "This week's picks",
      category: "Events",
      imageUrl: eventBg1,
      categoryColor: "bg-primary/20",
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
      items: calendarEvents.map((calEvent) => ({
        type: "calendar" as const,
        summary: calEvent.summary,
        startTime: calEvent.startTime,
        link: calEvent.link,
      })),
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
