# PAPA - Events, Calendar, Research, Expenses, Investments & AI News Showcase Application

## Overview
A visually stunning React application designed to showcase events, calendar items, research insights, financial expenses, investment portfolios, and AI news. It fetches data from a Supabase database and presents it in an animated carousel interface. The application features a modern design with dark/light theme support, smooth animations, and a distinctive gradient title, aiming to provide a clear and engaging overview of personal data.

## User Preferences
- Keep the fonts (Inter and Manrope)
- Keep background effects and animations
- Header title displays "PAPA" with gradient effect
- Events displayed in grouped format: date, location, event name
- Calendar items displayed with formatted CST time and summary
- Research items displayed with task and truncated result, hover to expand full result text
- Expenses displayed with category icons and formatted currency amounts
- Investment portfolio displayed with US and India projected balances with appropriate icons
- Full-height cards utilizing available vertical space (calc(100vh - 200px))
- Navigation arrows at both TOP and BOTTOM of screen, side by side at each position
- Only horizontal scrolling enabled (no vertical scrollbars on cards)

## System Architecture

### Frontend
- **Framework**: React with Vite
- **Routing**: Wouter
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Fonts**: Inter and Manrope
- **UI/UX**: Dark/light theme, gradient title, smooth animations, responsive design, shimmer loading skeletons, dual navigation arrows (positioned at both top and bottom, side by side, show/hide based on scroll state), horizontal-only scrolling with full-height cards (calc(100vh - 200px)), "Last fetched" timestamp display on each card.
- **Core Components**:
    - `ConceptBox`: Displays events, calendar items, expenses, and investments with type discrimination and unique gradient backgrounds. Full-height cards (calc(100vh - 200px)) with overflow-y-auto and CSS-hidden scrollbars (maintains scrolling functionality while appearing scrollbar-free). **"Last fetched:" timestamp** displayed in top RHS of each card, formatted in CST timezone with am/pm (e.g., "Nov 13, 2025 • 3:32 pm").
    - `ExpenseItemComponent`: Handles expandable/collapsible expense categories with independent state and smooth animations.
    - `ConceptCarousel`: Manages horizontal scrolling with dual navigation arrows at top and bottom positions. Each position has left and right arrows side by side, centered horizontally. Arrows intelligently appear/disappear based on scroll state using opacity transitions.
    - `ThemeToggle`: For dark/light mode switching.

### Backend
- **Server**: Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with postgres-js driver
- **API Response Structure**: All endpoints return `{ data: T, createdAt: Date | null }`
  - `data`: The actual content (events, calendar items, expenses, etc.)
  - `createdAt`: Timestamp from `agent_output.created_at` field for "Last fetched" display
- **Data Format**: 
  - Events and Calendar agents return data wrapped in `{events: [...]}` structure
  - Calendar date format: "2025-10-29 10:00 am" (parsed with backwards compatibility for ISO format)
- **User Filtering**: 
  - All API endpoints accept optional `userId` query parameter (e.g., `?userId=demo`)
  - Filters `agent_output` table by `user_id` column when provided
  - Backward compatible - works without userId parameter

### Features
- Real-time data fetching for events, calendar, research, expenses, and investments.
- Optimized queries to retrieve the latest successful record for each data type.
- JSON parsing from the `agent_response` column with robust error handling.
- Display of events with date, location, name, and optional URLs.
- Display of calendar items with formatted CST date/time, summary, and optional research notes:
  - **Research property**: Optional field that provides additional context about calendar events
  - Displays with FileSearch icon when present
  - Hover-to-expand functionality: Initially shows 2 lines, expands on hover to show full content
  - Smooth 200ms transitions between truncated and expanded states
- Display of research items with task and result:
  - **Research card**: Displays research agent insights from `research_agent`
  - JSON structure (new format): `{"tasks": [{"task":"", "result": ""}]}`
  - Backward compatible with legacy format: `[{"task":"", "result": ""}]`
  - Shows task title prominently with truncated result preview (2 lines)
  - Hover-to-expand functionality: Expands on hover to show full result text
  - Maximize2 icon button positioned with z-index to remain visible and clickable even when text expands
  - **Pop-up modal feature**: Maximize2 icon on each research item opens a dialog modal
    - Dialog overlays cards and covers 80% of viewport (width and height)
    - **Visual styling matches card design**: Purple gradient background (`bg-gradient-to-br from-purple-500/10 via-card to-card`), backdrop blur effects, and card-style borders
    - **Sticky header**: Research badge and title remain at top while scrolling
    - **Content container**: Rounded container with `bg-card/30` and `backdrop-blur-sm` matching card item styling
    - **Enhanced text formatting** via FormattedResearchContent component:
      - Detects and formats section headings (ending with colons, numbered, etc.) as bold with larger text
      - Automatically splits long continuous text into readable paragraphs (2-3 sentences each)
      - Renders bullet points (-, •, *) with colored bullet markers and indentation
      - Renders numbered lists (1., 2., 3., etc.) with colored numbers and indentation
      - Handles standalone numbered markers (numbers on separate lines) by combining with next line
      - **Automatic hyperlink detection**: URLs (http://, https://, www.) are automatically converted to clickable links
        - Links open in new tab with security attributes (target="_blank", rel="noopener noreferrer")
        - Styled in primary color with underline and hover effect
        - Trailing punctuation (.,;)]}!?) automatically stripped from URLs
      - Proper spacing between sections and paragraphs for improved readability
      - Works for both structured text with headings and unstructured continuous text
    - Displays full research task as prominent title and complete result text
    - Well-formatted content with hidden scrollbars
    - Closes via ESC key, backdrop click, or close button
  - Smooth 200ms transitions between truncated and expanded states
  - Purple gradient background (bg-purple-500/20)
  - Zod schema validation for data integrity
