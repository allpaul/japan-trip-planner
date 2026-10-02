import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import type { Day } from '../models/itinerary'

interface SidebarProps {
  days: Day[]
}

function Sidebar({
  days,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] =
    useState(false)

  return (
    <aside
      className={`
        h-screen shrink-0
        border-r border-base-300
        bg-base-200/70
        transition-[width]
        duration-200
        ${
          isCollapsed
            ? 'w-14'
            : 'w-56'
        }
      `}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Fixed header */}
        <div
          className={`
            shrink-0
            border-b border-base-300
            bg-base-200/70
            px-3 py-3
            ${
              isCollapsed
                ? 'flex justify-center'
                : 'flex items-center justify-between'
            }
          `}
        >
          {!isCollapsed && (
            <div>
              <p className="pl-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-base-content/60">
                Japan
              </p>

              <p className="pl-1 mt-0.5 text-sm font-bold text-base-content/85">
                2026
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              setIsCollapsed(
                (current) => !current,
              )
            }
            aria-label={
              isCollapsed
                ? 'Expand trip navigation'
                : 'Collapse trip navigation'
            }
            className="
              btn btn-ghost
              btn-sm btn-square
              text-base-content/65
              hover:text-base-content
            "
          >
            {isCollapsed ? (
              <ChevronRight
                className="h-5 w-5"
                strokeWidth={2}
              />
            ) : (
              <ChevronLeft
                className="h-5 w-5"
                strokeWidth={2}
              />
            )}
          </button>
        </div>

        {/* Only the itinerary list scrolls */}
        <nav className="min-h-0 flex-1 overflow-y-auto">
          <ul>
            {days.map((day) => {
              const date = new Date(
                `${day.date}T00:00:00`,
              )

              const weekday =
                date.toLocaleDateString(
                  'en-NZ',
                  {
                    weekday: 'short',
                  },
                )

              const month =
                date.toLocaleDateString(
                  'en-NZ',
                  {
                    month: 'short',
                  },
                )

              const monthNumber =
                date.getMonth() + 1

              const dayNumber =
                date.getDate()

              /*
               * Collapsed sidebar
               */
              if (isCollapsed) {
                return (
                  <li key={day.id}>
                    <a
                      href={`#${day.id}`}
                      title={`${weekday} ${dayNumber} ${month} — ${
                        day.title ||
                        day.city
                      }`}
                      className="
                        group
                        flex flex-col
                        items-center
                        justify-center
                        border-b
                        border-base-content/10
                        px-1 py-2.5
                        transition-colors
                        hover:bg-base-200
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-bold uppercase
                          tracking-wide
                          text-base-content/55
                          transition-colors
                          group-hover:text-base-content/75
                        "
                      >
                        {month}
                      </span>

                      <span
                        className="
                          mt-0.5
                          text-sm font-semibold
                          leading-none
                          text-base-content/80
                          transition-colors
                          group-hover:text-base-content
                        "
                      >
                        {dayNumber}
                      </span>
                    </a>
                  </li>
                )
              }

              /*
               * Expanded sidebar
               */
              return (
                <li key={day.id}>
                  <a
                    href={`#${day.id}`}
                    className="
                      group block
                      border-b
                      border-base-content/10
                      px-4 py-3
                      transition-colors
                      hover:bg-base-200
                    "
                  >
                    <p
                      className="
                        text-xs font-medium
                        text-base-content/60
                        transition-colors
                        group-hover:text-base-content/75
                      "
                    >
                      {weekday}{' '}
                      {monthNumber}/
                      {dayNumber}
                    </p>

                    <p
                      className="
                        mt-1 truncate
                        text-[13px]
                        font-semibold
                        leading-5
                        text-base-content/85
                        transition-colors
                        group-hover:text-base-content
                      "
                    >
                      {day.title ||
                        day.city}
                    </p>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar