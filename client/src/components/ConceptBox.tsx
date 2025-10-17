import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

export interface ConceptItem {
  label: string;
  value: string;
  icon?: LucideIcon;
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

        {/* Items List */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-md bg-card/30 p-3 backdrop-blur-sm"
              data-testid={`item-${index}`}
            >
              {item.icon && (
                <item.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              )}
              <div className="flex-1 space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-card-foreground">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
