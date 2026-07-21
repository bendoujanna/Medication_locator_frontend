import axiosClient from './axiosClient'

export async function getStaff(clinicId) {
  const { data } = await axiosClient.get(`/clinics/${clinicId}/staff/`)
  return data
}

export async function createStaff(clinicId, payload) {
  const { data } = await axiosClient.post(`/clinics/${clinicId}/staff/`, payload)
  return data
}

export async function updateStaffStatus(clinicId, staffId, isActive) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/staff/${staffId}/status/`,
    { is_active: isActive }
  )
  return data
}

export async function updateStaffRole(clinicId, staffId, role) {
  const { data } = await axiosClient.patch(
    `/clinics/${clinicId}/staff/${staffId}/`,
    { role }
  )
  return data
}
