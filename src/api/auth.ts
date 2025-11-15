import { action, redirect } from "@solidjs/router";
import { ErrorResponse, fetchApi, ResponseData } from "./base";
import { getSessionUser, setSession, User } from "~/lib/auth/session";
import { getMatches } from "./match";
import { getParlours } from "./parlour";
import { getPlayers } from "./player";

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: Date;
  user: User;
};

export const INITIAL_FIELD = {
  username: "",
  password: "",
};

export const loginUser = action(
  async (
    username: string,
    password: string,
    type: "admin" | "player",
  ): Promise<string | undefined> => {
    "use server";

    const res = await fetchApi<ResponseData<AuthResponse>>(
      `/auth/login/${type}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      },
    );

    if (!res.success) {
      return (res as ErrorResponse).error;
    }

    const data = (res as ResponseData<AuthResponse>).data;
    await setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });

    let redirectUrl = "/";
    if (type === "admin") {
      redirectUrl = "/admin";
    }

    throw redirect(redirectUrl, {
      revalidate: [getMatches.key, getParlours.key, getPlayers.key],
    });
  },
  "login-player",
);

export const refreshToken = async (refreshToken: string, type: string) => {
  const res = await fetchApi<ResponseData<AuthResponse>>(`/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  let redirectUrl = "/login";

  if (type !== "player") {
    redirectUrl = "admin/login";
  }

  if (!res.success) {
    throw redirect(redirectUrl, {
      revalidate: [getSessionUser.key],
    });
  }

  const data = (res as ResponseData<AuthResponse>).data;
  await setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user,
  });
};
