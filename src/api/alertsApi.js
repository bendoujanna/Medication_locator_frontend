import axiosClient from './axiosClient'

export async function getAlerts(clinicId, params = {}) {
  const { data } = await axiosClient.get(`/clinics/${clinicId}/alerts/`, { params })
  return data
}

export async function resolveAlert(clinicId, alertId) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/alerts/${alertId}/resolve/`,
    {}
  )
  return data
}
