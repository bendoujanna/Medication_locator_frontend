import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getStaff, updateStaffStatus, updateStaffRole } from '../../../api/staffApi'
import { useToast } from '../../../hooks/useToast'
import Card from '../../../components/ui/Card'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import AddStaffModal from '../AddStaffModal'
import { STAFF_ROLE_LABEL } from '../../../utils/constants'

export default function StaffAccountsCard() {
  const { clinicId }  = useAuth()
  const { showToast } = useToast()
  const [staff,    setStaff]    = useState([])
  const [showAdd,  setShowAdd]  = useState(false)

  const load = useCallback(async () => {
    if (!clinicId) return
    getStaff(clinicId).then(d => setStaff(d.results)).catch(() => {})
  }, [clinicId])

  useEffect(() => { load() }, [load])

  const toggleActive = async (member) => {
    try {
      await updateStaffStatus(clinicId, member.staff_id, !member.is_active)
      showToast(`${member.username} ${member.is_active ? 'deactivated' : 'reactivated'}.`)
      load()
    } catch (e) {
      showToast(e.response?.data?.error?.message || 'Update failed', 'error')
    }
  }

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold font-sans text-black">Staff Accounts</h2>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>+ Add staff member</Button>
      </div>
      <div className="h-px bg-border mb-4"/>

      <div className="flex flex-col divide-y divide-border">
        {staff.map((member, i) => (
          <div key={member.staff_id} className={`flex items-center gap-3 py-3.5 ${!member.is_active ? 'opacity-55' : ''}`}>
            <Avatar initials={member.initials} size="sm" tone={member.role === 'ADMINISTRATOR' ? 'rose' : 'sage'}/>
            <p className="text-[14px] font-semibold font-sans text-black flex-1">{member.full_name || member.username}</p>
            <span className={`h-6 px-2.5 rounded-pill text-[11px] font-medium font-sans
              ${member.role==='ADMINISTRATOR'
                ? 'bg-rose-tint border border-rose-light text-rose-dark'
                : 'bg-sage-tint border border-sage-light text-sage-dark'}`}>
              {STAFF_ROLE_LABEL[member.role]}
            </span>
            <button onClick={() => toggleActive(member)}
              className={`text-[12px] font-semibold font-sans ${member.is_active ? 'text-status-available' : 'text-status-out'}`}>
              {member.is_active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>

      <AddStaffModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={load}/>
    </Card>
  )
}
