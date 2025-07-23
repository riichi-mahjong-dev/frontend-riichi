import { action, redirect, revalidate } from "@solidjs/router";
import { getSessionUser, loginProtected, pageOnlyFor, setSession, terminateSession, User } from "./auth/session";

export type USER = 'admin' | 'player';

export const INITIAL_FIELD = {
    'username': '',
    'password': '',
};

export const logout = action(async () => {
  "use server";

  await terminateSession();

  throw redirect('/', {
    revalidate: [getSessionUser.key, loginProtected.key, pageOnlyFor.key]
  });
});
