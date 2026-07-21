import axiosClient from './axiosClient'

export async function searchMedications({ query, lat, lng, radiusKm = 10, limit = 10 }) {
  const { data } = await axiosClient.get('/search/', {
    params: { q: query, lat, lng, radius_km: radiusKm, limit },
  })
  return data
}

export async function searchSubstitutes({ ingredientId, lat, lng, excludeMedicationId, radiusKm = 10 }) {
  const { data } = await axiosClient.get('/search/substitutes/', {
    params: {
      ingredient_id:          ingredientId,
      lat, lng,
      radius_km:              radiusKm,
      exclude_medication_id:  excludeMedicationId,
    },
  })
  return data
}

export async function getMapPins({ query, lat, lng, radiusKm = 10 }) {
  const { data } = await axiosClient.get('/search/map-pins/', {
    params: { q: query, lat, lng, radius_km: radiusKm },
  })
  return data
}

export async function getTransitTime({ fromLat, fromLng, toLat, toLng, mode = 'driving' }) {
  const { data } = await axiosClient.get('/routing/transit-time/', {
    params: { from_lat: fromLat, from_lng: fromLng, to_lat: toLat, to_lng: toLng, mode },
  })
  return data
}
