import {
  useEffect,
  useState,
} from 'react'

import {
  APIProvider,
} from '@vis.gl/react-google-maps'

import {
  CalendarDays,
  Clock,
  List,
  Map as MapIcon,
} from 'lucide-react'

import type {
  SelectablePlace,
} from './models/itinerary'

import { itinerary } from './data/itinerary'
import { dayColours } from './data/dayColours'

import useResolvedPlaces from './hooks/useResolvedPlaces'
import useResolvedRoutes from './hooks/useResolvedRoutes'

import Sidebar from './components/Sidebar'
import DayCard from './components/DayCard'
import TripMap from './components/TripMap'
import MobileDayNav from './components/MobileDayNav'

import japanHero from './assets/japan-hero.webp'
import sushiB from './assets/sushi-bee.png'
import onigiriP from './assets/onigiri-p.png'

function AppContent() {
  const [
    selectedPlace,
    setSelectedPlace,
  ] =
    useState<SelectablePlace | null>(
      null,
    )

  const [
    selectedDayId,
    setSelectedDayId,
  ] = useState(itinerary[0].id)

  const [
    mobileView,
    setMobileView,
  ] =
    useState<
      'itinerary' | 'map'
    >('itinerary')

  const resolvedPlaces =
    useResolvedPlaces(itinerary)

  const resolvedRoutes =
    useResolvedRoutes(
      itinerary,
      resolvedPlaces,
    )

  /*
   * Keep the mobile date navigation in
   * sync with the day currently beneath
   * the sticky mobile header.
   */
  useEffect(() => {
      const isMobile =
      window.matchMedia(
        '(max-width: 767px)',
      ).matches
    
    if (
      isMobile &&
      mobileView !== 'itinerary'
    ) {
      return
    }

    const updateActiveDay = () => {
      /*
       * MobileDayNav + Itinerary/Map
       * controls are roughly 120px high.
       * Check slightly beneath them.
       */
      const triggerPoint = 140

      let activeDayId =
        itinerary[0].id

      for (const day of itinerary) {
        const element =
          document.getElementById(
            day.id,
          )

        if (!element) {
          continue
        }

        const rect =
          element.getBoundingClientRect()

        if (
          rect.top <= triggerPoint
        ) {
          activeDayId = day.id
        } else {
          break
        }
      }

      setSelectedDayId(
        activeDayId,
      )
    }

    updateActiveDay()

    window.addEventListener(
      'scroll',
      updateActiveDay,
      {
        passive: true,
      },
    )

    return () => {
      window.removeEventListener(
        'scroll',
        updateActiveDay,
      )
    }
  }, [mobileView])

  const selectedDayIndex =
    itinerary.findIndex(
      (day) =>
        day.id === selectedDayId,
    )

  const selectedDay =
    itinerary[
      selectedDayIndex
    ] ?? itinerary[0]

  const mapActivities =
    selectedDay.activities.filter(
      (activity) =>
        resolvedPlaces[
          activity.id
        ]?.location,
    )

  const selectedActivityIndex =
    mapActivities.findIndex(
      (activity) =>
        activity.id ===
        selectedPlace?.id,
    )

  const currentActivityIndex =
    selectedActivityIndex >= 0
      ? selectedActivityIndex
      : 0

  const previousActivity =
    currentActivityIndex > 0
      ? mapActivities[
          currentActivityIndex - 1
        ]
      : undefined

  const nextActivity =
    currentActivityIndex <
    mapActivities.length - 1
      ? mapActivities[
          currentActivityIndex + 1
        ]
      : undefined

  const scrollToDay = (
    dayId: string,
  ) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document
          .getElementById(dayId)
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      })
    })
  }

  const handleDaySelect = (
    dayId: string,
  ) => {
    setSelectedDayId(dayId)
    setSelectedPlace(null)

    if (
      mobileView === 'itinerary'
    ) {
      scrollToDay(dayId)
    }
  }

  const handleMobileMapOpen =
    () => {
      setMobileView('map')

      const selectedPlaceIsOnDay =
        selectedDay.activities.some(
          (activity) =>
            activity.id ===
            selectedPlace?.id,
        ) ||
        selectedDay
          .accommodation?.id ===
          selectedPlace?.id

      if (
        !selectedPlaceIsOnDay
      ) {
        setSelectedPlace(null)
      }
    }

  const handleMobileItineraryOpen =
    () => {
      setMobileView('itinerary')

      scrollToDay(
        selectedDayId,
      )
    }

  return (
    <div className="drawer md:drawer-open">
      <input
        id="trip-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content">
        {/* Mobile controls */}
        <div className="sticky top-0 z-40 bg-base-100 md:hidden">
          <MobileDayNav
            days={itinerary}
            selectedDayId={
              selectedDayId
            }
            onDaySelect={
              handleDaySelect
            }
          />

          <div className="grid grid-cols-2 border-b border-base-300 p-2">
            <button
              type="button"
              onClick={
                handleMobileItineraryOpen
              }
              className={`
                flex cursor-pointer
                items-center
                justify-center gap-2
                rounded-lg py-2
                text-sm font-semibold
                ${
                  mobileView ===
                  'itinerary'
                    ? 'bg-base-300 text-base-content'
                    : 'text-base-content/60'
                }
              `}
            >
              <List className="h-4 w-4" />
              Itinerary
            </button>

            <button
              type="button"
              onClick={
                handleMobileMapOpen
              }
              className={`
                flex cursor-pointer
                items-center
                justify-center gap-2
                rounded-lg py-2
                text-sm font-semibold
                ${
                  mobileView ===
                  'map'
                    ? 'bg-base-300 text-base-content'
                    : 'text-base-content/60'
                }
              `}
            >
              <MapIcon className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        <main className="grid md:grid-cols-[minmax(0,1fr)_minmax(400px,40%)]">
          {/* Itinerary */}
          <div
            className={`
              min-w-0
              ${
                mobileView === 'map'
                  ? 'hidden md:block'
                  : 'block'
              }
            `}
          >
            {/* Hero */}
            <div className="relative">
              <img
                src={japanHero}
                alt="Japan"
                className="
                  h-72 w-full
                  object-cover
                "
              />

              <div
                className="
                  relative z-10
                  mx-3 -mt-10
                  rounded-3xl
                  bg-base-100
                  p-4
                  shadow-xl
                  md:mx-6
                  md:p-6
                "
              >
                <div
                  className="
                    flex items-end
                    justify-between
                    gap-2
                  "
                >
                  {/* Hero text */}
                  <div className="min-w-0">
                    <p
                      className="
                        text-sm font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-primary
                      "
                    >
                      Japan 2026
                    </p>

                    <h1
                      className="
                        mt-1 text-3xl
                        font-bold
                        tracking-tight
                      "
                    >
                      Buhbee-san in Japan
                    </h1>

                    <div
                      className="
                        mt-4 flex
                        flex-wrap gap-4
                        text-sm
                        text-base-content/60
                      "
                    >
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />

                        <span>
                          24 Oct – 9 Nov
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />

                        <span>
                          17 days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Characters */}
                  <div
                    className="
                      flex shrink-0
                      items-end
                      gap-0
                      pt-3
                    "
                  >
            <img
              src={onigiriP}
              alt=""
              className="
                -mt-6
                h-28 w-auto
                object-contain
                animate-gentle-tilt
                pb-1
                pr-4
              "
            />

            <img
              src={sushiB}
              alt=""
              className="
                -mt-6
                h-28 w-auto
                object-contain
                animate-gentle-tilt-reverse
              "
            />
              
                  </div>
                </div>
              </div>
            </div>

            {/* Days */}
          <div className="mx-auto max-w-3xl px-6 py-10">
              {itinerary.map(
                (
                  day,
                  dayIndex,
                ) => (
                  <div
                    key={day.id}
                    id={day.id}
                    className="
                      scroll-mt-32
                    "
                  >
                    <DayCard
                      day={day}
                      color={
                        dayColours[
                          dayIndex %
                            dayColours.length
                        ]
                      }
                      resolvedRoutes={
                        resolvedRoutes
                      }
                      onPlaceSelect={(
                        place,
                      ) => {
                        setSelectedPlace(
                          place,
                        )

                        if (place) {
                          setSelectedDayId(
                            day.id,
                          )
                        }
                      }}
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Desktop map */}
          <div
            className="
              relative hidden
              h-screen
              md:sticky md:top-0
              md:block
            "
          >
            <TripMap
              days={itinerary}
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
                setSelectedPlace
              }
            />
          </div>

          {/* Mobile map */}
          {mobileView === 'map' && (
            <div
              className="
                relative
                h-[calc(100dvh-116px)]
                md:hidden
              "
            >
            <TripMap
              days={itinerary}
              focusDays={[selectedDay]}
              resolvedPlaces={resolvedPlaces}
              resolvedRoutes={resolvedRoutes}
              selectedPlace={selectedPlace}
              onPlaceSelect={setSelectedPlace}
              navigation={
                selectedActivityIndex >= 0
                  ? {
                      current: currentActivityIndex + 1,
                      total: mapActivities.length,
                      onPrevious: previousActivity
                        ? () => setSelectedPlace(previousActivity)
                        : undefined,
                      onNext: nextActivity
                        ? () => setSelectedPlace(nextActivity)
                        : undefined,
                    }
                  : undefined
              }
            />
            </div>
          )}
        </main>
      </div>

      {/* Desktop sidebar */}
      <div className="drawer-side z-30">
        <label
          htmlFor="trip-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

      <Sidebar
        days={itinerary}
        selectedDayId={selectedDayId}
        onDaySelect={handleDaySelect}
      />
      </div>
    </div>
  )
}

function App() {
  return (
    <APIProvider
      apiKey={
        import.meta.env
          .VITE_GOOGLE_MAPS_API_KEY
      }
    >
      <AppContent />
    </APIProvider>
  )
}

export default App