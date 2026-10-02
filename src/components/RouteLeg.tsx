import {
    BusFront,
    Car,
    Footprints,
    TrainFront,
  } from 'lucide-react'
  
  import type {
    Activity,
    ResolvedRoutes,
  } from '../models/itinerary'
  
  import { getRouteKey } from '../hooks/useResolvedRoutes'
  
  interface RouteLegProps {
    from: Activity
    to: Activity
    resolvedRoutes: ResolvedRoutes
  }
  
  function RouteLeg({
    from,
    to,
    resolvedRoutes,
  }: RouteLegProps) {
    const transport = from.transportToNext
  
    /*
     * Explicit transport takes priority over an
     * automatically calculated walking route.
     */
    if (transport) {
      const isBus =
        transport.name
          ?.toLowerCase()
          .includes('bus') ?? false
  
      const TravelIcon =
        transport.mode === 'drive'
          ? Car
          : isBus
            ? BusFront
            : transport.mode === 'transit'
              ? TrainFront
              : Footprints
  
      return (
        <div className="relative z-10 flex min-h-12 items-center">
          <div className="w-8 shrink-0" />
  
          <div
            className="
              ml-3 flex min-w-0
              items-center gap-1.5 py-2
              text-sm text-base-content/80
            "
          >
            <TravelIcon
              className="h-4 w-4 shrink-0 text-base-content/65"
              strokeWidth={2}
            />
  
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                {(transport.departureTime ||
                  transport.arrivalTime) && (
                  <span className="text-xs font-semibold text-base-content/65">
                    {transport.departureTime}
  
                    {transport.departureTime &&
                      transport.arrivalTime && (
                        <> → </>
                      )}
  
                    {transport.arrivalTime}
                  </span>
                )}
  
                {transport.name && (
                  <span className="text-xs font-medium text-base-content/65">
                    {transport.name}
                  </span>
                )}
              </div>
  
              {transport.from &&
                transport.to && (
                  <p className="mt-0.5 text-xs font-medium text-base-content/65">
                    {transport.from} →{' '}
                    {transport.to}
                  </p>
                )}
            </div>
          </div>
        </div>
      )
    }
  
    const route =
      resolvedRoutes[
        getRouteKey(from.id, to.id)
      ]
  
    if (
      !route?.distanceMeters ||
      !route.durationMillis
    ) {
      return <div className="h-5" />
    }
  
    const durationMinutes = Math.round(
      route.durationMillis / 60000,
    )
  
    const distanceMiles =
      route.distanceMeters / 1609.344
  
    return (
      <div className="relative z-10 flex h-10 items-center">
        <div className="w-8 shrink-0" />
  
        <div
          className="
            ml-3 flex items-center gap-1.5
            text-xs font-medium
            text-base-content/60
          "
        >
          <Footprints
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={2}
          />
  
          <span>
            {durationMinutes} min ·{' '}
            {distanceMiles.toFixed(1)} mi
          </span>
        </div>
      </div>
    )
  }
  
  export default RouteLeg