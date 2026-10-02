import {
    Clock3,
    ExternalLink,
    MapPin,
  } from 'lucide-react'
  
  import type { Activity } from '../models/itinerary'
  
  interface ActivityCardProps {
    activity: Activity
    index: number
    color: string
    onActivitySelect: (activity: Activity | null) => void
  }
  
  function ActivityCard({
    activity,
    index,
    color,
    onActivitySelect,
  }: ActivityCardProps) {
    return (
      <div className="relative z-10 flex items-start">
{/* Pin */}
<div className="relative z-20 flex w-10 shrink-0 justify-center">
  <div className="relative mt-1 h-10 w-10 translate-x-[-3px]">
    <MapPin
      className="absolute inset-0 h-10 w-10"
      style={{
        fill: color,
        color: color,
      }}
      strokeWidth={1.5}
    />

    <span className="absolute left-1/2 top-[44%] z-30 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
      {index + 1}
    </span>
  </div>
</div>
  
        {/* Card overlaps timeline/pin */}
        <div className="-ml-6 min-w-0 flex-1">
          <div
            onClick={() => onActivitySelect(activity)}
            className="
            relative z-10 cursor-pointer
            rounded-lg
            border border-base-content/10
            bg-base-200
            py-3 pl-8 pr-4
            transition-colors duration-150
            hover:bg-base-300
          "
          >
            <h3 className="text-[15px] font-semibold leading-5">
              {activity.name}
            </h3>
  
            {activity.notes && (
              <p className="mt-1 text-[13px] leading-[1.45] text-base-content/65">
                {activity.notes}
              </p>
            )}
  
            {(activity.time || activity.mapsUrl) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {activity.time && (
                  <span className="badge badge-soft badge-primary badge-sm gap-1">
                    <Clock3 className="h-3 w-3" />
                    {activity.time}
                  </span>
                )}
  
                {activity.mapsUrl && (
                  <a
                    href={activity.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View on map
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export default ActivityCard