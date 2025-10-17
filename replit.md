# PAPA - Events Showcase Application

## Overview
A visually stunning React application that displays events from a Supabase database in a beautiful carousel interface. The app features smooth animations, dark/light theme support, and a clean, modern design.

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
- `ConceptCarousel`: Scrollable container with navigation arrows
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
- `GET /api/events` - Fetches all records from `agent_output` table, parses the `agent_response` JSON column, and returns a flat array of events with name, date, and location fields

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
   - Use the direct connection string (not pooler for this setup)

### Current Configuration
- Successfully connected to Supabase database
- Using postgres-js driver with SSL configured
- Parsing events from `agent_output` table's `agent_response` JSON column

## Design System

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
- Hover elevations on interactive elements
- Shimmer loading animation

## Features
✅ Real-time data fetching from Supabase
✅ JSON parsing from agent_response column
✅ Event display with date, location, and name
✅ Dark/light theme toggle
✅ Responsive design
✅ Loading states with skeleton UI
✅ Empty state messaging
✅ Smooth animations and transitions
✅ Beautiful gradient backgrounds

## User Preferences
- Keep the fonts (Inter and Manrope)
- Keep background effects and animations
- Header title displays "PAPA"
- Events displayed in grouped format: date, location, event name
- Focus on Events data only (no appointments or financial info)

## Recent Changes
- **2025-10-17**: Successfully connected to Supabase
- Fixed table name from `search_agent` to `agent_output`
- Updated schema to parse events with name, date, location fields
- Configured postgres-js driver with proper SSL settings
- Fixed frontend to correctly display all event fields
- Tested end-to-end: All 10 events displaying correctly with complete information
