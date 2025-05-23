import Link from 'next/link'
import { fetcher } from '@/app/lib/fetcher'

async function getJobDetails(id: string) {
  const url = `https://jsearch.p.rapidapi.com/job-details?job_id=${id}`
  const data = await fetcher(url)
  return data?.data?.[0]
}

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await getJobDetails(params.id)

  if (!job) {
    return <p className="text-center text-red-400">Job not found</p>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Link
        className="inline-block mb-4 text-sm text-white hover:underline"
        href="/jobs"
      >
        Go back
      </Link>
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2 text-center">{job.job_title}</h1>
        <p className="text-gray-400 mb-4 text-right">{job.employer_name}</p>
        <p className="whitespace-pre-line text-sm mb-6">
          {job.job_description || "No description provided"}
        </p>
        <a
          href={job.job_apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Apply now
        </a>
      </div>
    </div>
  )
}

