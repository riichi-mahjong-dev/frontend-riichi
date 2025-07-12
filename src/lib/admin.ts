import { action, redirect, revalidate } from "@solidjs/router";
import { getSessionUser, loginProtected, pageOnlyFor, setSession, terminateSession, User } from "./auth/session";
import { getSession } from "vinxi/http";

export type USER = 'admin' | 'player';

export const INITIAL_FIELD = {
    'username': '',
    'password': '',
};

type RESPONSE_LOGIN = {
    'status': 'ok' | 'error',
    'field': keyof typeof INITIAL_FIELD | null,
    'message': string
}

type AuthData = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expired_at: Date;
  user: User;
}

type AuthResponse = {
  success: boolean;
  message: string;
  data: AuthData;
}

export const loginSubmit = action(async (username: string, password: string, type: USER): Promise<RESPONSE_LOGIN> => {
    "use server";

    const host = import.meta.env.VITE_BACKEND_HOST;
    const req = await fetch(`${host}/auth/login/${type}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username,
            password,
        })
    });
    const res = await req.json() as AuthResponse;

    if (res.success) {
      await setSession({
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        user: res.data.user,
      });

      let redirectUrl = '/';
      if (type === 'admin') {
        redirectUrl = '/admin';
      }

      throw redirect(redirectUrl, {
        revalidate: [getSessionUser.key],
      });
    }

    return {
      'status': 'error',
      'field': null,
      'message': res.message,
    }
});

export const logout = action(async () => {
  "use server";

  await terminateSession();

  throw redirect('/', {
    revalidate: [getSessionUser.key, loginProtected.key, pageOnlyFor.key]
  });
});
