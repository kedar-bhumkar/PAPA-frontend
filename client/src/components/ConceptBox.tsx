import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, DollarSign, Home, Tv, TrendingUp, PiggyBank, ChevronDown, CreditCard, LineChart, Bitcoin, BarChart3, Landmark, Vault, Repeat, FileSearch, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parse } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useState } from "react";

export type ConceptItem = EventItem | CalendarItem | ExpenseItem | InvestmentItem | ResearchItem | AINewsSummaryItem | AINewsSourceItem | ScrapedDataItem;

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

export interface AINewsSummaryItem {
  type: "ainews-summary";
  summary: string;
}

export interface AINewsSourceItem {
  type: "ainews-source";
  source: string;
  items: Array<{
    title: string;
    details: string;
  }>;
  message_id?: string;
}

export interface ScrapedDataItem {
  type: "scraped";
  title: string;
  link: string;
  summary: string[];
}

export interface ExpenseDetail {
  label: string;
  amount: number;
}

// Unified detail dialog state for expandable items (research, AI news, scraped, etc.)
type DetailDialogState = {
  kind: "research";
  title: string;
  badgeLabel: string;
  badgeColor: string;
  content: string;
} | {
  kind: "ainews-summary";
  badgeLabel: string;
  badgeColor: string;
  content: string;
} | {
  kind: "ainews-source";
  source: string;
  badgeLabel: string;
  badgeColor: string;
  items: Array<{ title: string; details: string }>;
  message_id?: string;
} | {
  kind: "scraped";
  title: string;
  link: string;
  badgeLabel: string;
  badgeColor: string;
  summary: string[];
} | null;

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

