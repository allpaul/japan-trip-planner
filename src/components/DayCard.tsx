import {
    Fragment,
    useState,
  } from 'react'
  
  import {
    ChevronDown,
    ChevronRight,
    MapPin,
  } from 'lucide-react'
  
  import type {
    Day,
    ResolvedRoutes,
    SelectablePlace,
  } from '../models/itinerary'
  
  import ActivityCard from './ActivityCard'
  import RouteLeg from './RouteLeg'
  import AccommodationCard from './AccommodationCard'
  
  interface DayCardProps {
    day: Day
    color: string
    resolvedRoutes: ResolvedRoutes
    onPlaceSelect: (
      place: SelectablePlace | null,
    ) => void
  }
  
  function DayCard({
    day,
    color,
    resolvedRoutes,
    onPlaceSelect,
  }: DayCardProps) {
    const [isExpanded, setIsExpanded] =
      useState(true)
  
    const date = new Date(
      `${day.date}T00:00:00`,
    )
  
    const formattedDate =
      date.toLocaleDateString('en-NZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
  
    const summaryActivities =
      day.activities
        .filter(
          (activity) =>
            activity.googlePlaceId,
        )
        .slice(0, 3)
  
    const remainingActivities = Math.max(
      day.activities.filter(
        (activity) =>
          activity.googlePlaceId,
      ).length - summaryActivities.length,
      0,
    )
  
    const isCheckInDay =
      day.checkIn?.id ===
      day.accommodation?.id
  
    const isCheckOutSameHotel =
      day.checkOut?.id ===
      day.accommodation?.id
  
    return (
      <section
        className="mb-12 scroll-mt-6"
      >
        {/* Collapsible day heading */}
        <button
          type="button"
          onClick={() =>
            setIsExpanded(
              (current) => !current,
            )
          }
          className="
            group mb-5 flex w-full
            cursor-pointer
            items-start gap-3
            text-left
          "
        >
          <div
            className="
              mt-1 flex h-7 w-7
              shrink-0 items-center
              justify-center
              text-base-content/70
              transition-colors
              group-hover:text-base-content
            "
          >
            {isExpanded ? (
              <ChevronDown
                className="h-6 w-6"
                strokeWidth={2.25}
              />
            ) : (
              <ChevronRight
                className="h-6 w-6"
                strokeWidth={2.25}
              />
            )}
          </div>
  
          <div className="min-w-0 flex-1 pr-3">
            <h2
              className="
                text-[26px] font-bold
                leading-tight tracking-tight
                text-base-content
              "
            >
              {formattedDate}
            </h2>
  
            <div
              className="
                mt-2 flex flex-wrap
                items-center
                gap-x-2 gap-y-1
                text-sm font-medium
                text-base-content/70
              "
            >
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {day.city}
              </span>
  
              {summaryActivities.map(
                (activity) => (
                  <Fragment
                    key={activity.id}
                  >
                    <span aria-hidden="true">
                      •
                    </span>
  
                    <span>
                      {activity.name}
                    </span>
                  </Fragment>
                ),
              )}
  
              {remainingActivities > 0 && (
                <>
                  <span aria-hidden="true">
                    •
                  </span>
  
                  <span>
                    +{remainingActivities}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
  
        {isExpanded && (
          <div className="pl-3 pr-3">
            {/* Check-out hotel first */}
            {day.checkOut && (
              <div className="mb-3">
                <AccommodationCard
                  accommodation={
                    day.checkOut
                  }
                  action="Check out"
                  onAccommodationSelect={
                    onPlaceSelect
                  }
                />
              </div>
            )}
  
            {/* Check-in hotel second */}
            {day.accommodation &&
              isCheckInDay &&
              !isCheckOutSameHotel && (
                <div className="mb-5">
                  <AccommodationCard
                    accommodation={
                      day.accommodation
                    }
                    action="Check in"
                    onAccommodationSelect={
                      onPlaceSelect
                    }
                  />
                </div>
              )}
  
            {/* Normal day at same hotel */}
            {day.accommodation &&
              !isCheckInDay &&
              !isCheckOutSameHotel && (
                <div className="mb-5">
                  <AccommodationCard
                    accommodation={
                      day.accommodation
                    }
                    onAccommodationSelect={
                      onPlaceSelect
                    }
                  />
                </div>
              )}
  
            {/* Activity timeline */}
            <div className="relative">
              {day.activities.length > 1 && (
                <div
                  className="
                    absolute bottom-5
                    left-[25px] top-5
                    z-0
                    border-l-2
                    border-dashed
                    border-base-content/35
                  "
                />
              )}
  
              {day.activities.map(
                (activity, index) => {
                  const nextActivity =
                    day.activities[
                      index + 1
                    ]
  
                  return (
                    <Fragment
                      key={activity.id}
                    >
                      <ActivityCard
                        activity={
                          activity
                        }
                        index={index}
                        color={color}
                        onActivitySelect={
                          onPlaceSelect
                        }
                      />
  
                      {nextActivity && (
                        <RouteLeg
                          from={activity}
                          to={
                            nextActivity
                          }
                          resolvedRoutes={
                            resolvedRoutes
                          }
                        />
                      )}
                    </Fragment>
                  )
                },
              )}
            </div>
          </div>
        )}
      </section>
    )
  }
  
  export default DayCard