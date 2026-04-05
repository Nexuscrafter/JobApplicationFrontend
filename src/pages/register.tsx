import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      if (!email || !password) {
        return setError("All fields are required");
      }

      if (password.length < 6) {
        return setError("Password must be at least 6 characters");
      }

      setLoading(true);

      const res = await register({ email, password });

      // auto login after register
      setToken(res.data.token);

      navigate("/");

    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>

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
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {/*  Switch to login */}
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;