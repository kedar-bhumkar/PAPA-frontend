import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ExternalLink, DollarSign, Home, Tv, TrendingUp, PiggyBank, ChevronDown, CreditCard, LineChart, Bitcoin, BarChart3, Landmark, Vault, Repeat, FileSearch } from "lucide-react";
import { format, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useState } from "react";

export type ConceptItem = EventItem | CalendarItem | ExpenseItem | InvestmentItem | ResearchItem;

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
  research?: string;
}

export interface ResearchItem {
  type: "research";
  task: string;
  result: string;
}

export interface ExpenseDetail {
  label: string;
  amount: number;
}

export interface ExpenseItem {
  type: "expense";
  category: string;
  amount: number;
  icon: "salary" | "expenses" | "subscriptions" | "investments" | "savings";
  details?: ExpenseDetail[];
}

export interface InvestmentItem {
  type: "investment";
  us_current_balance: {
    amex: string;
    vanguard: string;
    crypto: string;
    stocks: string;
    total: string;
  };
  india_current_balance: {
    savings: string;
    stocks: string;
    FD: string;
    RD: string;
    total: string;
  };
  projection_12months: {
    us_investments: string;
    india_investments: string;
  };
  advice?: {
    us_investments: string;
    india_investments: string;
  };
}

export interface ConceptBoxProps {
  title: string;
  category: string;
  items: ConceptItem[];
  imageUrl?: string;
  categoryColor?: string;
  createdAt?: string | null;
}

// Helper function to format calendar date/time in CST
function formatCalendarTime(dateString: string): string {
  try {
    // Try parsing the new format: "2025-10-29 10:00 am"
    let date: Date;
    
    // Check if it's the new format (contains space and am/pm)
    if (dateString.includes(' am') || dateString.includes(' pm')) {
      // Parse format: "2025-10-29 10:00 am"
      date = parse(dateString, "yyyy-MM-dd h:mm a", new Date());
    } else {
      // Fall back to ISO format or native Date parsing
      date = new Date(dateString);
    }
    
    const cstDate = toZonedTime(date, "America/Chicago");
    return format(cstDate, "MMM d, yyyy • h:mm a 'CST'");
  } catch {
    return dateString;
  }
}

// Helper function to format "Last fetched" timestamp in CST
function formatLastFetched(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const cstDate = toZonedTime(date, "America/Chicago");
    return format(cstDate, "MMM d, yyyy • h:mm a");
  } catch {
    return "";
  }
}

// Expense Item Component with expand/collapse functionality
function ExpenseItemComponent({ item, index }: { item: ExpenseItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = item.details && item.details.length > 0;

  const IconComponent = {
    salary: DollarSign,
    expenses: Home,
    subscriptions: Tv,
    investments: TrendingUp,
    savings: PiggyBank,
  }[item.icon];

  // If no details, render simple non-expandable item
  if (!hasDetails) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
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
    );
  }

  // Render expandable item with details
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className="w-full"
        data-testid={`button-expand-expense-${index}`}
      >
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.category}
              </div>
              <div className="text-lg font-bold text-card-foreground">
                ${item.amount.toLocaleString()}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-1 pl-[52px] pr-6">
          {item.details?.map((detail, detailIndex) => (
            <div
              key={detailIndex}
              className="flex items-center justify-between text-sm py-1"
              data-testid={`expense-detail-${index}-${detailIndex}`}
            >
              <span className="text-muted-foreground">{detail.label}</span>
              <span className="font-medium text-card-foreground">
                ${detail.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ConceptBox({
  title,
  category,
  items,
  imageUrl,
  categoryColor = "bg-primary/20",
  createdAt,
}: ConceptBoxProps) {
  const lastFetched = formatLastFetched(createdAt);
  return (
    <Card
      className="group relative h-[calc(100vh-200px)] w-[380px] flex-shrink-0 overflow-hidden border-card-border hover-elevate active-elevate-2 transition-all duration-300"
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
        {/* Category Badge and Last Fetched */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <Badge
            variant="secondary"
            className={`${categoryColor} text-primary-foreground backdrop-blur-sm`}
            data-testid={`badge-category-${category.toLowerCase()}`}
          >
            {category}
          </Badge>
          {lastFetched && (
            <div className="text-xs text-muted-foreground text-right" data-testid="text-last-fetched">
              Last fetched:<br />
              {lastFetched}
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="mb-6 text-2xl font-bold text-card-foreground"
          data-testid="text-concept-title"
        >
          {title}
        </h3>

        {/* Items List - Compact single-line format */}
        <div className="flex-1 space-y-3 overflow-y-auto hide-scrollbar">
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
                  {item.research && item.research.trim() !== "" && (
                    <div className="mt-2 flex items-start gap-2">
                      <FileSearch className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div 
                        className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-help"
                        data-testid={`text-research-${index}`}
                      >
                        {item.research}
                      </div>
                    </div>
                  )}
                </>
              ) : item.type === "research" ? (
                <>
                  <div className="text-base font-semibold text-card-foreground mb-2">
                    {item.task}
                  </div>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-help"
                    data-testid={`text-result-${index}`}
                  >
                    {item.result}
                  </div>
                </>
              ) : item.type === "investment" ? (
                <div className="space-y-4">
                  {/* US Current Balance */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      US Current Balance
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Amex", value: item.us_current_balance.amex, Icon: CreditCard },
                        { label: "Vanguard", value: item.us_current_balance.vanguard, Icon: LineChart },
                        { label: "Crypto", value: item.us_current_balance.crypto, Icon: Bitcoin },
                        { label: "Stocks", value: item.us_current_balance.stocks, Icon: BarChart3 },
                      ].filter(account => account.value && account.value.trim() !== "" && account.value !== "$0" && account.value !== "$0.00").map((account, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <account.Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{account.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-card-foreground">
                            {account.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Total US</span>
                        <span className="text-sm font-bold text-primary">
                          {item.us_current_balance.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* India Current Balance */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      India Current Balance
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Savings", value: item.india_current_balance.savings, Icon: Landmark },
                        { label: "Stocks", value: item.india_current_balance.stocks, Icon: BarChart3 },
                        { label: "FD", value: item.india_current_balance.FD, Icon: Vault },
                        { label: "RD", value: item.india_current_balance.RD, Icon: Repeat },
                      ].filter(account => account.value && account.value.trim() !== "" && account.value !== "₹0" && account.value !== "₹0.00").map((account, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <account.Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{account.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-card-foreground">
                            {account.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">Total India</span>
                        <span className="text-sm font-bold text-primary">
                          {item.india_current_balance.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 12-Month Projection */}
                  <div className="border-t border-primary/20 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      12-Month Projection
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">US Investments</span>
                        <span className="text-sm font-semibold text-card-foreground">
                          {item.projection_12months.us_investments}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">India Investments</span>
                        <span className="text-sm font-semibold text-card-foreground">
                          {item.projection_12months.india_investments}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Advice Section */}
                  {item.advice && (item.advice.us_investments || item.advice.india_investments) && (
                    <div className="border-t border-primary/20 pt-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                        Investment Advice
                      </div>
                      <div className="space-y-3">
                        {item.advice.us_investments && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">US Investments</div>
                            <div 
                              className="text-sm text-card-foreground line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-help"
                              data-testid="text-advice-us"
                            >
                              {item.advice.us_investments}
                            </div>
                          </div>
                        )}
                        {item.advice.india_investments && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-1">India Investments</div>
                            <div 
                              className="text-sm text-card-foreground line-clamp-2 hover:line-clamp-none transition-all duration-200 cursor-help"
                              data-testid="text-advice-india"
                            >
                              {item.advice.india_investments}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.type === "expense" ? (
                <ExpenseItemComponent item={item} index={index} />
              ) : null}
            </div>
          ))}
        </div>
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
    </Card>
  );
}
