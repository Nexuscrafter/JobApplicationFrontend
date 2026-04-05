import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // decode role from token
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer tracking-tight"
        >
          JobPortal
        </h1>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base">

          {/* NOT LOGGED IN */}
          {!token && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition shadow-sm"
              >
                Register
              </button>
            </>
          )}

          {/* LOGGED IN */}
          {token && (
            <>
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Jobs
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Profile
              </button>

              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-gray-600 hover:text-blue-600 transition hidden sm:block"
                >
                  Admin Panel
                </button>
              )}

              {role === "admin" && (
                <button
                  onClick={() => navigate("/create-job")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition shadow-sm"
                >
                  + Create Job
                </button>
              )}

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;