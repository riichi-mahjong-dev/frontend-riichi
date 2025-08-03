import { createAsync, RouteSectionProps } from "@solidjs/router";
import { createEffect, createSignal, JSX } from "solid-js";
import { clientOnly } from "@solidjs/start";
import HomeIcon from "lucide-solid/icons/home";
import UserRoundIcon from "lucide-solid/icons/user-round";
import UsersRoundIcon from "lucide-solid/icons/users-round";
import Gamepad from "lucide-solid/icons/gamepad";
import House from "lucide-solid/icons/house";
import { AdminProvider } from "~/components/context/AdminContext";
import { getSessionUser } from "~/lib/auth/session";
import List from "lucide-solid/icons/list";
import { LucideProps } from "lucide-solid";
import { Title } from "@solidjs/meta";

const SideMenu = clientOnly(() => import("~/components/menus/SideMenu"));

type MenuType = {
  icon: (props: LucideProps) => JSX.Element;
  label: string;
  to: string;
  path: Array<string>;
}

const menus: Array<MenuType> = [
  {
    'icon': HomeIcon,
    'label': 'Dashboard',
    'to' : '/admin',
    'path': ['^/admin$'],
  },
  {
    'icon': UserRoundIcon,
    'label': 'Admin',
    'to' : '/admin/admin',
    'path': ['^/admin/admin$', '^/admin/admin/create$', '^/admin/admin/\\d+/edit', '^/admin/admin/\\d+'],
  },
  {
    'icon': UsersRoundIcon,
    'label': 'Player',
    'to' : '/admin/player',
    'path': ['^/admin/player$', '^/admin/player/create$', '^/admin/player/\\d+/edit', '^/admin/player/\\d+'],
  },
  {
    'icon': Gamepad,
    'label': 'Match',
    'to' : '/admin/match',
    'path': ['^/admin/match$', '^/admin/match/create$', '^/admin/match/\\d+/edit', '^/admin/match/\\d+'],
  },
  {
    'icon': House,
    'label': 'Parlour',
    'to' : '/admin/parlour',
    'path': ['^/admin/parlour$', '^/admin/parlour/create$', '^/admin/parlour/\\d+/edit', '^/admin/parlour/\\d+'],
  },
  {
    'icon': List,
    'label': 'Logs',
    'to': '/admin/log',
    'path': ['^/admin/log$', '^/admin/log/\\d+'],
  }
];

export default function AdminLayout(props: RouteSectionProps) {
  const user = createAsync(() => getSessionUser());
  const [menuSelected, setMenuSelected] = createSignal<number>(0);

  return (
    <>
      <Title>Admin</Title>
      <AdminProvider>
        <SideMenu
          className=""
          menus={menus.filter((val) => user()?.user?.role === 'super-admin' || val.label !== 'Admin')}
          menuSelected={menuSelected()}
          OnMenuSelected={(menu: number) => {
            setMenuSelected(menu);
          }}
        >
          <div class="mt-header-mobile md:mt-header ml-0 md:ml-sidebar">
            <div class={`px-10 py-7-5 bg-default-background ${menuSelected() === 0 ? 'bg-white md:bg-default-background' : ''}`}>
              {props.children}
            </div>
          </div>
        </SideMenu>
      </AdminProvider>
    </>
  );
}
