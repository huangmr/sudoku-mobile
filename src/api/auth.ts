import { apiClient } from "./client";

export async function loginWithFacebook(
  accessToken: string,
): Promise<{ token: string }> {
  const res = await apiClient.post("/auth/facebook", { accessToken });
  return res.data;
}
