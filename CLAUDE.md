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

### Database Integration
- Uses Supabase client (`lib/supabase/client.ts`) for database operations
- Database types generated in `lib/database.types.ts`
- Comprehensive backend documentation in `docs/placemarks-backend.md`

### Authentication Pattern
- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
- Admin operations should use service role key (not exposed to client)
- Authentication hook available at `lib/hooks/useAuth.ts`

### Component Structure
- `components/AdminLayout.tsx` - Main layout wrapper
- `components/AdminHeader.tsx` - Navigation header
- `components/ui/` - Reusable UI components (button, card, input, label)
- Page components in `app/` directory (analytics, audit, database, lists, places, users)

### Data Management
- Manages curated lists with publisher branding and location scoping
- Place management with Google Places integration
- Priority-based list ordering system
- Geospatial queries using PostGIS

### Key Features
- Curated lists CRUD operations
- Place assignment to lists
- Publisher and branding support
- Location-scoped lists
- Admin statistics and analytics
- Batch operations for efficiency

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

## Development Notes

- Uses dark mode by default (`className="dark"` in layout)
- Follows Next.js App Router patterns
- Styled with Tailwind CSS using design system approach
- All admin operations should verify authentication before execution
- Database schema supports multi-city expansion beyond Bangkok