export interface DateNavigation {
  currentDate: string; // YYYY-MM-DD format
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export interface ConceptBoxProps {
  title: string;
  category: string;
  items: ConceptItem[];
  imageUrl?: string;
  categoryColor?: string;
  createdAt?: string | null;
  dateNavigation?: DateNavigation;
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

// Helper function to detect URLs and convert them to clickable links
function renderTextWithLinks(text: string): (string | JSX.Element)[] {
  // Regex to match URLs (http, https, www)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Clean up the URL by removing trailing punctuation
    let url = match[0];
    let trailingPunctuation = '';
    
    // Remove common trailing punctuation: . , ; ) ] } ! ?
    const punctuationRegex = /([.,;)\]}!?]+)$/;
    const punctMatch = url.match(punctuationRegex);
    if (punctMatch) {
      trailingPunctuation = punctMatch[1];
      url = url.slice(0, -trailingPunctuation.length);
    }
    
    // Add https:// if URL starts with www
    const href = url.startsWith('www.') ? `https://${url}` : url;
    
    parts.push(
      <a
        key={`link-${match.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline transition-colors break-words inline"
      >
        {url}
      </a>
    );
    
    // Add the trailing punctuation after the link
    if (trailingPunctuation) {
      parts.push(trailingPunctuation);
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
}

// Component to render formatted research text with headings, lists, and spacing
function FormattedResearchContent({ text }: { text: string }) {
  // First, try to intelligently split continuous text by section markers
  let processedText = text;
  
  // Add line breaks before various section heading patterns:
  // 1. ". - Word:" or ". - Phrase:" (with hyphen)
  processedText = processedText.replace(/\.\s+-\s+([A-Z][^:]+:)/g, '.\n\n$1');
  
  // 2. ". Word (Details):" (with parenthetical)
  processedText = processedText.replace(/\.\s+([A-Z][a-z\s]+\([^)]+\):)/g, '.\n\n$1');
  
  // 3. ". Word:" or ". Phrase:" (general case - most common)
  processedText = processedText.replace(/\.\s+([A-Z][a-z][a-z\s]+:)/g, '.\n\n$1');
  
  // 4. Start of text with "Word:" or "Phrase:"
  processedText = processedText.replace(/^([A-Z][a-z][a-z\s]+:)/gm, '\n$1');
  
  // 5. For long continuous text without headings, create paragraph breaks
  // Split into sentences and group every 2-3 sentences into a paragraph
  if (!processedText.includes('\n') && processedText.length > 300) {
    const sentences = processedText.match(/[^.!?]+[.!?]+/g) || [processedText];
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 3) {
      const para = sentences.slice(i, i + 3).join(' ').trim();
      paragraphs.push(para);
    }
    processedText = paragraphs.join('\n\n');
  }
  
  // 6. Handle standalone numbered markers (e.g., lines with just "1.", "2.", etc.)
  // Combine them with the next line to create proper numbered items
  processedText = processedText.replace(/^(\d+\.)\s*\n+/gm, '$1 ');
  
  const lines = processedText.split('\n');
  const elements: JSX.Element[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines (we'll add them as spacing)
    if (trimmedLine === '') {
      elements.push(<div key={`empty-${i}`} className="h-4" />);
      continue;
    }
    
    // Check if line is a heading - expanded patterns
    const isHeading = 
      trimmedLine.endsWith(':') || 
      /^-\s+[A-Z]/.test(trimmedLine) || // Starts with "- Capital"
      /^[A-Z][a-z\s]+\([^)]+\):/.test(trimmedLine) || // "Word (Details):"
      (/^[A-Z\s]+:?$/.test(trimmedLine) && trimmedLine.length < 50);
    
    // Check if line is a bullet point or numbered item
    const isBullet = /^[-•*]\s/.test(trimmedLine) && !isHeading;
    const isNumberedItem = /^\d+\.\s/.test(trimmedLine) && !isHeading;
    
    if (isHeading) {
      elements.push(
        <div key={i} className="font-bold text-card-foreground mt-4 mb-2 text-lg">
          {renderTextWithLinks(trimmedLine)}
        </div>
      );
    } else if (isBullet) {
      const bulletContent = trimmedLine.replace(/^[-•*]\s/, '');
      elements.push(
        <div key={i} className="flex gap-2 mb-2 ml-4">
          <span className="text-primary flex-shrink-0">•</span>
          <span className="text-card-foreground">{renderTextWithLinks(bulletContent)}</span>
        </div>
      );
    } else if (isNumberedItem) {
      // Extract the number and content
      const match = trimmedLine.match(/^(\d+\.)\s(.+)/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-2 mb-2 ml-4">
            <span className="text-primary flex-shrink-0 font-medium">{match[1]}</span>
            <span className="text-card-foreground">{renderTextWithLinks(match[2])}</span>
          </div>
        );
      }
    } else {
      // For long paragraphs, look for inline section headers and split them
      const parts = trimmedLine.split(/(?<=\.\s)(?=[A-Z][a-z\s]+\([^)]+\):)/);
      
      parts.forEach((part, partIdx) => {
        const trimmedPart = part.trim();
        if (!trimmedPart) return;
        
        // Check if this part is a heading pattern
        if (/^[A-Z][a-z\s]+\([^)]+\):/.test(trimmedPart)) {
          elements.push(
            <div key={`${i}-${partIdx}-heading`} className="font-bold text-card-foreground mt-4 mb-2 text-lg">
              {renderTextWithLinks(trimmedPart)}
            </div>
          );
        } else {
          elements.push(
            <p key={`${i}-${partIdx}`} className="text-card-foreground mb-3 leading-relaxed">
              {renderTextWithLinks(trimmedPart)}
            </p>
          );
        }
      });
    }
  }
  
  return <>{elements}</>;
}

// Reusable component for truncated text with hover-to-expand
// Accepts React nodes to preserve hyperlinks and other formatting
function TruncatedReveal({ 
  children, 
  clampLines = 2, 
  testId 
}: { 
  children: React.ReactNode; 
  clampLines?: number; 
  testId?: string;
}) {
  const clampClass = clampLines === 2 ? 'line-clamp-2' : clampLines === 3 ? 'line-clamp-3' : 'line-clamp-2';
  
  return (
    <div 
      className={`text-sm text-muted-foreground ${clampClass} hover:line-clamp-none transition-all duration-200 cursor-help pr-2`}
      data-testid={testId}
    >
      {children}
    </div>
  );
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
  dateNavigation,
}: ConceptBoxProps) {
  const lastFetched = formatLastFetched(createdAt);
  const [detailDialog, setDetailDialog] = useState<DetailDialogState>(null);
  
  // Helper functions to open detail dialogs
  const openResearchDetail = (item: ResearchItem) => {
    setDetailDialog({
      kind: "research",
      title: item.task,
      badgeLabel: "Research",
      badgeColor: "bg-purple-500/20",
      content: item.result,
    });
  };
  
  const openAINewsSummaryDetail = (item: AINewsSummaryItem) => {
    setDetailDialog({
      kind: "ainews-summary",
      badgeLabel: "AI News Summary",
      badgeColor: "bg-blue-500/20",
      content: item.summary,
    });
  };
  
  const openAINewsSourceDetail = (item: AINewsSourceItem) => {
    setDetailDialog({
      kind: "ainews-source",
      source: item.source,
      badgeLabel: `AI News • ${item.source}`,
      badgeColor: "bg-blue-500/20",
      items: item.items,
      message_id: item.message_id,
    });
  };
  
  const openScrapedDetail = (item: ScrapedDataItem) => {
    setDetailDialog({
      kind: "scraped",
      title: item.title,
      link: item.link,
      badgeLabel: "Scraped Data",
      badgeColor: "bg-teal-500/20",
      summary: item.summary,
    });
  };
  
  return (
    <>
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
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${categoryColor} text-primary-foreground backdrop-blur-sm`}
              data-testid={`badge-category-${category.toLowerCase()}`}
            >
              {category}
            </Badge>
            {/* Date Navigation Buttons */}
            {dateNavigation && (
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dateNavigation.onPrevious();
                  }}
                  data-testid="button-nav-previous"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {!dateNavigation.isToday && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dateNavigation.onNext();
                    }}
                    data-testid="button-nav-next"
                    aria-label="Next day"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-semibold text-card-foreground mb-2">
                        {item.task}
                      </div>
                      <TruncatedReveal clampLines={2} testId={`text-result-${index}`}>
                        {renderTextWithLinks(item.result)}
                      </TruncatedReveal>
                    </div>
                    <button
                      onClick={() => openResearchDetail(item)}
                      className="relative z-10 flex-shrink-0 text-primary hover:text-primary/80 transition-colors p-1"
                      data-testid={`button-expand-research-${index}`}
                      aria-label="View full research details"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : item.type === "ainews-summary" ? (
                <>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                        Summary
                      </div>
                      <button
                        onClick={() => openAINewsSummaryDetail(item)}
                        className="relative z-10 flex-shrink-0 text-primary hover:text-primary/80 transition-colors p-1"
                        data-testid={`button-expand-ainews-summary-${index}`}
                        aria-label="View full AI news summary"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                    <TruncatedReveal clampLines={2} testId={`text-summary-${index}`}>
                      {renderTextWithLinks(item.summary)}
                    </TruncatedReveal>
                  </div>
                </>
              ) : item.type === "ainews-source" ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs font-medium uppercase tracking-wider text-primary">
                          {item.source}
                        </div>
                        {item.message_id && (
                          <a
                            href={`https://mail.google.com/mail/u/0/#inbox/${item.message_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                            data-testid={`link-ainews-gmail-${index}`}
                            aria-label="View in Gmail inbox"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <TruncatedReveal clampLines={2} testId={`text-source-preview-${index}`}>
                        {renderTextWithLinks(item.items.map(i => i.title || i.details).join(' • '))}
                      </TruncatedReveal>
                    </div>
                    <button
                      onClick={() => openAINewsSourceDetail(item)}
                      className="relative z-10 flex-shrink-0 text-primary hover:text-primary/80 transition-colors p-1"
                      data-testid={`button-expand-ainews-source-${index}`}
                      aria-label="View AI news from this source"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
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
              ) : item.type === "scraped" ? (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-base font-semibold text-card-foreground">
                          {item.title}
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                          data-testid={`link-scraped-${index}`}
                          aria-label="Visit source link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <TruncatedReveal clampLines={3} testId={`text-scraped-summary-${index}`}>
                        {renderTextWithLinks(item.summary.join(' '))}
                      </TruncatedReveal>
                    </div>
                    <button
                      onClick={() => openScrapedDetail(item)}
                      className="relative z-10 flex-shrink-0 text-primary hover:text-primary/80 transition-colors p-1"
                      data-testid={`button-expand-scraped-${index}`}
                      aria-label="View full scraped data details"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
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

    {/* Unified Details Dialog for Research and AI News */}
    <Dialog open={!!detailDialog} onOpenChange={(open) => !open && setDetailDialog(null)}>
      <DialogContent 
        className="w-[80vw] h-[80vh] max-w-[80vw] sm:w-[80vw] sm:max-w-[80vw] overflow-hidden border-primary/20 bg-gradient-to-br from-purple-500/10 via-card to-card backdrop-blur-xl" 
        data-testid={`dialog-${detailDialog?.kind}-details`}
      >
        <div className="h-full overflow-y-auto pr-2">
          <DialogHeader className="sticky top-0 bg-gradient-to-b from-card via-card/95 to-transparent pb-4 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-3xl font-bold text-card-foreground" data-testid="text-dialog-title">
                {detailDialog?.kind === "research" 
                  ? detailDialog.title 
                  : detailDialog?.kind === "ainews-summary"
                  ? "AI News Summary"
                  : detailDialog?.kind === "scraped"
                  ? detailDialog.title
                  : detailDialog?.source}
              </DialogTitle>
              {detailDialog?.kind === "ainews-source" && detailDialog.message_id && (
                <a
                  href={`https://mail.google.com/mail/u/0/#inbox/${detailDialog.message_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                  data-testid="link-dialog-gmail"
                  aria-label="View in Gmail inbox"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {detailDialog?.kind === "scraped" && detailDialog.link && (
                <a
                  href={detailDialog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                  data-testid="link-dialog-scraped"
                  aria-label="Visit source"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className={`${detailDialog?.badgeColor} text-primary-foreground backdrop-blur-sm`}>
                {detailDialog?.badgeLabel}
              </Badge>
            </div>
          </DialogHeader>
          <DialogDescription asChild>
            <div className="mt-6 pb-4">
              {detailDialog?.kind === "research" ? (
                <div className="rounded-md bg-card/30 p-6 backdrop-blur-sm" data-testid="text-dialog-result">
                  <FormattedResearchContent text={detailDialog.content} />
                </div>
              ) : detailDialog?.kind === "ainews-summary" ? (
                <div className="rounded-md bg-card/30 p-6 backdrop-blur-sm" data-testid="text-dialog-summary">
                  <FormattedResearchContent text={detailDialog.content} />
                </div>
              ) : detailDialog?.kind === "ainews-source" ? (
                <div className="space-y-4">
                  {detailDialog.items.map((item, idx) => (
                    <div key={idx} className="rounded-md bg-card/30 p-6 backdrop-blur-sm" data-testid={`ainews-item-${idx}`}>
                      <div className="text-xl font-bold text-card-foreground mb-3">
                        {item.title}
                      </div>
                      <div className="text-card-foreground">
                        <FormattedResearchContent text={item.details} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : detailDialog?.kind === "scraped" ? (
                <div className="rounded-md bg-card/30 p-6 backdrop-blur-sm" data-testid="text-dialog-scraped">
                  <ul className="space-y-3 list-none">
                    {detailDialog.summary.map((paragraph, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-card-foreground">
                        <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                        <div className="flex-1">
                          <FormattedResearchContent text={paragraph} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
