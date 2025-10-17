import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard, { type EventCardProps } from "./EventCard";

interface EventCarouselProps {
  events: EventCardProps[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <Button
        size="icon"
        variant="secondary"
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/80 shadow-lg backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none"
        data-testid="button-scroll-left"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="hide-scrollbar flex gap-6 overflow-x-auto scroll-smooth px-8 py-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {events.map((event, index) => (
          <div
            key={index}
            className="animate-slide-in"
            style={{ 
              scrollSnapAlign: "center",
              animationDelay: `${index * 100}ms` 
            }}
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <Button
        size="icon"
        variant="secondary"
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/80 shadow-lg backdrop-blur-md transition-all disabled:opacity-0 disabled:pointer-events-none"
        data-testid="button-scroll-right"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
