import { createAsync } from "@solidjs/router";
import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getSessionUser } from "~/lib/auth/session";

type AdminStore = {
  adminId?: number;
  username?: string;
  selectedLabel: string;
}

type AdminContextType = [
  state: AdminStore,
  setState: (value: Partial<AdminStore>) => void,
];

const AdminContext = createContext<AdminContextType>();

export function AdminProvider(props: {children: JSX.Element}) {
  const adminSession = createAsync(() => getSessionUser());
  const [admin, setAdmin] = createStore<AdminStore>({
    adminId: adminSession()?.user?.id,
    username: adminSession()?.user?.username,
    selectedLabel: "",
  });

  const setState = (value: Partial<AdminStore>) => setAdmin(value);

  return (
    <AdminContext.Provider value={[admin, setState]}>
      {props.children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
