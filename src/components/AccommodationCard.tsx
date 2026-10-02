import { BedDouble } from 'lucide-react'

import type { Accommodation } from '../models/itinerary'

interface AccommodationCardProps {
    accommodation: Accommodation
    action?: 'Check in' | 'Check out'
    onAccommodationSelect?: (
      accommodation: Accommodation,
    ) => void
  }

  function AccommodationCard({
    accommodation,
    action,
    onAccommodationSelect,
  }: AccommodationCardProps) {
    return (
        <div className="relative flex items-center">
            
            <div
                className="
                absolute left-0 z-20
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-pink-100
                text-pink-600
                "
            >
                <BedDouble
                    className="h-[18px] w-[18px]"
                    strokeWidth={2.25}
                />
            </div>

            <div
  onClick={() =>
    onAccommodationSelect?.(accommodation)
  }
  className="
    ml-4 flex min-h-12
    min-w-0 flex-1
    cursor-pointer
    items-center
    justify-between gap-4
    rounded-lg
    bg-base-300/90
    px-4 py-2
    pl-8
    transition-colors
    hover:bg-gray-200
  "
>
                <p
                    className="
            min-w-0
            text-[14px]
            font-medium
          "
                >
                    {accommodation.name}
                </p>

                {action && (
                    <span
                        className="
              shrink-0
              text-[10px]
              font-semibold
              text-base-content/60
            "
                    >
                        {action}
                    </span>
                )}
            </div>
        </div>
    )
}

export default AccommodationCard