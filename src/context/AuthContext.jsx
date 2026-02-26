import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { usersApi } from "../services/api";

const AuthContext = createContext(null);

const decodeTokenPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const parsed = JSON.parse(atob(payload));
    return parsed;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [currentUser, setCurrentUser] = useState(null);

  const hydrateUserFromToken = useCallback(async (jwtToken) => {
    if (!jwtToken) {
      setCurrentUser(null);
      return;
    }

    const payload = decodeTokenPayload(jwtToken);
    const userId = payload?._id ?? "";

    try {
      const isAdmin = await usersApi.isAdmin();
      setCurrentUser({
        id: userId,
        type: isAdmin ? "admin" : "user",
      });
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      await hydrateUserFromToken(token);
      setIsLoading(false);
    };

    bootstrap();
  }, [token, hydrateUserFromToken]);

  const login = useCallback(
    async (id, password) => {
      const jwtToken = await usersApi.login(id, password);
      localStorage.setItem("authToken", jwtToken);
      setToken(jwtToken);
      await hydrateUserFromToken(jwtToken);
      return jwtToken;
    },
    [hydrateUserFromToken],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setToken(null);
    setCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      currentUser,
      isAuthenticated: Boolean(token),
      isAdmin: currentUser?.type === "admin",
      isLoading,
      login,
      logout,
    }),
    [token, currentUser, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
};
