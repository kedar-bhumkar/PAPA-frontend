import { useState, useEffect } from "react";
import ConceptCarousel from "@/components/ConceptCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type ConceptBoxProps } from "@/components/ConceptBox";
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [concepts, setConcepts] = useState<ConceptBoxProps[]>([]);

  useEffect(() => {
    // TODO: remove mock functionality - Replace with actual Supabase data fetching
    const mockConcepts: ConceptBoxProps[] = [
      {
        title: "Today's Picks",
        category: "Events",
        imageUrl: eventBg1,
        categoryColor: "bg-primary/20",
        items: [
          { date: 'June 15, 2025', place: 'Central Park, NYC', event: 'Summer Music Festival' },
          { date: 'June 22, 2025', place: 'Blue Note, Manhattan', event: 'Jazz Night Live' },
          { date: 'July 10, 2025', place: 'Convention Center, SF', event: 'Tech Summit 2025' },
          { date: 'July 18, 2025', place: 'MoMA, New York', event: 'Art Gallery Opening' },
          { date: 'August 5, 2025', place: 'Napa Valley, CA', event: 'Food & Wine Festival' },
          { date: 'August 12, 2025', place: 'Comedy Club, LA', event: 'Comedy Night Live' },
        ],
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setConcepts(mockConcepts);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-app-title">
              Events Showcase
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
              Discover amazing events near you
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        <div className="mb-8 px-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground" data-testid="text-section-title">
            Your Events
          </h2>
          <p className="text-muted-foreground" data-testid="text-section-description">
            Browse upcoming events at a glance
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <ConceptCarousel concepts={concepts} />
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
