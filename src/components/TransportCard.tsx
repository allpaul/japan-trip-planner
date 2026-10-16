
import {
    Check,
    Clock3,
    Hash,
    Info,
    Ticket,
    TrainFront,
    Armchair,
  } from 'lucide-react'
  
  import type { Transport } from '../models/itinerary'
  
  interface TransportCardProps {
    transport: Transport
  }
  
  function getDuration(
    departure?: string,
    arrival?: string,
  ): string | null {
    if (!departure || !arrival) return null
  
    const parseTime = (value: string): number | null => {
      const match = value.trim().match(
        /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i,
      )
  
      if (!match) return null
  
      let hours = Number(match[1])
      const minutes = Number(match[2])
      const period = match[3]?.toUpperCase()
  
      if (minutes > 59 || hours > 23) return null
  
      if (period) {
        if (hours < 1 || hours > 12) return null
        hours = (hours % 12) + (period === 'PM' ? 12 : 0)
      }
  
      return hours * 60 + minutes
    }
  
    const start = parseTime(departure)
    const end = parseTime(arrival)
  
    if (start === null || end === null) return null
  
    const totalMinutes = (end - start + 1440) % 1440
  
    if (totalMinutes === 0) return null
  
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
  
    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
  
    return `${hours}h ${minutes}m`
  }
  
  function TransportCard({ transport }: TransportCardProps) {
    const duration = getDuration(
      transport.departureTime,
      transport.arrivalTime,
    )
  
    const statusStyles = {
      booked: {
        label: 'Booked',
        className: 'bg-success/15 text-success',
        icon: Check,
      },
      'to-book': {
        label: 'To book',
        className: 'bg-warning/20 text-amber-800',
        icon: Clock3,
      },
      pass: {
        label: 'Using pass',
        className: 'bg-info/15 text-info',
        icon: Ticket,
      },
    }
  
    const status = transport.status
      ? statusStyles[transport.status]
      : null
  
    const StatusIcon = status?.icon
  
    const hasDetails = Boolean(
      transport.ticketMethod ||
      transport.seat ||
      transport.bookingReference ||
      transport.notes,
    )
  
    return (
        <div className="ml-9 md:ml-[52px] my-3 min-w-0 rounded-xl border border-base-300 bg-base-100 p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <TrainFront className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
  
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug text-base-content">
                {transport.name ?? 'Train journey'}
              </h3>
  
              {status && (
                <span
                  className={`badge badge-sm gap-1 border-0 font-medium ${status.className}`}
                >
                  {StatusIcon && (
                    <StatusIcon className="h-3 w-3" />
                  )}
                  {status.label}
                </span>
              )}
            </div>
  
            {transport.service && (
              <p className="mt-1 text-xs text-base-content/60">
                {transport.service}
              </p>
            )}
          </div>
        </div>
  
        {/* Journey */}
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(56px,0.7fr)_minmax(0,1fr)] items-center gap-2">
          {/* Departure */}
          <div className="min-w-0">
            <div className="text-xl font-bold tabular-nums text-base-content">
              {transport.departureTime ?? (
                <span className="text-sm font-medium text-base-content/50">
                  TBC
                </span>
              )}
            </div>
  
            <div className="mt-1 break-words text-sm font-medium leading-snug text-base-content">
              {transport.from}
            </div>
          </div>
  
          {/* Journey line */}
          <div className="flex min-w-0 flex-col items-center gap-1.5">
            <span className="whitespace-nowrap text-[12px] font-medium text-base-content/60">
              {duration ?? ' '}
            </span>
  
            <div className="flex w-full items-center gap-1">
              <span className="h-px min-w-0 flex-1 bg-base-content/25" />
  
              <TrainFront className="h-4 w-4 shrink-0 text-base-content/50" />
  
              <span className="h-px min-w-0 flex-1 bg-base-content/25" />
            </div>
  
            <span className="text-[1px] text-base-content/50">
              {duration ? 'Direct' : ' '}
            </span>
          </div>
  
          {/* Arrival */}
          <div className="min-w-0 text-right">
            <div className="text-xl font-bold tabular-nums text-base-content">
              {transport.arrivalTime ?? (
                <span className="text-sm font-medium text-base-content/50">
                  TBC
                </span>
              )}
            </div>
  
            <div className="mt-1 break-words text-sm font-medium leading-snug text-base-content">
              {transport.to}
            </div>
          </div>
        </div>
  
        {/* Ticket details */}
        {hasDetails && (
          <div className="mt-4 space-y-2 border-t border-base-300 pt-3 text-sm text-base-content/70">
            {transport.ticketMethod && (
              <div className="flex items-start gap-2">
                <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-base-content/50" />
  
                <span>{transport.ticketMethod}</span>
              </div>
            )}
  
            {transport.seat && (
              <div className="flex items-start gap-2">
                <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-base-content/50" />
  
                <span>{transport.seat}</span>
              </div>
            )}
  
            {transport.bookingReference && (
              <div className="flex items-start gap-2">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-base-content/50" />
  
                <span>
                  Booking: {transport.bookingReference}
                </span>
              </div>
            )}
  
            {transport.notes && (
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-base-content/50" />
  
                <span className="leading-relaxed">
                  {transport.notes}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  
  export default TransportCard
  