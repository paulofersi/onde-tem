require('dotenv').config();

module.exports = {
  expo: {
    name: "Onde Tem",
    slug: "onde-tem",
    version: "2.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo_app.png",
    scheme: "ondetem",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ondetem.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Este aplicativo precisa da sua localização para mostrar supermercados próximos com produtos próximos ao vencimento.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "Este aplicativo precisa da sua localização para mostrar supermercados próximos com produtos próximos ao vencimento."
      },
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.ondetem.app",
      versionCode: 1,
      jsEngine: "hermes",
      adaptiveIcon: {
        backgroundColor: "#4CAF50",
        foregroundImage: "./assets/images/logo_app.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#4CAF50",
          dark: {
            backgroundColor: "#2E7D32"
          }
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Este aplicativo precisa da sua localização para mostrar supermercados próximos com produtos próximos ao vencimento."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Este aplicativo precisa de acesso às suas fotos para adicionar imagens aos produtos."
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/logo_app.png",
          color: "#4CAF50",
          sounds: [],
          mode: "production"
        }
      ],
      [
        "./app.plugin.js",
        {
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      ],
      "@react-native-firebase/app",
      "expo-updates"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    updates: {
      url: "https://u.expo.dev/19b05993-64ad-443e-be93-7c949fbbde56",
      fallbackToCacheTimeout: 0,
      checkAutomatically: "ON_LOAD",
      enabled: true
    },
    runtimeVersion: "2.0.0",
    extra: {
      router: {},
      eas: {
        projectId: "19b05993-64ad-443e-be93-7c949fbbde56"
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      graphqlUri: process.env.GRAPHQL_URI || 'http://192.168.3.2:4000/graphql',
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    }
  }
};

