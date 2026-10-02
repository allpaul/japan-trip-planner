import { useEffect, useState } from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'

import type {
    Accommodation,
  Day,
  ResolvedPlace,
  ResolvedPlaces,
} from '../models/itinerary'

const CACHE_KEY = 'japan-trip-places'

function useResolvedPlaces(days: Day[]) {
  const placesLibrary = useMapsLibrary('places')

  const [resolvedPlaces, setResolvedPlaces] =
    useState<ResolvedPlaces>({})

  useEffect(() => {
    if (!placesLibrary) {
      return
    }

    async function resolvePlaces() {
      const cachedPlaces: ResolvedPlaces =
        JSON.parse(
          localStorage.getItem(CACHE_KEY) ??
            '{}',
        )

      /*
       * Get all activities that have
       * a Google Place ID.
       */
      const activities = days
        .flatMap((day) => day.activities)
        .filter(
          (activity) =>
            activity.googlePlaceId,
        )

      /*
       * Get the accommodation for each day.
       */
        const accommodations = days
            .map((day) => day.accommodation)
            .filter(
                (
                    accommodation,
                ): accommodation is Accommodation =>
                    accommodation !== undefined &&
                    Boolean(accommodation.googlePlaceId),
            )

      /*
       * Activities and accommodation are both
       * places that need resolving.
       */
      const places = [
        ...activities,
        ...accommodations,
      ]

      /*
       * The same hotel may appear on several
       * days. Use its ID as the Map key so it
       * only needs to be resolved once.
       */
      const uniquePlaces = [
        ...new Map(
          places.map((place) => [
            place.id,
            place,
          ]),
        ).values(),
      ]

      /*
       * Don't request places that we already
       * have in localStorage.
       */
      const placesToFetch =
        uniquePlaces.filter(
          (place) =>
            !cachedPlaces[place.id],
        )

      const entries = await Promise.all(
        placesToFetch.map(
          async (placeData) => {
            try {
              const place =
                new placesLibrary!.Place({
                  id: placeData.googlePlaceId!,
                })

              await place.fetchFields({
                fields: [
                  'displayName',
                  'location',
                  'formattedAddress',
                  'rating',
                  'googleMapsURI',
                  'photos',
                  'editorialSummary',
                ],
              })

              const resolvedPlace: ResolvedPlace =
                {
                  displayName:
                    place.displayName ??
                    undefined,

                  formattedAddress:
                    place.formattedAddress ??
                    undefined,

                  rating:
                    place.rating ??
                    undefined,

                  googleMapsURI:
                    place.googleMapsURI ??
                    undefined,

                  editorialSummary:
                    place.editorialSummary ??
                    undefined,

                  location: place.location
                    ? {
                        lat: place.location.lat(),
                        lng: place.location.lng(),
                      }
                    : undefined,

                  photoUrl:
                    place.photos?.[0]?.getURI({
                      maxWidth: 800,
                    }) ?? undefined,
                }

              return [
                placeData.id,
                resolvedPlace,
              ] as const
            } catch (error) {
              console.error(
                `Unable to resolve ${placeData.name}:`,
                error,
              )

              return null
            }
          },
        ),
      )

      const fetchedPlaces =
        Object.fromEntries(
          entries.filter(
            (entry) => entry !== null,
          ),
        )

      const allPlaces = {
        ...cachedPlaces,
        ...fetchedPlaces,
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify(allPlaces),
      )

      setResolvedPlaces(allPlaces)
    }

    resolvePlaces()
  }, [placesLibrary, days])

  return resolvedPlaces
}

export default useResolvedPlaces