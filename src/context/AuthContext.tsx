import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  getMe,
  logout as logoutApi,
  type AuthUser,
} from "@/api/auth";

import {
  getToken,
  saveToken,
  removeToken,
} from "@/storage/authStorage";

import { useUserStore } from "@/store/userStore";
import { getMyCollection } from "@/api/collection";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;

  login: (
    identifier: string,
    password: string
  ) => Promise<void>;

  register: (
    username: string,
    email: string,
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

      const result =
        await getMe(storedToken);

      setToken(storedToken);
      setUserState(result.user);

      userStore.setUser({
        id: result.user.id,
        username: result.user.username,
        avatar: result.user.avatar,
        xp: result.user.xp,
        level: result.user.level,
        speciesDiscovered: 0,
        streak: result.user.streak,
        lastObservationDate:
          result.user.last_observation_date ?? null,
        location:
          result.user.location || "",
      });
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
    identifier: string,
    password: string
  ) => {
    const result = await loginApi(
      identifier,
      password
    );

    await saveToken(result.token);

    setToken(result.token);
    setUserState(result.user);

    userStore.setUser({
      id: result.user.id,
      username: result.user.username,
      avatar: result.user.avatar,
      xp: result.user.xp,
      level: result.user.level,
      speciesDiscovered: 0,
      streak: result.user.streak,
      lastObservationDate:
        result.user.last_observation_date ?? null,
      location:
        result.user.location || "",
    });
    await loadCollection();
  };

  /*
   * Register
   */
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await registerApi(
      username,
      email,
      password
    );

    // IMPORTANT:
    // Registration does NOT log the user in.
    // User must verify email first.
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