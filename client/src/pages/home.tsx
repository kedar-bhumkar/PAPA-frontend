import { useState, useEffect } from "react";
import ConceptCarousel from "@/components/ConceptCarousel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { type ConceptBoxProps } from "@/components/ConceptBox";
import { Calendar, MapPin, Users, DollarSign, TrendingUp, Briefcase } from "lucide-react";
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';
import eventBg2 from '@assets/generated_images/Concert_event_background_cb08115d.png';
import eventBg3 from '@assets/generated_images/Tech_conference_background_3124e347.png';

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
          { label: 'Date', value: 'June 15, 2025', icon: Calendar },
          { label: 'Place', value: 'Central Park, NYC', icon: MapPin },
          { label: 'Event', value: 'Summer Music Festival', icon: Users },
          { label: 'Date', value: 'June 22, 2025', icon: Calendar },
          { label: 'Place', value: 'Blue Note, Manhattan', icon: MapPin },
          { label: 'Event', value: 'Jazz Night Live', icon: Users },
          { label: 'Date', value: 'July 10, 2025', icon: Calendar },
          { label: 'Place', value: 'Convention Center, SF', icon: MapPin },
          { label: 'Event', value: 'Tech Summit 2025', icon: Users },
        ],
      },
      {
        title: "PAPA",
        category: "Appointments",
        imageUrl: eventBg2,
        categoryColor: "bg-chart-2/20",
        items: [
          { label: 'Date', value: 'June 18, 2025', icon: Calendar },
          { label: 'Location', value: 'Medical Center', icon: MapPin },
          { label: 'Event', value: 'Annual Health Checkup', icon: Briefcase },
          { label: 'Date', value: 'June 25, 2025', icon: Calendar },
          { label: 'Location', value: 'Downtown Office', icon: MapPin },
          { label: 'Event', value: 'Business Meeting', icon: Briefcase },
          { label: 'Date', value: 'July 2, 2025', icon: Calendar },
          { label: 'Location', value: 'City Hall', icon: MapPin },
          { label: 'Event', value: 'Legal Consultation', icon: Briefcase },
        ],
      },
      {
        title: "Main Usa",
        category: "Financial",
        imageUrl: eventBg3,
        categoryColor: "bg-chart-3/20",
        items: [
          { label: 'Account', value: 'Checking - $5,240', icon: DollarSign },
          { label: 'Investment', value: 'Portfolio +12%', icon: TrendingUp },
          { label: 'Savings', value: 'Goal: $10,000', icon: DollarSign },
          { label: 'Recent', value: 'Payment Received', icon: TrendingUp },
          { label: 'Stock', value: 'Tech Shares +5%', icon: TrendingUp },
          { label: 'Expense', value: 'Monthly Budget', icon: DollarSign },
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
              Concept Showcase
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
              Your personalized information at a glance
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        <div className="mb-8 px-8">
          <h2 className="mb-2 text-3xl font-bold text-foreground" data-testid="text-section-title">
            Your Dashboard
          </h2>
          <p className="text-muted-foreground" data-testid="text-section-description">
            Browse through different concepts to see your information
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
            © 2025 Concept Showcase. Your information, beautifully organized.
          </p>
        </div>
      </footer>
    </div>
  );
}
