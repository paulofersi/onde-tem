require('dotenv').config();

module.exports = {
  expo: {
    name: "Onde Tem",
    slug: "onde-tem",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ondetem",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ondetem.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Este aplicativo precisa da sua localização para mostrar supermercados próximos com produtos próximos ao vencimento.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "Este aplicativo precisa da sua localização para mostrar supermercados próximos com produtos próximos ao vencimento."
      }
    },
    android: {
      package: "com.ondetem.app",
      versionCode: 1,
      adaptiveIcon: {
        backgroundColor: "#4CAF50",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
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
        "./app.plugin.js",
        {
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY 
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "19b05993-64ad-443e-be93-7c949fbbde56"
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY 
    }
  }
};

