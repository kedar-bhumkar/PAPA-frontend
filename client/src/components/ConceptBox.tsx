import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign, Home, Tv, TrendingUp, PiggyBank } from "lucide-react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export type ConceptItem = EventItem | CalendarItem | ExpenseItem;

export interface EventItem {
  type: "event";
  date: string;
  location: string;
  name: string;
  url?: string;
}

export interface CalendarItem {
  type: "calendar";
  summary: string;
  startTime: string;
  link?: string;
}

export interface ExpenseItem {
  type: "expense";
  category: string;
  amount: number;
  icon: "salary" | "expenses" | "subscriptions" | "investments" | "savings";
}

export interface ConceptBoxProps {
  title: string;
  category: string;
  items: ConceptItem[];
  imageUrl?: string;
  categoryColor?: string;
}

// Helper function to format calendar date/time in CST
function formatCalendarTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const cstDate = toZonedTime(date, "America/Chicago");
    return format(cstDate, "MMM d, yyyy • h:mm a 'CST'");
  } catch {
    return isoString;
  }
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
              {item.type === "event" ? (
                <>
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
                </>
              ) : item.type === "calendar" ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                    <span>{formatCalendarTime(item.startTime)}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 text-base font-medium text-card-foreground">
                      {item.summary}
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                        data-testid={`link-calendar-${index}`}
                        aria-label="Visit calendar event"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Expense Item */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        {item.icon === "salary" && <DollarSign className="h-5 w-5 text-primary" />}
                        {item.icon === "expenses" && <Home className="h-5 w-5 text-primary" />}
                        {item.icon === "subscriptions" && <Tv className="h-5 w-5 text-primary" />}
                        {item.icon === "investments" && <TrendingUp className="h-5 w-5 text-primary" />}
                        {item.icon === "savings" && <PiggyBank className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </div>
                        <div className="text-lg font-bold text-card-foreground">
                          ${item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
