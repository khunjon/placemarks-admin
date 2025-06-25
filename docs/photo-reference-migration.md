# Photo Reference Migration

This document describes the migration from storing full Google Places photo URLs to storing only photo references for better cross-platform compatibility.

## Problem Solved

Previously, the admin UI stored complete Google Places photo URLs with the admin API key, which caused photos to break in the mobile app that uses a different API key. Now, we store only photo references and let each platform generate URLs with their own API keys.

## Changes Made

### 1. Photo Utilities (`lib/utils/photo-utils.ts`)
- `generateAdminPhotoUrl()`: Creates photo URLs using admin API key
- `extractPhotoReferences()`: Extracts photo reference objects from Google Places API responses
- `isValidPhotoReference()`: Validates photo reference strings

### 2. Photo Display Components
- `components/ui/place-photo.tsx`: Single photo display with fallback
- `components/ui/place-photo-gallery.tsx`: Multiple photo gallery view

### 3. Service Updates
- **Google Places Cache Service**: Now stores photo references instead of full URLs
- **Places Service**: Added support for Google Places Details API
- **Curated Lists Service**: Creates places with photo references, not URLs

### 4. API Routes
- `app/api/places/details/route.ts`: New endpoint for fetching place details including photos

### 5. Database Operations
- Places are created with `photo_references` field populated
- `photos_urls` field explicitly set to null to avoid storing URLs

## Environment Variables

```env
# Server-side API key for API routes (keep private)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Client-side API key for admin UI photo display (can be public)
# This should be a restricted API key with only Places Photo API access
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_admin_photo_api_key_here
```

## Photo Reference Format

Photo references are stored as JSON objects:

```json
[
  {
    "photo_reference": "ATKogpdN7NqqSXxH74V86_YrIzFBtHwARYurvF0L49XZ...",
    "height": 1080,
    "width": 1920,
    "html_attributions": ["<a href=\"...\">Place Name</a>"]
  }
]
```

## Mobile App Compatibility

The mobile app can now:
1. Read `photo_references` from the database
2. Generate photo URLs using its own API key
3. Display photos without authentication issues

## Usage Example

```tsx
import { PlacePhoto } from '@/components/ui/place-photo'

// Display a single photo with fallback
<PlacePhoto 
  photoReferences={place.photo_references}
  placeName={place.name}
  maxWidth={300}
/>
```

## Benefits

- ✅ Cross-platform photo compatibility
- ✅ No API key conflicts between admin UI and mobile app
- ✅ Cleaner data storage (references vs full URLs)
- ✅ Better security (API keys stay within their respective platforms)
- ✅ Future-proof design for additional platforms