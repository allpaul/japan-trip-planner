import type { Day } from '../models/itinerary'

interface MobileDayNavProps {
  days: Day[]
  selectedDayId: string
  onDaySelect: (dayId: string) => void
}

function MobileDayNav({
  days,
  selectedDayId,
  onDaySelect,
}: MobileDayNavProps) {
  return (
    <div className="flex overflow-x-auto border-b border-base-300 bg-base-100 lg:hidden">
      {days.map((day) => {
        const date = new Date(`${day.date}T00:00:00`)
        const selected = day.id === selectedDayId

        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onDaySelect(day.id)}
            className={`
              shrink-0 border-b-2 px-4 py-3 text-center cursor-pointer
              ${selected
                ? 'border-primary text-base-content'
                : 'border-transparent text-base-content/60'
              }
            `}
          >
            <div className="text-[11px] font-semibold uppercase">
              {date.toLocaleDateString('en-NZ', {
                month: 'short',
              })}
            </div>

            <div className="text-lg font-bold leading-5">
              {date.getDate()}
            </div>

            <div className="mt-0.5 text-[11px]">
              {date.toLocaleDateString('en-NZ', {
                weekday: 'short',
              })}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default MobileDayNav