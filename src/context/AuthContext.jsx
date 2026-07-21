import { createContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../api/firebase'
import { loginWithFirebase, logoutFromFirebase, fetchMyProfile } from '../api/authApi'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [staff,     setStaff]     = useState(null)
  const [loading,   setLoading]   = useState(true)

  // On mount, check if Firebase still has an active session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await fetchMyProfile()
          setStaff(profile)
        } catch {
          setStaff(null)
        }
      } else {
        setStaff(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email, password) => {
    const profile = await loginWithFirebase(email, password)
    setStaff(profile)
    return profile
  }

  const logout = async () => {
    await logoutFromFirebase()
    setStaff(null)
  }

  return (
    <AuthContext.Provider value={{
      staff,
      loading,
      login,
      logout,
      isAdmin: staff?.is_administrator ?? false,
      clinicId: staff?.clinic?.clinic_id ?? null,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
