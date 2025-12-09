import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConceptBox, { type ConceptBoxProps } from "./ConceptBox";
import { type LayoutMode } from "@/pages/home";

interface ConceptCarouselProps {
  concepts: ConceptBoxProps[];
  layoutMode?: LayoutMode;
}

export default function ConceptCarousel({ concepts, layoutMode = "horizontal" }: ConceptCarouselProps) {
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

  // Vertical layout - responsive grid based on screen size
  if (layoutMode === "vertical") {
    return (
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center">
          {concepts.map((concept, index) => (
            <div
              key={index}
              className="animate-slide-in w-full flex justify-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ConceptBox {...concept} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal layout - original carousel behavior
  return (
    <div className="flex flex-col w-full gap-3">
      {/* Top Navigation - Side by Side, above cards */}
      <div className="flex justify-center gap-2">
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("left")}
          className={`h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          data-testid="button-scroll-left-top"
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-7 w-7 text-primary-foreground" />
        </Button>
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("right")}
          className={`h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          data-testid="button-scroll-right-top"
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-7 w-7 text-primary-foreground" />
        </Button>
      </div>

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

      {/* Bottom Navigation - Side by Side, below cards */}
      <div className="flex justify-center gap-2">
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("left")}
          className={`h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          data-testid="button-scroll-left-bottom"
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-7 w-7 text-primary-foreground" />
        </Button>
        <Button
          size="icon"
          variant="default"
          onClick={() => scroll("right")}
          className={`h-12 w-12 rounded-full bg-primary/90 hover:bg-primary shadow-2xl backdrop-blur-md transition-all hover:scale-110 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          data-testid="button-scroll-right-bottom"
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-7 w-7 text-primary-foreground" />
        </Button>
      </div>

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
