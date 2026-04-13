import { createContext, useState, useEffect } from "react";

interface AuthType {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthType>({
  token: null,
  role: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState<string | null>(null);

  // sync token with localStorage + extract role
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role || null); 
      } catch {
        setRole(null);
      }
    } else {
      localStorage.removeItem("token");
      setRole(null);
    }
  }, [token]);

  // listen to interceptor-triggered changes
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};