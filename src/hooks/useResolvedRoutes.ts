import { useEffect, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

import type {
  Day,
  ResolvedPlaces,
  ResolvedRoute,
  ResolvedRoutes,
} from '../models/itinerary'

const CACHE_KEY = 'japan-trip-routes'

export function getRouteKey(
  fromId: string,
  toId: string,
) {
  return `${fromId}-${toId}`
}

function useResolvedRoutes(
  days: Day[],
  resolvedPlaces: ResolvedPlaces,
) {
  const routesLibrary = useMapsLibrary('routes')

  const [resolvedRoutes, setResolvedRoutes] =
    useState<ResolvedRoutes>({})

  useEffect(() => {
    if (!routesLibrary) {
      return
    }

    async function resolveRoutes() {
      const cachedRoutes: ResolvedRoutes = JSON.parse(
        localStorage.getItem(CACHE_KEY) ?? '{}',
      )

      const legs = days.flatMap((day) =>
        day.activities.slice(0, -1).map(
          (activity, index) => ({
            from: activity,
            to: day.activities[index + 1],
          }),
        ),
      )

      /*
       * For v1 we automatically calculate walking routes.
       *
       * If transportToNext exists, it represents an explicitly
       * configured train/bus/drive leg, so we don't ask Google
       * for a walking route for that leg.
       */
      const walkingLegs = legs.filter(
        ({ from, to }) =>
          !from.transportToNext &&
          resolvedPlaces[from.id]?.location &&
          resolvedPlaces[to.id]?.location,
      )

      const routesToFetch = walkingLegs.filter(
        ({ from, to }) =>
          !cachedRoutes[getRouteKey(from.id, to.id)],
      )

      const entries = await Promise.all(
        routesToFetch.map(async ({ from, to }) => {
          const fromLocation =
            resolvedPlaces[from.id]?.location

          const toLocation =
            resolvedPlaces[to.id]?.location

          if (!fromLocation || !toLocation) {
            return null
          }

          try {

            const { routes } =
            
              await routesLibrary!.Route.computeRoutes({
                origin: fromLocation,
                destination: toLocation,
                travelMode: 'WALKING',
                fields: [
                  'distanceMeters',
                  'durationMillis',
                  'path',
                ],
              })

            const route = routes[0]

            if (!route) {
              return null
            }

            const path = route.path?.map(
                (point: { lat: number; lng: number }) => ({
                  lat: point.lat,
                  lng: point.lng,
                }),
              )
              
              const resolvedRoute: ResolvedRoute = {
                distanceMeters: route.distanceMeters,
                durationMillis: route.durationMillis,
                path,
              }

            return [
              getRouteKey(from.id, to.id),
              resolvedRoute,
            ] as const
          } catch (error) {
            console.error(
              `Unable to calculate route from ${from.name} to ${to.name}:`,
              error,
            )

            return null
          }
        }),
      )

      const fetchedRoutes = Object.fromEntries(
        entries.filter((entry) => entry !== null),
      )

      const allRoutes = {
        ...cachedRoutes,
        ...fetchedRoutes,
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(allRoutes),
      )

      setResolvedRoutes(allRoutes)
    }

    resolveRoutes()
  }, [routesLibrary, days, resolvedPlaces])

  return resolvedRoutes
}

export default useResolvedRoutes