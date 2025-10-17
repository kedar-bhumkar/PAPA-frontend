# PAPA - Events Showcase Application

## Overview
A visually stunning React application that displays events from a Supabase database in a beautiful carousel interface. The app features smooth animations, dark/light theme support, and a clean, modern design with an eye-catching gradient title.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with Vite
- **Routing**: Wouter
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom design system
- **Fonts**: Inter and Manrope
- **UI Components**: Shadcn/ui components with custom animations

### Backend (Express + TypeScript)
- **Server**: Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with postgres-js driver

### Key Components
- `ConceptBox`: Displays event data in a card format with date, location, and event name
- `ConceptCarousel`: Horizontal scrollable container with smart navigation arrows
- `ThemeToggle`: Dark/light mode switcher
- `LoadingSkeleton`: Loading state with shimmer animation

## Database Schema

### Supabase Table: `agent_output`
```sql
CREATE TABLE agent_output (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  agent_name TEXT,
  agent_response TEXT,  -- JSON string containing events data
  status TEXT
);
```

### JSON Structure in `agent_response` Column
The `agent_response` column contains a JSON string with the following structure:
```json
{
  "events": [
    {
      "name": "Paul McCartney — Got Back Tour",
      "date": "2025-10-17",
      "location": "U.S. Bank Stadium, Minneapolis"
    },
    {
      "name": "Minnesota Orchestra — Beethoven's Fifth",
      "date": "2025-10-18",
      "location": "Orchestra Hall, Minneapolis"
    }
  ]
}
```

## API Endpoints

### GET /api/events
Fetches events from the latest event_agent record.

**Query Logic:**
```sql
SELECT * FROM agent_output 
WHERE agent_name = 'event_agent'
  AND TRIM(status) = 'success'
ORDER BY created_at DESC 
LIMIT 1
```

**Features:**
- Filters by `agent_name='event_agent'` to get only event agent records
- Filters by `TRIM(status)='success'` to ensure only successful records with data are retrieved
  - TRIM handles status values with trailing newlines (e.g., `'success\n'`)
- Orders by `created_at DESC` to get the most recent successful record
- Limits to 1 record for optimal performance
- Parses the `agent_response` JSON column
- Returns a flat array of events with name, date, and location fields

**Why TRIM is important:**
The database may store status values with trailing newlines (e.g., `'success\n'` or `'fail-nodata\n'`). Using TRIM ensures we match both `'success'` and `'success\n'` correctly. Additionally, we filter for successful records only since failed records may contain empty event arrays.

## Setup Instructions

### Database Connection
1. The application connects to Supabase using the `DATABASE_URL` environment variable
2. Connection string format:
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```
3. Get your connection string from Supabase dashboard:
   - Navigate to your project settings
   - Go to Database settings
   - Use the direct connection string

### Current Configuration
- Successfully connected to Supabase database at `db.bbjluxtoxkopblpisdqw.supabase.co`
- Using postgres-js driver with SSL configured
- Fetches only the latest record from event_agent
- Parsing events from `agent_output` table's `agent_response` JSON column

## Design System

### Visual Enhancements

#### PAPA Title & Subtitle
- **Title "PAPA"**:
  - Size: Extra large (text-5xl) for maximum impact
  - Font: Manrope, black weight for bold appearance
  - Effect: Beautiful gradient from primary to lighter shades
  - Technique: bg-clip-text for smooth gradient rendering
  - Position: Centered on the page
- **Subtitle "Persistent Ambient Personal agents"**:
  - Size: Extra small (text-xs) for subtle appearance
  - Font: Inter, regular weight
  - Color: Muted foreground for secondary emphasis
  - Position: Centered below the main title
  - Letter spacing for readability

#### Navigation Arrows
- **Size**: 48x48px (larger for better visibility)
- **Position**: Absolute positioning at edges (left-2, right-2)
- **Color**: Primary color (bg-primary/90) for brand consistency
- **Icons**: Chevron icons at 28x28px
- **Effects**:
  - shadow-2xl for depth
  - hover:scale-110 for interactive feedback
  - Conditional rendering (only show when scrolling is possible)
- **Smart Display**: Arrows appear/disappear based on scroll position

### Colors
- **Primary**: Purple-blue (250° hue) for accents and interactive elements
- **Dark Mode**: Deep charcoal backgrounds with elevated card surfaces
- **Light Mode**: Clean white/gray backgrounds

### Typography
- **Headings**: Manrope font family, bold weights
- **Body**: Inter font family, regular weights
- **Event dates**: Uppercase, small, medium weight with letter spacing

### Animations
- Slide-in animations for cards (staggered delays)
- Smooth scroll behavior
- Hover scale effects on navigation arrows
- Fade-in animations for arrow appearance
- Shimmer loading animation

## Features
✅ Real-time data fetching from Supabase
✅ Optimized query (latest event_agent record only)
✅ JSON parsing from agent_response column
✅ Event display with date, location, and name
✅ Stunning gradient title with large typography
✅ Smart navigation arrows (show/hide based on scroll state)
✅ Dark/light theme toggle
✅ Responsive design
✅ Loading states with skeleton UI
✅ Empty state messaging
✅ Smooth animations and transitions
✅ Beautiful gradient backgrounds

## User Preferences
- Keep the fonts (Inter and Manrope)
- Keep background effects and animations
- Header title displays "PAPA" with gradient effect
- Events displayed in grouped format: date, location, event name
- Focus on Events data only (no appointments or financial info)
- Navigation arrows positioned correctly and styled prominently

## Recent Changes
- **2025-10-17**: Successfully connected to Supabase
- Fixed table name from `search_agent` to `agent_output`
- Updated schema to parse events with name, date, location fields
- Configured postgres-js driver with proper SSL settings
- Fixed frontend to correctly display all event fields
- Enhanced PAPA title with large gradient styling and centered it on the page
- Added subtitle "Persistent Ambient Personal agents" below the title in small font
- Repositioned and styled navigation arrows with primary color
- Implemented smart arrow display (conditional rendering based on scroll state)
- Added hover scale effects on navigation buttons
- **Optimized query**: Now fetches only the latest successful event_agent record (WHERE agent_name='event_agent' AND TRIM(status)='success' ORDER BY created_at DESC LIMIT 1)
- **Fixed empty data issue**: Added status='success' filter to exclude failed records with empty event arrays
- **Added TRIM function**: Query now handles status values with trailing newlines (e.g., 'success\n')
- Tested end-to-end: All 15 events displaying correctly from the latest successful record
