# PAPA - Events, Calendar, Expenses & Investments Showcase Application

## Overview
A visually stunning React application designed to showcase events, calendar items, financial expenses, and investment portfolios. It fetches data from a Supabase database and presents it in an animated carousel interface. The application features a modern design with dark/light theme support, smooth animations, and a distinctive gradient title, aiming to provide a clear and engaging overview of personal data.

## User Preferences
- Keep the fonts (Inter and Manrope)
- Keep background effects and animations
- Header title displays "PAPA" with gradient effect
- Events displayed in grouped format: date, location, event name
- Calendar items displayed with formatted CST time and summary
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
- **UI/UX**: Dark/light theme, gradient title, smooth animations, responsive design, shimmer loading skeletons, dual navigation arrows (positioned at both top and bottom, side by side, show/hide based on scroll state), horizontal-only scrolling with full-height cards (calc(100vh - 200px)).
- **Core Components**:
    - `ConceptBox`: Displays events, calendar items, expenses, and investments with type discrimination and unique gradient backgrounds. Full-height cards (calc(100vh - 200px)) with overflow-y-auto and CSS-hidden scrollbars (maintains scrolling functionality while appearing scrollbar-free).
    - `ExpenseItemComponent`: Handles expandable/collapsible expense categories with independent state and smooth animations.
    - `ConceptCarousel`: Manages horizontal scrolling with dual navigation arrows at top and bottom positions. Each position has left and right arrows side by side, centered horizontally. Arrows intelligently appear/disappear based on scroll state using opacity transitions.
    - `ThemeToggle`: For dark/light mode switching.

### Backend
- **Server**: Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with postgres-js driver

### Features
- Real-time data fetching for events, calendar, expenses, and investments.
- Optimized queries to retrieve the latest successful record for each data type.
- JSON parsing from the `agent_response` column with robust error handling.
- Display of events with date, location, name, and optional URLs.
- Display of calendar items with formatted CST date/time and summary.
- Comprehensive financial overview including salary, expenses, subscriptions, investments, and savings, with category-specific icons.
- **Expandable expense categories** with detailed line-item breakdowns:
  - Click any expense category (except Salary) to expand and view detailed line items
  - Smooth collapsible animations with rotating chevron icons
  - Details sorted by amount in descending order
  - Independent expand/collapse state per category
  - Multiple categories can be expanded simultaneously
- **Investment portfolio display** with projected balances:
  - US Projected Balance: Amex (CreditCard icon), Vanguard (LineChart icon), Crypto (Bitcoin icon), Stocks (BarChart3 icon)
  - India Projected Balance: Savings (Landmark icon), Stocks (BarChart3 icon), FD (Vault icon), RD (Repeat icon)
  - Total projections for both US and India investments
  - Clean sectioned layout with account-specific icons
  - **Investment Advice section** with hover-to-expand functionality:
    - Shows detailed financial advice for US and India investments
    - Initially displays 2 lines of text (truncated)
    - Hover over advice to expand and view full content
    - Smooth transitions between truncated and expanded states
  - **Suggestions section** with actionable recommendations:
    - Displays concise, actionable suggestions for US and India
    - Always fully visible (no truncation)
  - Support for both old (projection) and new (projection_12months) data structures
  - Currency formatting: $ for US amounts, Rs for India amounts
- Backend transformation layer that filters, sorts, and formats expense data
- Clickable external links that open in new tabs.
- Automatic CST timezone conversion for calendar events.
- Type-safe discriminated unions for robust data handling.
- Visually distinct cards for events (purple-pink), calendar (blue-teal-cyan), expenses (amber-green), and investments (emerald-teal).

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