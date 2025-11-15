import { action, query, redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";

export type User = {
  id: number;
  username: string;
  user_type: string;
  role: "super-admin" | "admin" | "player";
};

export interface SessionData {
  access_token?: string;
  refresh_token?: string;
  expired?: number;
  token_type?: string;
  user?: User;
}

export const loginProtected = query(async () => {
  "use server";

  const session = await getSessionUser();

  if (!session) {
    return null;
  }

  if (session.user?.user_type === "player") {
    throw redirect("/");
  }

  throw redirect("/admin");
}, "login-protected");

export const pageOnlyFor = query(
  async (
    role: string[],
    redirectTo: string = "/login",
  ): Promise<SessionData> => {
    "use server";

    const session = await getSessionUser();

    if (session && role.includes(session.user?.user_type ?? "")) {
      return session;
    }

    throw redirect(redirectTo);
  },
  "page-protected",
);

export function getSession() {
  "use server";

  const secret_password = import.meta.env.VITE_SESSION_SECRET as string;
  return useSession<SessionData>({
    password: secret_password,
  });
}

export const getSessionUser = query(async (): Promise<SessionData | null> => {
  "use server";

  const { data: sessionData } = await getSession();

  return Boolean(sessionData.access_token) ? sessionData : null;
}, "session-user");

export async function setSession(sessionData: SessionData) {
  "use server";
  const session = await getSession();

  await session.update((data: SessionData) => {
    data.access_token = sessionData.access_token;
    data.refresh_token = sessionData.refresh_token;
    data.user = sessionData.user;
    data.expired = sessionData.expired;
    data.token_type = sessionData.token_type;

    return data;
  });
}

export async function terminateSession() {
  "use server";

  const session = await getSession();

  await session.update((data: SessionData) => {
    data.access_token = undefined;
    data.refresh_token = undefined;
    data.user = undefined;
    data.expired = undefined;
    data.token_type = undefined;

    return data;
  });
}

export const logout = action(async () => {
  "use server";

  await terminateSession();

  throw redirect("/", {
    revalidate: [getSessionUser.key, loginProtected.key, pageOnlyFor.key],
  });
});
