import { query, redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";

export type User = {
  id: number;
  username: string;
  user_type: string;
  role: 'super-admin' | 'admin' | 'player';
}

export interface SessionData {
  access_token?: string;
  refresh_token?: string;
  user?: User,
}

export const loginProtected = query(async() => {
  "use server";

  const session = await getSessionUser();

  if (session) {
    throw redirect('/');
  }

  return null;
}, 'login-protected');

export const pageOnlyFor = query(async (role: string[]) => {
  "use server";

  const session = await getSessionUser();

  if (session && role.includes(session.user?.role ?? '')) {
    return null;
  }

  throw redirect('/login');
}, 'page-protected');

export function getSession() {
  "use server";

  const secret_password = import.meta.env.VITE_SESSION_SECRET as string;
  return useSession<SessionData>({
    password: secret_password,
  });
}

export const getSessionUser = query(async() => {
  "use server";

  const {data: sessionData} = await getSession();

  return Boolean(sessionData.access_token) ? sessionData : null;
}, "session-user");

export async function setSession(sessionData: SessionData) {
  "use server";
  const session = await getSession();

  await session.update((data: SessionData) => {
    data.access_token = sessionData.access_token;
    data.refresh_token = sessionData.refresh_token;
    data.user = sessionData.user;

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

    return data;
  });
}
