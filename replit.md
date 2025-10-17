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
- **ORM**: Drizzle ORM with Neon HTTP adapter

### Key Components
- `ConceptBox`: Displays event data in a card format with date, place, and event name
- `ConceptCarousel`: Horizontal scrollable container with navigation arrows
- `ThemeToggle`: Dark/light mode switcher
- `LoadingSkeleton`: Loading state with shimmer animation

## Database Schema

### Events Table
```sql
CREATE TABLE events (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  place TEXT NOT NULL,
  event TEXT NOT NULL,
  category TEXT DEFAULT 'Events',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints
- `GET /api/events` - Fetches all events from Supabase

## Setup Instructions

### Database Setup
1. The application uses Supabase for data storage
2. Ensure your DATABASE_URL environment variable is set with the Supabase connection string
3. Connection string format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`
4. Get the connection string from Supabase dashboard:
   - Navigate to your project
   - Click "Connect" button
   - Copy URI from "Transaction pooler" section
   - Replace `[YOUR-PASSWORD]` with your database password

### Adding Events to Supabase
To populate the events table, you can use the Supabase SQL Editor:

```sql
INSERT INTO events (date, place, event) VALUES
  ('June 15, 2025', 'Central Park, NYC', 'Summer Music Festival'),
  ('June 22, 2025', 'Blue Note, Manhattan', 'Jazz Night Live'),
  ('July 10, 2025', 'Convention Center, SF', 'Tech Summit 2025'),
  ('July 18, 2025', 'MoMA, New York', 'Art Gallery Opening'),
  ('August 5, 2025', 'Napa Valley, CA', 'Food & Wine Festival');
```

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
- Header title should display "PAPA"
- Events displayed in grouped format: date, place, event name
- Focus on Events data only (no appointments or financial info)

## Recent Changes
- **2025-10-17**: Initial setup with Supabase integration
- Created event schema and API endpoints
- Built reusable UI components with examples
- Implemented horizontal carousel with smooth scrolling
- Added theme toggle and responsive design
