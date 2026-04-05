import { useEffect, useState } from "react";
import { getJobs, applyJob } from "../api/jobApi";
import { getProfile } from "../api/userApi";
import JobCard from "../components/JobCard";

const Home = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");

  const [loading, setLoading] = useState(false);

  // FETCH JOBS
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      try {
        const res = await getJobs({
          page,
          limit: 6,
          search: search || undefined,
          skill: skill || undefined,
        });

        setJobs(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, search, skill]);

  // FETCH APPLIED JOBS
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await getProfile();

        const jobIds = res.data.applications
          .map((app: any) => app.job?._id)
          .filter(Boolean);

        setAppliedJobs(jobIds);
      } catch (err) {
        console.error("Error fetching applied jobs", err);
      }
    };

    fetchAppliedJobs();
  }, []);

  //  APPLY JOB
  const handleApply = async (jobId: string) => {
    try {
      await applyJob(jobId);

      // update UI instantly
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (err) {
      console.error("Apply failed", err);
    }
  };

  //  DELETE JOB (ADMIN)
  const handleDelete = (jobId: string) => {
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search by title or company..."
          className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <input
          placeholder="Filter by skill (React, Node...)"
          className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400"
          value={skill}
          onChange={(e) => {
            setPage(1);
            setSkill(e.target.value);
          }}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500 mb-4 animate-pulse">
          Loading jobs...
        </div>
      )}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-400 text-lg">
          No jobs found
        </div>
      )}

      {/* JOB GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job: any) => (
          <JobCard
            key={job._id}
            job={job}
            isApplied={appliedJobs.includes(job._id)}
            onApply={handleApply}
            onDelete={handleDelete} // ✅ NEW
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-10 gap-4 items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;