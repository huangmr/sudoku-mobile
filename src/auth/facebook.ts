import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const FACEBOOK_APP_ID = Constants.expoConfig?.extra?.facebookAppId as string;

const discovery = {
  authorizationEndpoint: "https://www.facebook.com/dialog/oauth",
};

export function useFacebookAuth() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: "sudoku" });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FACEBOOK_APP_ID,
      scopes: ["public_profile"],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery,
  );

  return { request, response, promptAsync };
}

/** Extracts the access token from a successful auth response */
export function extractFbToken(
  response: AuthSession.AuthSessionResult | null,
): string | null {
  if (response?.type === "success" && response.params?.access_token) {
    return response.params.access_token;
  }
  return null;
}
