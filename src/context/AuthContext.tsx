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

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};