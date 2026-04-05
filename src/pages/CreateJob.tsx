import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreateJob = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");

      //  basic validation
      if (!title || !company || !skills || !location) {
        return setError("All fields are required");
      }

      setLoading(true);

      //  convert skills string → array
      const skillsArray = skills.split(",").map((s) => s.trim());

      await API.post("/jobs", {
        title,
        company,
        skills: skillsArray,
        location,
      });

      // success → go back to home
      navigate("/");

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Create Job</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <input
          placeholder="Job Title"
          className="border p-2 w-full mb-2"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Company"
          className="border p-2 w-full mb-2"
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          placeholder="Skills (comma separated)"
          className="border p-2 w-full mb-2"
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          placeholder="Location"
          className="border p-2 w-full mb-4"
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Job"}
        </button>
      </div>
    </div>
  );
};

export default CreateJob;