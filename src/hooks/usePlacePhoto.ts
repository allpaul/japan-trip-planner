import {
    useEffect,
    useState,
  } from 'react'
  
  import {
    useMapsLibrary,
  } from '@vis.gl/react-google-maps'
  
  interface PlacePhoto {
    url: string
    attribution?: {
      displayName: string
      uri?: string
    }
  }
  
  function usePlacePhoto(
    googlePlaceId?: string,
  ) {
    const placesLibrary =
      useMapsLibrary('places')
  
    const [photo, setPhoto] =
      useState<PlacePhoto | null>(null)
  
    useEffect(() => {
      setPhoto(null)
  
      if (
        !placesLibrary ||
        !googlePlaceId
      ) {
        return
      }
  
      let cancelled = false
  
      async function loadPhoto() {
        try {
          const place =
            new placesLibrary!.Place({
              id: googlePlaceId!,
            })
  
          await place.fetchFields({
            fields: ['photos'],
          })
  
          const firstPhoto =
            place.photos?.[0]
  
          if (!firstPhoto || cancelled) {
            return
          }
  
          const attribution =
            firstPhoto.authorAttributions?.[0]
  
          setPhoto({
            url: firstPhoto.getURI({
              maxWidth: 800,
            }),
  
            attribution: attribution
              ? {
                  displayName:
                    attribution.displayName,
                  uri:
                    attribution.uri ??
                    undefined,
                }
              : undefined,
          })
        } catch (error) {
          console.error(
            'Unable to load place photo:',
            error,
          )
        }
      }
  
      loadPhoto()
  
      return () => {
        cancelled = true
      }
    }, [placesLibrary, googlePlaceId])
  
    return photo
  }
  
  export default usePlacePhoto