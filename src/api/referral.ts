import { apiClient } from './client';

export async function getInviteLink(): Promise<{ deepLink: string; appStoreUrl: string; playStoreUrl: string }> {
  const res = await apiClient.get('/invite/link');
  return res.data;
}

export async function claimReferral(referrerId: string): Promise<{ alreadyClaimed: boolean }> {
  const res = await apiClient.post('/invite/claim', { referrerId });
  return res.data;
}
