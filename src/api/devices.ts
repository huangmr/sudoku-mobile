import { apiClient } from "./client";

export async function registerPushToken(
  pushToken: string,
  platform: "ios" | "android",
  timezoneOffsetMinutes: number,
): Promise<void> {
  await apiClient.post("/devices/token", {
    pushToken,
    platform,
    timezoneOffsetMinutes,
  });
}
