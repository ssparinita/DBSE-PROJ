import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API = "http://localhost:8081";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [demoRole, setDemoRole] = useState(
    () => sessionStorage.getItem("galerie_demo_role") || null
  );
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const response = await fetch(`${API}/api/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Authentication check failed");
      }

      const data = await response.json();

      if (data.authenticated) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAuthError(error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  const setPersona = (role) => {
    const normalizedRole = role.toUpperCase();

    sessionStorage.setItem(
      "galerie_demo_role",
      normalizedRole
    );

    setDemoRole(normalizedRole);
  };

  const clearPersona = () => {
    sessionStorage.removeItem("galerie_demo_role");
    setDemoRole(null);
  };

  const navigateToLogin = () => {
    window.location.href =
      `${API}/oauth2/authorization/google?prompt=select_account`;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    clearPersona();
    setUser(null);
    window.location.href = "/";
  };

  /*
   * DEMO ROLE:
   * If a persona has been selected, use it for the expo experience.
   * Otherwise use the real database role.
   */
  const activeRole = demoRole || user?.role || null;

  const activeUser = user
    ? {
        ...user,
        role: activeRole,
        realRole: user.role,
        demoRole,
      }
    : null;

  const value = {
    user: activeUser,
    realUser: user,
    demoRole,
    activeRole,
    isAuthenticated: !!user,
    isLoadingAuth,
    authError,

    setPersona,
    clearPersona,

    navigateToLogin,
    logout,
    refreshUser: checkUserAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;