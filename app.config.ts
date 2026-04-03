import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Sudoku",
  slug: "sudoku",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "sudoku",
  icon: "./assets/icon.png",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#1a1a2e",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.sudoku.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1a1a2e",
    },
    package: "com.sudoku.app",
    edgeToEdgeEnabled: true,
  },
  plugins: [
    "expo-web-browser",
    "expo-router",
    ["expo-notifications", { sounds: [] }],
  ],
  extra: {
    facebookAppId: process.env.FACEBOOK_APP_ID ?? "",
    apiBaseUrl: process.env.API_BASE_URL ?? "",
    eas: {
      projectId: "5580a1d3-7126-4660-b075-5a69948f4022",
    },
  },
};

export default config;
