import { createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type AdminStore = {
   selectedLabel: string;
}

type AdminContextType = [
  state: AdminStore,
  setState: (value: Partial<AdminStore>) => void,
];

const AdminContext = createContext<AdminContextType>();

export function AdminProvider(props: {children: JSX.Element}) {
  const [admin, setAdmin] = createStore<AdminStore>({
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
