import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { clearToken, getToken, setToken } from '../../lib/auth';
import { getMe, login as loginRequest, type LoginRequest } from '../../lib/authRepo';
import type { AuthUser } from '../../types/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (request: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setStoredToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const syncFromStorage = () => {
      setStoredToken(getToken());
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('smartpolls-auth-change', syncFromStorage as EventListener);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('smartpolls-auth-change', syncFromStorage as EventListener);
    };
  }, []);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getMe()
      .then((me) => {
        if (requestIdRef.current === currentRequestId) {
          setUser(me);
        }
      })
      .catch(() => {
        if (requestIdRef.current === currentRequestId) {
          clearToken();
          setUser(null);
          setStoredToken(null);
        }
      })
      .finally(() => {
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false);
        }
      });
  }, [token]);

  async function login(request: LoginRequest) {
    const session = await loginRequest(request);
    setToken(session.token);
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  }

  function logout() {
    clearToken();
    setStoredToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token && user),
        isLoading,
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
