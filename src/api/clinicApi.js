import axiosClient from './axiosClient'

export async function getClinic(clinicId) {
  const { data } = await axiosClient.get(`/clinics/${clinicId}/`)
  return data
}

export async function updateClinic(clinicId, payload) {
  const { data } = await axiosClient.patch(`/clinics/${clinicId}/`, payload)
  return data
}
