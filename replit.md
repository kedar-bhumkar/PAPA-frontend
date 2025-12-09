# PAPA - Events, Calendar, Research, Expenses, Investments, AI News & Scraped Data Showcase Application

## Overview
A React application showcasing events, calendar items, research insights, financial expenses, investment portfolios, AI news, and scraped data. It fetches data from a Supabase database and presents it in an animated carousel interface. The application features a modern design with dark/light theme support, smooth animations, and a distinctive gradient title, aiming to provide a clear and engaging overview of personal data. The project aims to deliver a visually stunning and highly functional application that consolidates diverse personal information into an accessible and intuitive format.

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
- **UI/UX**: Dark/light theme, gradient title, smooth animations, responsive design, shimmer loading skeletons, dual navigation arrows (top and bottom, side-by-side, dynamic visibility), horizontal-only scrolling with full-height cards, "Last fetched" timestamp (CST timezone) on each card. Gmail links for AI News when `message_id` is available.
- **Core Components**: `ConceptBox` (for displaying diverse data types with unique gradients and full-height cards), `ExpenseItemComponent` (expandable expense categories), `ConceptCarousel` (horizontal scrolling with dynamic navigation), `ThemeToggle`.
- **Feature Specifics**:
    - **Research Card**: Displays task and result. Truncated result with hover-to-expand. Maximize2 icon opens a full-screen dialog modal with formatted content (headings, lists, hyperlinks, paragraph splitting).
    - **Calendar Card**: Displays CST time, summary, and optional research notes with hover-to-expand.
    - **Expenses Card**: Expandable categories with detailed line items, sorted by amount.
    - **Investments Card**: Displays US and India current balances and 12-month projections. Includes an "Investment Advice" section with hover-to-expand text. Currency values are pre-formatted from the API.
    - **AI News Card**: Displays a summary section (truncated, hover-to-expand, modal for full text) and source-grouped items (truncated, hover-to-expand, modal for all items from source). Hyperlinks are automatically detected. Uses `FormattedResearchContent` for enhanced text display in modals.
    - **Scraped Data Card**: Displays title, external link, and summary. Truncated summary with hover-to-expand. Maximize2 icon opens a full-screen dialog modal with formatted content.
    - **Card Theming**: Visually distinct cards for different data types using gradient backgrounds (e.g., events: purple-pink, AI news: blue, scraped data: teal-cyan).
    - **Reusable Components**: `TruncatedReveal` for consistent truncate-hover patterns.

### Backend
- **Server**: Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with postgres-js driver
- **API Response Structure**: All endpoints return `{ data: T, createdAt: Date | null }`, where `createdAt` is from `agent_output.created_at`.
- **Data Format**: Events and Calendar data wrapped in `{events: [...]}`. Calendar dates support "YYYY-MM-DD HH:MM am/pm" and ISO formats.
- **User Filtering**: Optional `userId` query parameter for filtering data from the `agent_output` table.
- **AI News Processing**: Handles malformed JSON from the database, including URL decoding, `+` to space conversion, and correcting missing closing brackets.

## External Dependencies
- **Supabase**: PostgreSQL database backend.
- **Wouter**: Client-side routing.
- **TanStack Query**: Data fetching, caching, and synchronization.
- **Tailwind CSS**: Utility-first styling.
- **Shadcn/ui**: Customizable UI components.
- **Lucide React**: Icon library.
- **date-fns-tz**: Timezone handling and date formatting.
- **Express.js**: Backend API server.
- **Drizzle ORM**: ORM for PostgreSQL.
- **postgres-js**: PostgreSQL client for Node.js.