import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

function getBaseUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiBaseUrl as string;
  if (configured && !configured.includes("YOUR_RAILWAY_URL")) return configured;
  // Local dev fallback: Android emulator uses 10.0.2.2, iOS simulator uses localhost
  return Platform.OS === "android"
    ? "http://10.0.2.2:8080"
    : "http://localhost:8080";
}

export const apiClient = axios.create({ baseURL: getBaseUrl() });

apiClient.interceptors.request.use(async (config) => {
  const jwt = await AsyncStorage.getItem("jwt");
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});
