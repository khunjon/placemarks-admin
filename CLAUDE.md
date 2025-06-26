# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 admin dashboard for managing curated lists in the Placemarks application. The app uses:

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI**: Tailwind CSS 4 with Radix UI components (shadcn/ui)
- **Backend**: Supabase with PostgreSQL + PostGIS for geospatial data
- **Authentication**: Supabase Auth with admin user management

## Key Architecture Details

### Service Layer Pattern
- Business logic abstracted to `lib/services/` with singleton pattern exports
- `CuratedListsAdminService` uses service role key for admin operations
- Service classes handle error states and provide consistent data interfaces
- Exported as singleton instances (e.g., `curatedListsAdmin`) rather than classes

### Database Integration
- Uses Supabase client (`lib/supabase/client.ts`) for database operations
- Database types generated in `lib/database.types.ts`
- Service layer manages both anon key (client) and service key (admin) operations
- Graceful environment variable handling during build time

### Authentication Pattern
- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
- Admin operations use `SUPABASE_SERVICE_KEY` through service layer
- Authentication hook available at `lib/hooks/useAuth.ts`
- All admin pages use `export const dynamic = 'force-dynamic'` to prevent SSG issues

### API Route Structure
- RESTful design under `/api/admin/` for admin operations
- Resource-based routing (e.g., `/api/admin/lists`, `/api/admin/publishers`)
- Nested routes for relationships (e.g., `/api/admin/lists/[id]/places`)
- Consistent error handling and HTTP status codes
- Uses singleton service instances for database operations

### Component Architecture
- `components/AdminLayout.tsx` - Main layout wrapper with auth checks
- `components/AdminHeader.tsx` - Navigation header
- `components/ui/` - Reusable UI components built on Radix UI primitives
- `AutocompleteInput` component for form enhancements with suggestion loading
- Centralized styling in `lib/styles/dashboard-styles.ts`

### Data Management Patterns
- Curated lists with publisher branding and location scoping
- Google Places API integration for place management
- Autocomplete functionality for publishers and location scopes
- Priority-based list ordering system
- Geospatial queries using PostGIS
- Real-time data loading with debounced search

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key  # For admin operations
```

**Important for Deployment:**
- Environment variables must be available during build time on Vercel
- The app gracefully handles missing environment variables with error messages
- All auth-protected pages use `export const dynamic = 'force-dynamic'` to prevent SSG issues

## Development Patterns

### State Management
- React hooks for local state with consistent patterns
- Custom hooks like `useAuth` and `useSorting` for shared logic
- Callback patterns with `useCallback` for performance optimization
- Loading states and error handling across all data operations

### Form Handling
- AutocompleteInput component for enhanced UX with existing data suggestions
- Real-time validation and debounced API calls
- Consistent form styling through `dashboardStyles.input`
- Modal patterns for create/edit operations

### UI/UX Conventions
- Dark mode by default (`className="dark"` in layout)
- Cyan accent color (`#00ffff`) for interactive elements
- Consistent hover effects and transitions
- Table-based data display with sortable columns
- Icon-based status indicators with color coding

### Code Organization
- TypeScript strict mode with generated database types
- Consistent import patterns and file organization
- Error boundaries and graceful degradation
- Performance optimizations with React 19 features

### Database Interaction
- You have access to Supabase MCP tools to view the database schema. Do not make changes to the schema in this project. 