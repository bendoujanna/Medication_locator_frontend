import axiosClient from './axiosClient'

export async function createHoldRequest({ inventoryId, patientContact }) {
  const { data } = await axiosClient.post('/hold-requests/', {
    inventory_id:     inventoryId,
    patient_contact:  patientContact,
  })
  return data
}

export async function getHoldRequestStatus(requestId) {
  const { data } = await axiosClient.get(`/hold-requests/${requestId}/`)
  return data
}

export async function cancelHoldRequest(requestId) {
  await axiosClient.delete(`/hold-requests/${requestId}/`)
}

// Clinic dashboard — inbox
export async function getClinicHoldRequests(clinicId, statusFilter) {
  const params = statusFilter ? { status: statusFilter } : {}
  const { data } = await axiosClient.get(`/clinics/${clinicId}/hold-requests/`, { params })
  return data
}

export async function processHoldRequest(clinicId, requestId, action) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/hold-requests/${requestId}/`,
    { action }
  )
  return data
}
