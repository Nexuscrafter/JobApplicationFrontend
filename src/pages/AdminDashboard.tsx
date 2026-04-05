import { useEffect, useState } from "react";
import { getApplications, updateStatus } from "../api/adminApi";

const AdminDashboard = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");

  useEffect(() => {
    setLoading(true);

    getApplications()
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  const update = async (id: string, status: string) => {
    try {
      setRemovingIds((prev) => [...prev, id]);

      await updateStatus(id, status);

      setTimeout(() => {
        setApps((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status } : app
          )
        );

        setRemovingIds((prev) =>
          prev.filter((rid) => rid !== id)
        );
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const getBadge = (status: string) => {
    const base = "px-2 py-1 text-xs rounded-full font-medium";

    if (status === "accepted")
      return `${base} bg-green-100 text-green-700`;
    if (status === "rejected")
      return `${base} bg-red-100 text-red-700`;

    return `${base} bg-yellow-100 text-yellow-700`;
  };

  // Pending
  const pendingApps = apps.filter(
    (app) => !app.status || app.status === "pending"
  );

  // Filtered History
  const historyApps = apps.filter((app) => {
    if (!app.status || app.status === "pending") return false;

    if (historyFilter === "accepted")
      return app.status === "accepted";

    if (historyFilter === "rejected")
      return app.status === "rejected";

    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h2>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 text-center animate-pulse">
          Loading applications...
        </p>
      )}

      
      {/* PENDING */}
      
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Pending Applications
      </h3>

      {pendingApps.length === 0 && (
        <p className="text-gray-400 mb-6">
          No pending applications
        </p>
      )}

      <div className="grid gap-4 mb-8">
        {pendingApps.map((app: any) => {
          const isRemoving = removingIds.includes(app._id);

          return (
            <div
              key={app._id}
              className={`bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center transition-all duration-300
              ${isRemoving ? "opacity-0 scale-95" : "hover:shadow-md"}
              `}
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {app.user.email}
                </p>

                {/*  JOB + COMPANY */}
                <div className="text-gray-600 text-sm">
                  <p>
                    Job:{" "}
                    <span className="font-medium">
                      {app.job?.title}
                    </span>
                  </p>

                  <p>
                    Company:{" "}
                    <span className="font-medium text-gray-700">
                      {app.job?.company || "Unknown"}
                    </span>
                  </p>
                </div>

                <span className={getBadge(app.status || "pending")}>
                  {app.status || "pending"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => update(app._id, "accepted")}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Accept
                </button>

                <button
                  onClick={() => update(app._id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      
      {/* HISTORY */}
  
      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-600 font-medium mb-4"
        >
          {showHistory ? "Hide History ▲" : "Show History ▼"}
        </button>

        {showHistory && (
          <>
            {/* FILTER */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setHistoryFilter("all")}
                className={`px-3 py-1 rounded ${
                  historyFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setHistoryFilter("accepted")}
                className={`px-3 py-1 rounded ${
                  historyFilter === "accepted"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Accepted
              </button>

              <button
                onClick={() => setHistoryFilter("rejected")}
                className={`px-3 py-1 rounded ${
                  historyFilter === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Rejected
              </button>
            </div>

            {/* EMPTY */}
            {historyApps.length === 0 && (
              <p className="text-gray-400">
                No applications found
              </p>
            )}

            {/* HISTORY LIST */}
            <div className="grid gap-4">
              {historyApps.map((app: any) => (
                <div
                  key={app._id}
                  className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center opacity-80"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      {app.user.email}
                    </p>

                    {/* JOB + COMPANY */}
                    <p className="text-gray-600 text-sm">
                      {app.job?.title} •{" "}
                      {app.job?.company || "Unknown"}
                    </p>

                    <span className={getBadge(app.status)}>
                      {app.status}
                    </span>
                  </div>

                  {/* DISABLED */}
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="bg-green-300 text-white px-3 py-1 rounded cursor-not-allowed"
                    >
                      Accept
                    </button>

                    <button
                      disabled
                      className="bg-red-300 text-white px-3 py-1 rounded cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;