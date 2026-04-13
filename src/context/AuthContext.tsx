import { createContext, useState, useEffect } from "react";

interface AuthType {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthType>({
  token: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // sync token with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
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
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};