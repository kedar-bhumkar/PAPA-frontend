import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConceptBox, { type ConceptBoxProps } from "./ConceptBox";

interface ConceptCarouselProps {
  concepts: ConceptBoxProps[];
}

export default function ConceptCarousel({ concepts }: ConceptCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Check scroll buttons on mount and when concepts change
    checkScrollButtons();
    
    // Also check after a short delay to account for layout settling
    const timer = setTimeout(checkScrollButtons, 100);
    
    return () => clearTimeout(timer);
  }, [concepts]);

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
      {/* Left Arrow - Only show if can scroll */}
      {canScrollLeft && (
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("left")}
          className="absolute left-1/2 -translate-x-16 top-1/2 z-20 -translate-y-1/2 h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 animate-fade-in"
          data-testid="button-scroll-left"
        >
          <ChevronLeft className="h-7 w-7 text-primary-foreground" />
        </Button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="hide-scrollbar flex gap-6 overflow-x-auto scroll-smooth px-16 py-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="animate-slide-in"
            style={{ 
              scrollSnapAlign: "center",
              animationDelay: `${index * 100}ms` 
            }}
          >
            <ConceptBox {...concept} />
          </div>
        ))}
      </div>

      {/* Right Arrow - Only show if can scroll */}
      {canScrollRight && (
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("right")}
          className="absolute left-1/2 translate-x-4 top-1/2 z-20 -translate-y-1/2 h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 animate-fade-in"
          data-testid="button-scroll-right"
        >
          <ChevronRight className="h-7 w-7 text-primary-foreground" />
        </Button>
      )}

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
