export interface Location {
    lat: number
    lng: number
  }
  
  export interface Transport {
    mode: 'walk' | 'transit' | 'drive'
    departureTime?: string
    arrivalTime?: string
    name?: string
    from?: string
    to?: string
  }
  
  export interface Activity {
    id: string
    name: string
    time?: string
    notes?: string
    mapsUrl?: string
    googlePlaceId?: string
    location?: Location
    transportToNext?: Transport
  }
  
  export interface Accommodation {
    id: string
    name: string
    googlePlaceId?: string
    location?: Location
  }
  
  export interface SelectablePlace {
    id: string
    name: string
  }

  export interface Day {
    id: string
    date: string
    city: string
    title?: string
  
    accommodation?: Accommodation
    checkIn?: Accommodation
    checkOut?: Accommodation
  
    activities: Activity[]
  }
  
  export interface ResolvedPlace {
    location?: Location
    displayName?: string
    formattedAddress?: string
    rating?: number
    googleMapsURI?: string
    photoUrl?: string
    editorialSummary?: string
  }
  
  export type ResolvedPlaces = Record<string, ResolvedPlace>
  
  export interface ResolvedRoute {
    distanceMeters?: number
    durationMillis?: number
    path?: Location[]
  }
  
  export type ResolvedRoutes = Record<string, ResolvedRoute>