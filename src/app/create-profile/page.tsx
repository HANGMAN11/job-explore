'use client'
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/app/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useProfile } from "@/hooks/useProfile"
import Link from "next/link"

export default function CreateProfilePage() {
  const router = useRouter()
  const [uid, setUid] = useState<string | null>(null)
  const { profile, isLoading } = useProfile()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) setUid(user.uid)
      else router.push('/auth/login')
    })
    return unsub
  }, [router])  // added router to deps

  const formik = useFormik({
    initialValues: {
      name: '',
      desiredJobTitle: '',
      about: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      desiredJobTitle: Yup.string().required('Job title is required'),
      about: Yup.string().required('Please tell us about yourself'),
    }),
    onSubmit: async (values) => {
      if (!uid) return
      try {
        await setDoc(doc(db, 'users', uid), values)
        router.push('/jobs')
      } catch (err) {
        alert('Failed to save profile')
        console.error(err)
      }
    },
  })

  useEffect(() => {
    if (profile && !isLoading) {
      formik.setValues({
        name: profile.name || '',
        desiredJobTitle: profile.desiredJobTitle || '',
        about: profile.about || '',
      })
    }
  }, [profile, isLoading, formik])  // added formik to deps

  return (
    <div className="min-h-screen relative bg-gray-900 text-white flex justify-center items-center">
      <Link
        href="/jobs"
        className="absolute top-4 left-4 text-sm text-white hover:underline"
      >
        Go back
      </Link>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-800 p-6 rounded w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Edit your profile</h1>

        <input
          name="name"
          placeholder="Your name"
          value={formik.values.name}
          onChange={formik.handleChange}
          className="p-2 w-full bg-gray-700 rounded"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-400 text-sm">{formik.errors.name}</p>
        )}

        <input
          name="desiredJobTitle"
          placeholder="Desired job title"
          value={formik.values.desiredJobTitle}
          onChange={formik.handleChange}
          className="p-2 w-full bg-gray-700 rounded"
        />
        {formik.touched.desiredJobTitle && formik.errors.desiredJobTitle && (
          <p className="text-red-400 text-sm">{formik.errors.desiredJobTitle}</p>
        )}

        <textarea
          name="about"
          placeholder="Tell us about yourself"
          value={formik.values.about}
          onChange={formik.handleChange}
          className="p-2 w-full h-28 bg-gray-700 rounded"
        />
        {formik.touched.about && formik.errors.about && (
          <p className="text-red-400 text-sm">{formik.errors.about}</p>
        )}

        <button
          type="submit"
          disabled={!formik.isValid}
          className="w-full bg-white text-black p-2 rounded hover:bg-gray-200 transition"
        >
          Save profile
        </button>
      </form>
    </div>
  )
}

