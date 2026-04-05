import { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown state
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        console.log("PROFILE DATA:", res.data);

        setUser(res.data.user);
        setApplications(res.data.applications);
      })
      .catch((err) => {
        console.error("PROFILE ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* USER INFO */}
      {user && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-2">User Info</h2>

          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {/* DROPDOWN HEADER */}
      <div
        className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">
          Applied Jobs ({applications.length})
        </h3>

        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* DROPDOWN CONTENT */}
      {isOpen && (
        <div className="bg-gray-50 rounded shadow p-4 space-y-3">

          {applications.length === 0 && (
            <p className="text-gray-400">No applications yet</p>
          )}

          {applications.map((app: any) => (
            <div
              key={app._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              {/* LEFT SIDE */}
              <div>
                <p className="font-medium">
                  {app.job?.title || "Unknown Job"}
                </p>

                {/*  Company + Location */}
                <p className="text-sm text-gray-500">
                  {app.job?.company || "N/A"} • {app.job?.location || "N/A"}
                </p>

                {/* Applied Date */}
                <p className="text-xs text-gray-400 mt-1">
                  Applied on:{" "}
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* RIGHT SIDE - STATUS */}
              <span
                className={`px-3 py-1 text-sm rounded ${
                  app.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : app.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;