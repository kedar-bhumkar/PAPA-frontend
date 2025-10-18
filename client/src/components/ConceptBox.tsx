import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export interface ConceptItem {
  date: string;
  location: string;
  name: string;
  url?: string;
}

export interface ConceptBoxProps {
  title: string;
  category: string;
  items: ConceptItem[];
  imageUrl?: string;
  categoryColor?: string;
}

export default function ConceptBox({
  title,
  category,
  items,
  imageUrl,
  categoryColor = "bg-primary/20",
}: ConceptBoxProps) {
  return (
    <Card
      className="group relative min-h-[480px] w-[380px] flex-shrink-0 overflow-hidden border-card-border hover-elevate active-elevate-2 transition-all duration-300"
      data-testid={`card-concept-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Background Image with Gradient Overlay */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Category Badge */}
        <div className="mb-4">
          <Badge
            variant="secondary"
            className={`${categoryColor} text-primary-foreground backdrop-blur-sm`}
            data-testid={`badge-category-${category.toLowerCase()}`}
          >
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h3
          className="mb-6 text-2xl font-bold text-card-foreground"
          data-testid="text-concept-title"
        >
          {title}
        </h3>

        {/* Items List - Compact single-line format */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="relative space-y-1 rounded-md bg-card/30 p-3 backdrop-blur-sm"
              data-testid={`item-${index}`}
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <span>{item.date}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.location}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 text-base font-medium text-card-foreground">
                  {item.name}
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                    data-testid={`link-event-${index}`}
                    aria-label="Visit event website"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
