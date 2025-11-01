# DisasterWatch AI - Real-time Disaster Forecasting & Response Platform

## Overview

DisasterWatch AI is an AI-powered disaster forecasting and response coordination platform that delivers real-time alerts, personalized warnings, and intelligent evacuation routing for natural disasters including floods, cyclones, heavy rainfall, earthquakes, and wildfires. The system combines machine learning predictions with geographic data to provide actionable intelligence for emergency response.

The platform features a dashboard for monitoring active disasters, location-based alert subscriptions, AI-generated evacuation routes, and comprehensive analytics for tracking prediction accuracy and system performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components based on Radix UI primitives, following the "New York" style variant. The design system emphasizes emergency interface patterns with:
- Clear information hierarchy optimized for crisis situations
- Mobile-first responsive design for field accessibility
- Typography using Inter for readability and JetBrains Mono for technical data
- Progressive disclosure of complex data
- Tailwind CSS for styling with custom theme configuration supporting both light and dark modes

**State Management**: TanStack Query (React Query) for server state management with:
- Automatic refetching disabled by default to prevent unnecessary API calls
- Custom query functions for authenticated requests
- Optimistic updates and cache invalidation patterns

**Routing**: Wouter for lightweight client-side routing

**Key Pages**:
- Dashboard: Overview with maps, active alerts, and predictions
- Alerts: Filterable list of disaster alerts (active/expired/all)
- Locations: User location management for personalized alerts
- Routes: AI-generated evacuation routes
- Analytics: System performance metrics and prediction accuracy

**Real-time Features**: 
- Polling-based alert monitoring (10-second intervals)
- Toast notifications for new critical alerts
- Live map integration using Leaflet for geographic visualization

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode

**API Design**: RESTful API with the following endpoint groups:
- `/api/alerts` - Disaster alert management
- `/api/locations` - User location registration and preferences
- `/api/predictions` - AI prediction data
- `/api/routes` - Evacuation route generation
- `/api/analytics` - System metrics and statistics
- `/api/stats` - Dashboard statistics

**Storage Strategy**: In-memory storage implementation (`MemStorage` class) with an `IStorage` interface that defines the contract for future database implementations. This allows for easy migration to persistent storage without changing application logic.

**AI Integration**: Google Gemini AI (via `@google/genai` package) for:
- Disaster prediction based on location, coordinates, and historical data
- Risk assessment with confidence scoring
- Contributing factor analysis (weather patterns, geographical risk, historical frequency, seasonal trends, climate indicators)
- Evacuation route generation with safety ratings

The AI system uses structured JSON responses with specific schemas for predictions and routes, ensuring consistent data formats.

### Data Models

**Core Entities** (defined in `shared/schema.ts`):

1. **Alerts**: Disaster warnings with type, severity, location coordinates, affected regions, predicted impact, confidence scores, and active status
2. **User Locations**: Saved locations with notification preferences and alert radius
3. **Predictions**: AI-generated forecasts with probability, confidence, contributing factors, and reasoning
4. **Evacuation Routes**: Multi-waypoint routes with distance, estimated time, safety ratings, and hazard information
5. **Analytics Data**: System-wide metrics including total predictions, accuracy rates, response times, and disaster type breakdowns

**Data Validation**: Zod schemas for runtime type validation and Drizzle-Zod integration for database schema validation

### Database Architecture

**ORM**: Drizzle ORM configured for PostgreSQL (via Neon serverless driver)

**Schema Definition**: Centralized in `shared/schema.ts` using Drizzle's declarative schema builder with:
- UUID primary keys using `gen_random_uuid()`
- Timestamp tracking (created_at, expires_at)
- Array fields for multi-value data (affected regions, notification preferences)
- JSONB fields for flexible structured data (contributing factors, waypoints)
- Real number fields for coordinates and percentages

**Migration Strategy**: Drizzle Kit with migrations stored in `/migrations` directory, using `drizzle-kit push` for schema synchronization

**Note**: The current implementation uses in-memory storage for development/testing. The database schema is defined and ready for use, but the storage layer can be switched to PostgreSQL by implementing the database operations in the storage service.

### Authentication & Authorization

Currently not implemented - the system operates without user authentication. This is suitable for public disaster information systems but would need authentication for personalized features in production.

### Design System Decisions

**Emergency-First Design**: The UI follows design guidelines in `design_guidelines.md` that prioritize:
- Rapid information scanning during emergencies
- Color-coded severity levels (critical/high = destructive variant, moderate = default, low = secondary)
- Consistent spacing system using Tailwind units (4, 6, 8, 12, 16, 24)
- Accessible typography scale from hero titles (36px) to metadata (12px)
- Monospace fonts for coordinates and timestamps to aid scanning

**Theme System**: Comprehensive light/dark mode support with CSS custom properties for:
- Semantic color tokens (background, foreground, primary, destructive, etc.)
- Elevation layers for hover/active states
- Automatic border intensity calculations for buttons
- Consistent shadow and outline patterns

**Component Patterns**:
- Elevation effects on hover (`hover-elevate` class) for interactive elements
- Badge variants matching severity levels
- Card-based layouts with clear borders and shadows
- Progressive disclosure using collapsible sections and tabs

## External Dependencies

### Third-Party APIs

1. **Google Gemini AI** (`@google/genai`): 
   - Purpose: Disaster prediction and evacuation route generation
   - Authentication: API key via `GEMINI_API_KEY` environment variable
   - Model: Uses gemini-2.5-flash or gemini-2.5-pro series
   - Note: Uses Gemini Developer API Key, not Vertex AI

2. **OpenStreetMap** (via Leaflet CDN):
   - Purpose: Map tile provider for disaster visualization
   - Loaded via CDN in `client/index.html`
   - No authentication required

### Database Services

**Neon Serverless PostgreSQL** (`@neondatabase/serverless`):
- Connection via `DATABASE_URL` environment variable
- Serverless-optimized driver for edge deployments
- WebSocket-based connections for low latency

### UI Component Libraries

1. **Radix UI**: Headless accessible components (@radix-ui/* packages)
2. **shadcn/ui**: Pre-styled component implementations built on Radix
3. **Recharts**: Chart library for analytics visualizations
4. **Leaflet**: Interactive map library for geographic data
5. **Lucide React**: Icon system

### Development Tools

1. **Vite**: Build tool and dev server with React plugin
2. **Replit Plugins**: Development environment integration (@replit/vite-plugin-*)
3. **date-fns**: Date formatting and manipulation
4. **Tailwind CSS**: Utility-first CSS framework
5. **PostCSS**: CSS processing with Autoprefixer

### Form & Validation

1. **React Hook Form**: Form state management
2. **Zod**: Schema validation with TypeScript inference
3. **@hookform/resolvers**: Zod resolver for React Hook Form

### Key Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (required for database operations)
- `GEMINI_API_KEY`: Google Gemini API authentication
- `NODE_ENV`: Environment mode (development/production)
