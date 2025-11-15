import { createAsync } from "@solidjs/router";
import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getSessionUser } from "~/lib/auth/session";

type UserStore = {
  userId?: number;
  username?: string;
  name?: string;
};

type UserContextType = [
  state: UserStore,
  setState: (value: Partial<UserStore>) => void,
];

const UserContext = createContext<UserContextType>();

export function UserProvider(props: { children: JSX.Element }) {
  const userSession = createAsync(() => getSessionUser());
  const [user, setUser] = createStore<UserStore>({
    userId: userSession()?.user?.id,
    username: userSession()?.user?.username,
  });

  const setState = (value: Partial<UserStore>) => setUser(value);

  return (
    <UserContext.Provider value={[user, setState]}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
