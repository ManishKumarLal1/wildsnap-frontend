
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    getMe,
    login as loginApi,
    logout as logoutApi,
    register as registerApi,
    type AuthUser,
} from "@/api/auth";

import {
    getToken,
    removeToken,
    saveToken,
} from "@/storage/authStorage";

import { getMyCollection } from "@/api/collection";
import { useUserStore } from "@/store/userStore";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;

  login: (
    username: string,
    password: string
  ) => Promise<void>;

  register: (
    username: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUserState] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const userStore = useUserStore();

  const updateUserStore = (user: AuthUser) => {
    userStore.setUser({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      speciesDiscovered: 0,
      streak: user.streak,
      lastObservationDate:
        user.last_observation_date ?? null,
      location: user.location || "",
    });
  };

  const loadCollection = async () => {
    try {
      const collection = await getMyCollection();

      userStore.setCollection(
        collection.map((item: any) => ({
          id: item.id,
          name: item.name,
          scientificName: item.scientific_name,
          category: item.category,
          rarity: item.rarity,
          emoji: "🦜",
          discovered: true,
          discoveryCount: item.discovery_count,
          xp: item.base_xp,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to load collection:",
        error
      );
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  /*
   * Restore existing session
   */
  const restoreSession = async () => {
    try {
      const storedToken = await getToken();

      if (!storedToken) {
        return;
      }

      const result = await getMe(storedToken);

      setToken(storedToken);
      setUserState(result.user);

      updateUserStore(result.user);

      await loadCollection();
    } catch (error) {
      console.log(
        "Session restore failed"
      );

      await removeToken();

      setToken(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Login
   */
  const login = async (
    username: string,
    password: string
  ) => {
    const result = await loginApi(
      username,
      password
    );

    await saveToken(result.token);

    setToken(result.token);
    setUserState(result.user);

    updateUserStore(result.user);

    await loadCollection();
  };

  /*
   * Register
   */
  const register = async (
    username: string,
    password: string
  ) => {
    const result = await registerApi(
      username,
      password
    );

    // Registration now creates an authenticated session
    await saveToken(result.token);

    setToken(result.token);
    setUserState(result.user);

    updateUserStore(result.user);

    await loadCollection();
  };

  /*
   * Logout
   */
  const logout = async () => {
    try {
      if (token) {
        await logoutApi(token);
      }
    } catch (error) {
      console.log(
        "Logout request failed"
      );
    } finally {
      await removeToken();

      setToken(null);
      setUserState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
