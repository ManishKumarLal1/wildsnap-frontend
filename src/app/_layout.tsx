import {
  Stack,
  useRouter,
  useSegments,
} from "expo-router";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import AppToast from "@/components/ui/AppToast";

import { useEffect } from "react";

import { UserStoreProvider } from "@/store/userStore";

import {
  AuthProvider,
  useAuth,
} from "@/context/AuthContext";

import AchievementNotificationOverlay from "@/components/achievements/AchievementNotificationOverlay";

// Keep splash screen visible until fonts are loaded.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserStoreProvider>
      <AuthProvider>
        <RootNavigator />

        <AchievementNotificationOverlay />

        <AppToast />
      </AuthProvider>
    </UserStoreProvider>
  );
}

function RootNavigator() {
  const {
    user,
    loading,
  } = useAuth();

  const router = useRouter();

  const segments = useSegments();

  const currentGroup = segments[0];

  useEffect(() => {
    /*
     * Don't redirect while we're still
     * checking AsyncStorage / backend.
     */
    if (loading) {
      return;
    }

    const inAuthGroup =
      currentGroup === "(auth)";

    /*
     * User is logged out.
     *
     * If they are somewhere outside
     * the auth screens, send them to login.
     */
    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    /*
     * User is logged in.
     *
     * Don't allow login/register screens.
     */
    if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [
    user,
    loading,
    currentGroup,
  ]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(auth)"
      />

      <Stack.Screen
        name="(tabs)"
      />

      <Stack.Screen
        name="observation"
      />

      <Stack.Screen
        name="species/[id]"
      />
    </Stack>
  );
}