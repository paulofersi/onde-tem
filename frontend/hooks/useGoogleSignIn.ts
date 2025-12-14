import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

// Configurar WebBrowser para autenticação
WebBrowser.maybeCompleteAuthSession();

/**
 * Hook para login com Google usando Firebase Auth
 */
export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);

  const redirectUri = (() => {
    if (__DEV__) {
      const username = "paulofersi";
      const slug = "onde-tem";
      return `https://auth.expo.io/@${username}/${slug}`;
    }
    return makeRedirectUri({
      scheme: "ondetem",
    });
  })();

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined;

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: __DEV__
      ? webClientId
      : process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: __DEV__
      ? webClientId
      : process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
    webClientId,
    redirectUri,
    scopes: ["profile", "email"],
  });

  return {
    request,
    response,
    promptAsync,
    loading,
    setLoading,
  };
}
