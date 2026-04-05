import { useState, useContext, useEffect } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  //  added states (no removal)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FIX: redirect AFTER token updates
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      setError("");

      if (!email || !password) {
        return setError("Please enter email and password");
      }

      setLoading(true);

      const res = await login({ email, password });

      // ONLY set token (no navigate here)
      setToken(res.data.token);

    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl mb-4">Login</h2>

        {/*  error display */}
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;