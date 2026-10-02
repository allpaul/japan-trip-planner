import { useEffect } from 'react'
import {
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps'
import {
  BedDouble,
  MapPin,
} from 'lucide-react'

import type {
  Day,
  ResolvedPlaces,
  ResolvedRoutes,
  SelectablePlace,
} from '../models/itinerary'

import { dayColours } from '../data/dayColours'
import { getRouteKey } from '../hooks/useResolvedRoutes'

import PlaceDetails from './PlaceDetails'

interface TripMapProps {
  days: Day[]
  dayIndexOffset?: number
  resolvedPlaces: ResolvedPlaces
  resolvedRoutes: ResolvedRoutes
  selectedPlace: SelectablePlace | null
  onPlaceSelect: (
    place: SelectablePlace | null,
  ) => void
  navigation?: {
    current: number
    total: number
    onPrevious?: () => void
    onNext?: () => void
  }
}

function TripMap({
  days,
  dayIndexOffset = 0,
  resolvedPlaces,
  resolvedRoutes,
  selectedPlace,
  onPlaceSelect,
  navigation,
}: TripMapProps) {
  return (
    <div className="relative h-full w-full">
      <Map
        defaultCenter={{
          lat: 35.6762,
          lng: 139.6503,
        }}
        defaultZoom={11}
        mapId="DEMO_MAP_ID"
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={true}
      >
        <TripMapContent
          days={days}
          dayIndexOffset={
            dayIndexOffset
          }
          resolvedPlaces={
            resolvedPlaces
          }
          resolvedRoutes={
            resolvedRoutes
          }
          selectedPlace={
            selectedPlace
          }
          onPlaceSelect={
            onPlaceSelect
          }
          navigation={navigation}
        />
      </Map>
    </div>
  )
}

function TripMapContent({
  days,
  dayIndexOffset = 0,
  resolvedPlaces,
  resolvedRoutes,
  selectedPlace,
  onPlaceSelect,
  navigation,
}: TripMapProps) {
  const map = useMap()

  const mapsLibrary =
    useMapsLibrary('maps')

  const activities = days.flatMap(
    (day, dayIndex) =>
      day.activities.map(
        (
          activity,
          activityIndex,
        ) => ({
          activity,
          dayIndex:
            dayIndex +
            dayIndexOffset,
          activityIndex,
        }),
      ),
  )

  const accommodations = [
    ...new globalThis.Map(
      days
        .map(
          (day) =>
            day.accommodation,
        )
        .filter(
          (accommodation) =>
            accommodation !==
            undefined,
        )
        .map(
          (accommodation) => [
            accommodation.id,
            accommodation,
          ],
        ),
    ).values(),
  ]
  useEffect(() => {
    if (!map || selectedPlace) {
      return
    }
  
    const locations = [
      ...activities
        .map(
          ({ activity }) =>
            resolvedPlaces[
              activity.id
            ]?.location,
        )
        .filter(
          (
            location,
          ): location is {
            lat: number
            lng: number
          } => Boolean(location),
        ),
  
      ...accommodations
        .map(
          (accommodation) =>
            resolvedPlaces[
              accommodation.id
            ]?.location,
        )
        .filter(
          (
            location,
          ): location is {
            lat: number
            lng: number
          } => Boolean(location),
        ),
    ]
  
    if (locations.length === 0) {
      return
    }
  
    if (locations.length === 1) {
      map.setCenter(locations[0])
      map.setZoom(15)
      return
    }
  
    const bounds = {
      north: Math.max(
        ...locations.map(
          (location) =>
            location.lat,
        ),
      ),
  
      south: Math.min(
        ...locations.map(
          (location) =>
            location.lat,
        ),
      ),
  
      east: Math.max(
        ...locations.map(
          (location) =>
            location.lng,
        ),
      ),
  
      west: Math.min(
        ...locations.map(
          (location) =>
            location.lng,
        ),
      ),
    }
  
    map.fitBounds(bounds, {
      top: 70,
      right: 50,
      bottom: 70,
      left: 50,
    })
  }, [
    map,
    days,
    resolvedPlaces,
    selectedPlace,
  ])
  /*
   * Zoom to selected activity
   * or selected hotel.
   */
  useEffect(() => {
    if (
      !map ||
      !selectedPlace
    ) {
      return
    }

    const location =
      resolvedPlaces[
        selectedPlace.id
      ]?.location

    if (!location) {
      return
    }

    map.panTo(location)
    map.setZoom(15)
  }, [
    map,
    selectedPlace,
    resolvedPlaces,
  ])

  /*
   * Draw walking routes.
   */
  useEffect(() => {
    if (
      !map ||
      !mapsLibrary
    ) {
      return
    }

    const resolveColor = (
      color: string,
    ) => {
      if (
        !color.startsWith('var(')
      ) {
        return color
      }

      const variableName =
        color
          .replace('var(', '')
          .replace(')', '')
          .trim()

      return getComputedStyle(
        document.documentElement,
      )
        .getPropertyValue(
          variableName,
        )
        .trim()
    }

    const polylines: InstanceType<
        typeof mapsLibrary.Polyline
    >[] = []

    days.forEach(
      (day, dayIndex) => {
        const actualDayIndex =
          dayIndex +
          dayIndexOffset

        const color =
          resolveColor(
            dayColours[
              actualDayIndex %
                dayColours.length
            ],
          )

        day.activities
          .slice(0, -1)
          .forEach(
            (
              activity,
              activityIndex,
            ) => {
              const nextActivity =
                day.activities[
                  activityIndex + 1
                ]

              const route =
                resolvedRoutes[
                  getRouteKey(
                    activity.id,
                    nextActivity.id,
                  )
                ]

              if (
                !route?.path ||
                route.path.length <
                  2
              ) {
                return
              }

              const polyline =
                new mapsLibrary.Polyline(
                  {
                    map,
                    path: route.path,
                    strokeColor:
                      color,
                    strokeOpacity:
                      0.9,
                    strokeWeight: 6,
                  },
                )

              polylines.push(
                polyline,
              )
            },
          )
      },
    )

    return () => {
      polylines.forEach(
        (polyline) => {
          polyline.setMap(
            null,
          )
        },
      )
    }
  }, [
    map,
    mapsLibrary,
    days,
    dayIndexOffset,
    resolvedRoutes,
  ])

  return (
    <>
      {/* Activity markers */}
      {activities.map(
        ({
          activity,
          dayIndex,
          activityIndex,
        }) => {
          const location =
            resolvedPlaces[
              activity.id
            ]?.location

          if (!location) {
            return null
          }

          const color =
            dayColours[
              dayIndex %
                dayColours.length
            ]

          const isSelected =
            selectedPlace?.id ===
            activity.id

          return (
            <AdvancedMarker
              key={activity.id}
              position={location}
              onClick={() =>
                onPlaceSelect(
                  activity,
                )
              }
              zIndex={
                isSelected
                  ? 100
                  : 1
              }
            >
              <div
                className={`
                  relative h-10 w-10
                  cursor-pointer
                  transition-transform
                  duration-200
                  ${
                    isSelected
                      ? 'scale-125'
                      : ''
                  }
                `}
              >
                {/* White outline */}
                <MapPin
                  className="absolute inset-0 h-10 w-10"
                  style={{
                    fill: 'white',
                    color: 'white',
                  }}
                  strokeWidth={1}
                />

                {/* Day colour */}
                <MapPin
                  className="
                    absolute left-1/2
                    top-1/2
                    h-[37px] w-[37px]
                    -translate-x-1/2
                    -translate-y-1/2
                  "
                  style={{
                    fill: color,
                    color: color,
                  }}
                  strokeWidth={1}
                />

                <span
                  className="
                    absolute left-1/2
                    top-[45%] z-30
                    -translate-x-1/2
                    -translate-y-1/2
                    text-xs font-bold
                    text-white
                  "
                >
                  {activityIndex +
                    1}
                </span>
              </div>
            </AdvancedMarker>
          )
        },
      )}

      {/* Hotel markers */}
      {accommodations.map(
        (accommodation) => {
          const location =
            resolvedPlaces[
              accommodation.id
            ]?.location

          if (!location) {
            return null
          }

          const isSelected =
            selectedPlace?.id ===
            accommodation.id

          return (
            <AdvancedMarker
              key={
                accommodation.id
              }
              position={location}
              onClick={() =>
                onPlaceSelect(
                  accommodation,
                )
              }
              zIndex={
                isSelected
                  ? 100
                  : 10
              }
            >
              <div
                className={`
                  relative h-10 w-10
                  cursor-pointer
                  transition-transform
                  duration-200
                  ${
                    isSelected
                      ? 'scale-125'
                      : ''
                  }
                `}
              >
                {/* White outline */}
                <MapPin
                  className="absolute inset-0 h-10 w-10"
                  style={{
                    fill: 'white',
                    color: 'white',
                  }}
                  strokeWidth={1}
                />

                {/* Hotel pin */}
                <MapPin
                  className="
                    absolute left-1/2
                    top-1/2
                    h-[37px] w-[37px]
                    -translate-x-1/2
                    -translate-y-1/2
                    fill-pink-100
                    text-pink-100
                  "
                  strokeWidth={1}
                />

                <BedDouble
                  className="
                    absolute left-1/2
                    top-[43%] z-30
                    h-4 w-4
                    -translate-x-1/2
                    -translate-y-1/2
                    text-pink-600
                  "
                  strokeWidth={2.5}
                />
              </div>
            </AdvancedMarker>
          )
        },
      )}

      {selectedPlace && (
        <PlaceDetails
          activity={
            selectedPlace
          }
          place={
            resolvedPlaces[
              selectedPlace.id
            ]
          }
          onClose={() =>
            onPlaceSelect(null)
          }
          navigation={navigation}
        />
      )}
    </>
  )
}

export default TripMap