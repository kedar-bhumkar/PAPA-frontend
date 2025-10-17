import { useState, useEffect } from "react";
import EventCarousel from "@/components/EventCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type EventCardProps } from "@/components/EventCard";
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';
import eventBg2 from '@assets/generated_images/Concert_event_background_cb08115d.png';
import eventBg3 from '@assets/generated_images/Tech_conference_background_3124e347.png';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventCardProps[]>([]);

  useEffect(() => {
    // TODO: remove mock functionality - Replace with actual Supabase data fetching
    const mockEvents: EventCardProps[] = [
      {
        title: "Summer Music Festival",
        date: "Jun 15, 2025",
        location: "Central Park, New York",
        description: "Experience an unforgettable evening of live music featuring top artists from around the world.",
        category: "Music",
        imageUrl: eventBg1,
      },
      {
        title: "Live Jazz Night",
        date: "Jun 22, 2025",
        location: "Blue Note, Manhattan",
        description: "An intimate evening with renowned jazz musicians in the heart of the city.",
        category: "Concert",
        imageUrl: eventBg2,
      },
      {
        title: "Tech Summit 2025",
        date: "Jul 10, 2025",
        location: "Convention Center, SF",
        description: "Join industry leaders to explore the latest innovations in technology and AI.",
        category: "Conference",
        imageUrl: eventBg3,
      },
      {
        title: "Art Gallery Opening",
        date: "Jul 18, 2025",
        location: "MoMA, New York",
        description: "Discover contemporary masterpieces from emerging artists worldwide.",
        category: "Art",
        imageUrl: eventBg1,
      },
      {
        title: "Food & Wine Festival",
        date: "Aug 5, 2025",
        location: "Napa Valley, CA",
        description: "Savor exquisite cuisine and fine wines from award-winning chefs and vintners.",
        category: "Food",
        imageUrl: eventBg2,
      },
      {
        title: "Comedy Night Live",
        date: "Aug 12, 2025",
        location: "Comedy Club, LA",
        description: "Laugh out loud with the funniest comedians performing live on stage.",
        category: "Comedy",
        imageUrl: eventBg3,
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setEvents(mockEvents);
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
            Today's Picks
          </h2>
          <p className="text-muted-foreground" data-testid="text-section-description">
            Explore curated events happening this week
          </p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <EventCarousel events={events} />
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
