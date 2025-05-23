'use client'
import useSWR from 'swr'
import { auth, db } from '@/app/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export type UserProfile = {
  name: string
  desiredJobTitle?: string
  about?: string
}

const fetchProfile = async (): Promise<UserProfile | null> => {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const snap = await getDoc(
    doc(db, 'users', user.uid)
  )

  return snap.exists() ? (snap.data() as UserProfile) : null
}

export function useProfile() {
  const user = auth.currentUser
  const { data, error, isValidating } = useSWR<UserProfile | null>(
    user ? ['profile', user.uid] : null,
    fetchProfile
  )

  return {
    profile: data,
    isLoading: !error && (isValidating || data === undefined),
    error,
  }
}
