import { useQuery } from "@tanstack/react-query";
import ConceptCarousel from "@/components/ConceptCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type ConceptBoxProps } from "@/components/ConceptBox";
import { type EventData } from "@shared/schema";
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function Home() {
  const { data: events, isLoading } = useQuery<EventData[]>({
    queryKey: ['/api/events'],
  });

  const concepts: ConceptBoxProps[] = events ? [
    {
      title: "Today's Picks",
      category: "Events",
      imageUrl: eventBg1,
      categoryColor: "bg-primary/20",
      items: events.map(event => ({
        date: event.date,
        location: event.location,
        name: event.name,
      })),
    },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-app-title">
              PAPA
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        {isLoading ? (
          <LoadingSkeleton />
        ) : events && events.length > 0 ? (
          <ConceptCarousel concepts={concepts} />
        ) : (
          <div className="flex min-h-[400px] items-center justify-center px-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-foreground">No Events Yet</h2>
              <p className="text-muted-foreground">
                Events will appear here when they are added to your Supabase database.
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
