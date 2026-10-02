import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MapPin,
    Star,
    X,
  } from 'lucide-react'
  
  import usePlacePhoto from '../hooks/usePlacePhoto'
  
  import type {
    ResolvedPlace,
    SelectablePlace,
  } from '../models/itinerary'
  
  interface PlaceDetailsProps {
    activity: SelectablePlace
    place?: ResolvedPlace
    onClose: () => void
    navigation?: {
      current: number
      total: number
      onPrevious?: () => void
      onNext?: () => void
    }
  }
  
  function PlaceDetails({
    activity,
    place,
    onClose,
    navigation,
  }: PlaceDetailsProps) {
    const photo = usePlacePhoto(
      activity.googlePlaceId,
    )
  
    if (!place) {
      return null
    }
  
    return (
      <div
        className="
          absolute bottom-4 left-4 right-4 z-10
          max-h-[55%] overflow-y-auto
          rounded-3xl bg-base-100
        "
      >
        {photo && (
          <div className="relative">
            <img
              src={photo.url}
              alt={
                place.displayName ??
                activity.name
              }
              className="
                h-40 w-full
                rounded-t-3xl
                object-cover
              "
            />
  
            {photo.attribution && (
              <div
                className="
                  absolute bottom-2 right-2
                  rounded bg-base-100
                  px-2 py-1
                  text-[10px]
                  text-base-content/70
                "
              >
                Photo by{' '}
                {photo.attribution.uri ? (
                  <a
                    href={
                      photo.attribution.uri
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      underline
                      hover:text-base-content
                    "
                  >
                    {
                      photo.attribution
                        .displayName
                    }
                  </a>
                ) : (
                  photo.attribution
                    .displayName
                )}
              </div>
            )}
          </div>
        )}
  
        <div className="relative p-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close place details"
            className="
              btn btn-circle btn-ghost btn-sm
              absolute right-3 top-3
              cursor-pointer
            "
          >
            <X className="h-4 w-4" />
          </button>
  
          <div className="pr-10">
            <h3 className="text-xl font-bold">
              {place.displayName ??
                activity.name}
            </h3>
  
            {place.rating != null && (
              <div className="mt-2 flex items-center gap-1.5 text-sm">
                <Star
                  className="h-4 w-4 fill-current"
                  strokeWidth={1.5}
                />
  
                <span className="font-semibold">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
  
          {place.editorialSummary && (
            <p className="mt-3 text-sm leading-6 text-base-content/70">
              {place.editorialSummary}
            </p>
          )}
  
          {place.formattedAddress && (
            <div className="mt-3 flex items-start gap-2 text-sm text-base-content/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
  
              <span>
                {place.formattedAddress}
              </span>
            </div>
          )}
  
          {(place.googleMapsURI ||
            navigation) && (
            <div className="mt-4 flex items-center justify-between gap-3">
              {place.googleMapsURI && (
                <a
                  href={
                    place.googleMapsURI
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="
                    btn btn-primary btn-sm
                    cursor-pointer
                  "
                >
                  Open in Google Maps
  
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
  
              {navigation && (
                <div className="ml-auto flex items-center">
                  <button
                    type="button"
                    disabled={
                      !navigation.onPrevious
                    }
                    onClick={
                      navigation.onPrevious
                    }
                    className="
                      flex h-9 w-9
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      hover:bg-base-200
                      disabled:cursor-default
                      disabled:opacity-25
                    "
                    aria-label="Previous place"
                  >
                    <ChevronLeft
                      className="h-5 w-5"
                      strokeWidth={2.5}
                    />
                  </button>
  
                  <span className="min-w-14 text-center text-sm font-bold">
                    {navigation.current}{' '}
                    of {navigation.total}
                  </span>
  
                  <button
                    type="button"
                    disabled={
                      !navigation.onNext
                    }
                    onClick={
                      navigation.onNext
                    }
                    className="
                      flex h-9 w-9
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-full
                      hover:bg-base-200
                      disabled:cursor-default
                      disabled:opacity-25
                    "
                    aria-label="Next place"
                  >
                    <ChevronRight
                      className="h-5 w-5"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  export default PlaceDetails