- Comprehensive financial overview including salary, expenses, subscriptions, investments, and savings, with category-specific icons.
- **Expandable expense categories** with detailed line-item breakdowns:
  - Click any expense category (except Salary) to expand and view detailed line items
  - Smooth collapsible animations with rotating chevron icons
  - Details sorted by amount in descending order
  - Independent expand/collapse state per category
  - Multiple categories can be expanded simultaneously
- **Investment portfolio display** with current balances and projections:
  - **US Current Balance**: Amex (CreditCard icon), Vanguard (LineChart icon), Crypto (Bitcoin icon), Stocks (BarChart3 icon)
    - Individual account balances displayed as pre-formatted strings (e.g., "$2203,357.00")
    - Total US from us_current_balance.total field
  - **India Current Balance**: Savings (Landmark icon), Stocks (BarChart3 icon), FD (Vault icon), RD (Repeat icon)
    - Individual account balances displayed as pre-formatted strings (e.g., "₹440,000.00")
    - Total India from india_current_balance.total field
    - Empty string values (e.g., RD: "") are filtered out from display
  - **12-Month Projection section** showing future investment values:
    - US Investments: Projected balance displayed as pre-formatted string (e.g., "$287,631.96")
    - India Investments: Projected balance displayed as pre-formatted string (e.g., "₹6,336,609.00")
    - Clean horizontal layout with clear labels
  - **Investment Advice section** with hover-to-expand functionality:
    - Shows detailed financial advice for US and India investments
    - Initially displays 2 lines of text (truncated with ellipsis)
    - Hover directly over advice text to expand and view full content
    - Smooth 200ms transitions between truncated and expanded states
    - Uses direct hover (not group-hover) for reliable interaction
  - Currency values: All amounts come pre-formatted from API with currency symbols ($, ₹), comma separators, and decimal places already included. No client-side formatting is applied.
- Backend transformation layer that filters, sorts, and formats expense data
- **AI News display** with summary and source-grouped items:
  - **Summary section**: Displayed first in highlighted blue box with border, shows key AI news items summarized across all sources
  - **Source-grouped items**: News items grouped by source (ai-news, dailydoseofds, demetrios)
    - Each source shows name and item count (e.g., "3 items")
    - Single expand button per source (not per item)
  - **Source-level modal**: Clicking expand button opens modal showing ALL items from that source
    - Modal title: Source name
    - Modal badge: "AI News • {source}" with blue color scheme (bg-blue-500/20)
    - All items displayed with individual title + formatted details
    - Uses FormattedResearchContent for hyperlinks, headings, lists, and formatting
  - **Unified modal architecture**: Single dialog component handles both research and AI news
    - Discriminated union (DetailDialogState) for type-safe modal content
    - Research type: Shows single task + result
    - AI News type: Shows all items from selected source
  - Blue gradient background (bg-blue-500/20) for visual distinction
  - JSON structure: `{summary: string, details: [{source: string, item_details: [{title, details}]}]}`
- Clickable external links that open in new tabs.
- Automatic CST timezone conversion for calendar events.
- Type-safe discriminated unions for robust data handling.
- Visually distinct cards for events (purple-pink), calendar (blue-teal-cyan), research (purple-violet-pink), expenses (amber-green), investments (emerald-teal), and AI news (blue).

## External Dependencies
- **Supabase**: Used as the PostgreSQL database backend.
- **Wouter**: For client-side routing in the React application.
- **TanStack Query (React Query)**: For data fetching, caching, and synchronization.
- **Tailwind CSS**: For utility-first styling.
- **Shadcn/ui**: For pre-built, customizable UI components.
- **Lucide React**: For icons (e.g., DollarSign, Home, Tv, TrendingUp, PiggyBank).
- **date-fns-tz**: For timezone handling and formatting of dates.
- **Express.js**: For building the backend API.
- **Drizzle ORM**: For interacting with the PostgreSQL database.
- **postgres-js**: PostgreSQL client for Node.js.