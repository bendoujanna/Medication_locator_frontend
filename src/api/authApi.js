import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'
import axiosClient from './axiosClient'

export async function loginWithFirebase(email, password) {
  await signInWithEmailAndPassword(auth, email, password)
  // After Firebase login, fetch the Django staff profile
  const { data } = await axiosClient.get('/auth/me/')
  return data
}

export async function logoutFromFirebase() {
  await signOut(auth)
}

export async function fetchMyProfile() {
  const { data } = await axiosClient.get('/auth/me/')
  return data
}
