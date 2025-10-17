# PAPA - Events Showcase Application

## Overview
A visually stunning React application that displays events from a Supabase database in a beautiful horizontal scrolling carousel. The app features smooth animations, dark/light theme support, and a clean, modern design.

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
- `ConceptCarousel`: Horizontal scrollable container with navigation arrows
- `ThemeToggle`: Dark/light mode switcher
- `LoadingSkeleton`: Loading state with shimmer animation

## Database Schema

### Supabase Table: `search_agent`
```sql
CREATE TABLE search_agent (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  agent_name TEXT,
  agent_response TEXT,  -- JSON string containing events data
  status TEXT
);
```

### JSON Structure in `agent_response` Column
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
- `GET /api/events` - Fetches all records from `search_agent` table, parses the `agent_response` JSON, and returns array of events

## Setup Instructions

### Database Connection
1. The application connects to Supabase using the `DATABASE_URL` environment variable
2. Get your connection string from Supabase dashboard:
   - Navigate to your project
   - Click "Connect" button
   - Copy URI from "Connection string" → "Transaction pooler"
   - Replace `[YOUR-PASSWORD]` with your actual database password
3. The connection string format should be:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Troubleshooting Connection Issues
If you see `ECONNRESET` or TLS connection errors:
1. Verify your DATABASE_URL is correct and the password is properly replaced
2. Ensure your Supabase project is active and accessible
3. Check that the connection string is from the "Transaction pooler" section
4. Verify network/firewall settings allow connections to Supabase

### Sample Data
The application automatically parses events from the `agent_response` JSON column. No manual data insertion is needed if your Supabase table already contains records with event data.

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
- Smooth scroll behavior with snap points
- Hover elevations on interactive elements
- Shimmer loading animation

## Features
✅ Real-time data fetching from Supabase
✅ JSON parsing from agent_response column
✅ Horizontal scrolling carousel with navigation arrows
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
- **2025-10-17**: Updated to parse events from Supabase search_agent table
- Modified schema to match actual Supabase table structure (agent_response JSON column)
- Switched from Neon driver to postgres-js for better Supabase compatibility
- Implemented JSON parsing to extract events array from agent_response
- Updated frontend to display: name, date, and location fields
- Configured SSL settings for Supabase transaction pooler connection
