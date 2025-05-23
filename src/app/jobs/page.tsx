"use client";
import useSWR from "swr";
import { useProfile } from "@/hooks/useProfile";
import { fetcher } from "../lib/fetcher";
import { useState, useEffect } from "react";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";

type Job = {
  job_id: string;
  job_title: string;
  employer_name: string;
};

export default function JobsPage() {
  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const { profile, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    if (profile?.desiredJobTitle && !query && !search) {
      setQuery(profile.desiredJobTitle);
    }
  }, [profile, query, search]);

  const { data, error, isLoading } = useSWR(
    query
      ? `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
          query
        )}&page=1`
      : null,
    fetcher
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6 font-bold text-center">
        {query ? `Jobs for "${query}"` : "Job search"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 max-w-xl mx-auto mb-8"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded p-2 text-white flex-1 bg-gray-600"
          placeholder="e.g. frontend developer"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-700"
        >
          Search
        </button>
      </form>

      {!profile?.desiredJobTitle && !query && !search && (
        <p className="text-center text-yellow-400 mb-6">
          Fill in your profile to get recommended jobs.
        </p>
      )}

      {profileLoading || isLoading ? (
        <p className="text-center text-gray-400">Loading jobs...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error loading jobs.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {data?.data?.map((job: Job) => (
            <div key={job.job_id} className="p-4 bg-gray-800 rounded shadow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{job.job_title}</h2>
                <LikeButton id={job.job_id} />
              </div>
              <p className="text-sm text-gray-400 mb-2">
                {job.employer_name}
              </p>
              <Link href={`/jobs/${job.job_id}`}> 
                <button className="mt-2 text-sm text-blue-400 hover:underline">
                  Learn more
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
