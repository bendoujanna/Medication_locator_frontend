import axiosClient from './axiosClient'

export async function getInventory(clinicId, params = {}) {
  const { data } = await axiosClient.get(`/clinics/${clinicId}/inventory/`, { params })
  return data
}

export async function addInventory(clinicId, payload) {
  const { data } = await axiosClient.post(`/clinics/${clinicId}/inventory/`, payload)
  return data
}

export async function updateInventory(clinicId, inventoryId, payload) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/inventory/${inventoryId}/`,
    payload
  )
  return data
}

export async function updateThreshold(clinicId, inventoryId, threshold) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/inventory/${inventoryId}/threshold/`,
    { low_stock_threshold: threshold }
  )
  return data
}

export async function deleteInventory(clinicId, inventoryId) {
  await axiosClient.delete(`/clinics/${clinicId}/inventory/${inventoryId}/`)
}
