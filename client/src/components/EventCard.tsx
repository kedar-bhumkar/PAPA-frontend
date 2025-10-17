import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";

export interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

export default function EventCard({
  title,
  date,
  location,
  description,
  category,
  imageUrl,
}: EventCardProps) {
  return (
    <Card
      className="group relative min-h-[480px] w-[380px] flex-shrink-0 overflow-hidden border-card-border hover-elevate active-elevate-2 transition-all duration-300"
      data-testid={`card-event-${title.toLowerCase().replace(/\s+/g, '-')}`}
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
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        {/* Category Badge */}
        {category && (
          <div className="mb-4">
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary-foreground backdrop-blur-sm"
              data-testid={`badge-category-${category.toLowerCase()}`}
            >
              {category}
            </Badge>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          <h3
            className="text-2xl font-bold leading-tight text-card-foreground"
            data-testid="text-event-title"
          >
            {title}
          </h3>

          {description && (
            <p
              className="line-clamp-3 text-sm leading-relaxed text-muted-foreground"
              data-testid="text-event-description"
            >
              {description}
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span
              className="font-medium uppercase tracking-wider"
              data-testid="text-event-date"
            >
              {date}
            </span>
          </div>

          <div className="flex items-center gap-2 text-base text-card-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span data-testid="text-event-location">{location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
