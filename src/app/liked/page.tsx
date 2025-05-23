"use client"

import { useLikedJobs } from "@/hooks/useLikedJobs"
import { fetcher } from '@/app/lib/fetcher'
import Link from "next/link"
import LikeButton from "@/components/LikeButton"
import { useEffect, useState } from "react"

type Job = {
  job_id: string
  job_title: string
  employer_name: string
}

export default function LikedPage() {
  const { liked } = useLikedJobs()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          liked.map(id =>
            fetcher(`https://jsearch.p.rapidapi.com/job-details?job_id=${id}`)
          )
        )
        const allJobs = results.flatMap(r => r.data ?? []) as Job[]
        setJobs(allJobs)
      } catch (err: unknown) {
        console.error('Failed to fetch jobs', err)
      } finally {
        setLoading(false)
      }
    }

    if (liked.length > 0) {
      fetchJobs()
    } else {
      setJobs([])
      setLoading(false)
    }
  }, [liked])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6 text-center font-bold">Liked Jobs</h1>
      {loading && (
        <p className="text-center text-gray-400">Loading your jobs...</p>
      )}
      {!loading && jobs.length === 0 && (
        <p className="text-2xl text-red-500 text-center">
          You haven&apos;t liked anything yet
        </p>
      )}

      <div className="grid gap-4 max-w-3xl mx-auto">
        {jobs.map(job => (
          <div key={job.job_id} className="p-4 bg-gray-800 rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{job.job_title}</h2>
              <LikeButton id={job.job_id} />
            </div>
            <p className="text-sm text-gray-400">{job.employer_name}</p>
            <Link href={`/jobs/${job.job_id}`}>  
              <span className="text-white text-sm hover:underline">
                Learn more
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
