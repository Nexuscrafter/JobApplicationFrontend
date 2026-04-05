import { deleteJob } from "../api/jobApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const JobCard = ({ job, isApplied, onApply, onDelete }: any) => {
  const { token } = useContext(AuthContext);

  // decode role
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {}
  }

  const handleDelete = async () => {
    try {
      await deleteJob(job._id);
      onDelete(job._id); // update UI
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500 mb-2">{job.location}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {job.skills?.map((skill: string, i: number) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        {/* Apply */}
        <button
          onClick={() => onApply(job._id)}
          disabled={isApplied}
          className={`flex-1 py-2 rounded text-white transition
            ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>

        {/* DELETE (ADMIN ONLY) */}
        {role === "admin" && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;