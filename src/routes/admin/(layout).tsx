import { createAsync, RouteSectionProps } from "@solidjs/router";
import { createSignal } from "solid-js";
import { clientOnly } from "@solidjs/start";
import HomeIcon from "lucide-solid/icons/home";
import UserRoundIcon from "lucide-solid/icons/user-round";
import Gamepad from "lucide-solid/icons/gamepad";
import House from "lucide-solid/icons/house";
import { AdminProvider } from "~/components/context/AdminContext";
import { getSessionUser } from "~/lib/auth/session";

const SideMenu = clientOnly(() => import("~/components/menus/SideMenu"));

const menus = [
  {
    'icon': HomeIcon,
    'label': 'Dashboard',
    'to' : '/admin',
    'path': ['^/admin$'],
  },
  {
    'icon': UserRoundIcon,
    'label': 'Player',
    'to' : '/admin/player',
    'path': ['^/admin/player$', '^/admin/player/create$', '^/admin/player/edit/\\d+', '^/admin/player/\\d+'],
  },
  {
    'icon': Gamepad,
    'label': 'Match',
    'to' : '/admin/match',
    'path': ['^/admin/match$', '^/admin/match/create$', '^/admin/match/edit/\\d+', '^/admin/match/\\d+'],
  },
  {
    'icon': House,
    'label': 'Parlour',
    'to' : '/admin/parlour',
    'path': ['^/admin/parlour$', '^/admin/parlour/create$', '^/admin/parlour/edit/\\d+', '^/admin/parlour/\\d+'],
  },
];

export default function AdminLayout(props: RouteSectionProps) {
  const user = createAsync(() => getSessionUser());
  const [menuSelected, setMenuSelected] = createSignal<number>(0);

  return (
    <AdminProvider>
      <SideMenu
        className=""
        menus={menus}
        menuSelected={menuSelected()}
        OnMenuSelected={(menu: number) => {
          setMenuSelected(menu);
        }}
      >
        <div class="mt-header-mobile md:mt-header ml-0 md:ml-sidebar">
          <div class={`px-10 py-7-5 bg-default-background  ${menuSelected() === 0 ? 'bg-white md:bg-default-background' : ''}`}>
            {props.children}
          </div>
        </div>
      </SideMenu>
    </AdminProvider>
  );
}
