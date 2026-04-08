"use client";

import { signOut as cognitoSignOut, getSession } from "@/lib/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  signOut: () => {},
  refreshAuth: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((session) =>
        setIsAuthenticated(session !== null && session.isValid()),
      )
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRefreshAuth = useCallback(async () => {
    const session = await getSession().catch(() => null);
    setIsAuthenticated(session !== null && session.isValid());
  }, []);

  const handleSignOut = useCallback(() => {
    cognitoSignOut();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext value={{ isAuthenticated, isLoading, signOut: handleSignOut, refreshAuth: handleRefreshAuth }}>
      {children}
    </AuthContext>
  );
}
