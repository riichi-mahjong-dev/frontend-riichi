import {
  Accessor,
  children,
  createSignal,
  JSX,
  Show,
  Suspense,
} from "solid-js";
import Text from "~/components/Label/Text";
import { useAdmin } from "../context/AdminContext";
import { clientOnly } from "@solidjs/start";
import Dropdown from "../Layout/Dropdown";
import User from "lucide-solid/icons/user";
import { useAction } from "@solidjs/router";
import { logout } from "~/lib/auth/session";
import MenuItem from "../Layout/MenuItem";
const ChangePasswordModal = clientOnly(
  () => import("~/components/modal/change-password"),
);

type HeaderProps = {
  children?: JSX.Element;
  className?: string;
  onToggle: (toggle: boolean) => void;
  toggle: Accessor<boolean>;
};

export function Header(props: HeaderProps) {
  const [admin] = useAdmin();
  const [modal, setModal] = createSignal<boolean>(false);

  const logoutAction = useAction(logout);

  const UserProfile = () => (
    <div class="flex items-center justify-between gap-8-5">
      <Dropdown
        align="right"
        trigger={(toggle) => (
          <div class="flex gap-2">
            <div
              class="flex text-black justify-center items-center h-9 w-9 text-xl font-bold bg-mj-green-300 dark:text-white rounded-full cursor-pointer"
              onClick={() => {
                toggle();
              }}
            >
              <User />
            </div>
          </div>
        )}
      >
        {(toggle) => (
          <div class="divide-y divide-gray-200">
            <div class="p-3 text-sm text-gray-500">
              Signed in as <strong>{admin.username}</strong>
            </div>
            <div class="py-1">
              <MenuItem
                onClick={() => {
                  toggle();
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  toggle();
                  setModal(true);
                }}
              >
                Change Password
              </MenuItem>
            </div>
            <div class="py-1">
              <MenuItem
                onClick={() => {
                  toggle();
                  logoutAction();
                }}
              >
                Logout
              </MenuItem>
            </div>
          </div>
        )}
      </Dropdown>
    </div>
  );

  return (
    <div
      class={`z-50 fixed top-0 left-0 w-screen h-header-mobile md:h-header bg-white ${props.toggle() ? "" : "shadow-md md:shadow-none"} ${props.className ?? ""}`}
    >
      <div class="flex flex-col h-full w-full pt-default pb-5 px-default md:hidden gap-5">
        <div class="flex justify-between items-center h-appbar-mobile w-full">
          <div
            onClick={(e) => {
              e.stopPropagation();
              props.onToggle(!props.toggle());
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18 13C18 13.5523 17.4801 14 16.8387 14L1.16129 14C0.519928 14 -6.78526e-08 13.5523 -4.37114e-08 13C-1.95703e-08 12.4477 0.519928 12 1.16129 12L16.8387 12C17.4801 12 18 12.4477 18 13Z"
                fill="#343C6A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18 7C18 7.55228 17.5523 8 17 8L1 8C0.447716 8 -6.78525e-08 7.55228 -4.37114e-08 7C-1.95703e-08 6.44771 0.447716 6 1 6L17 6C17.5523 6 18 6.44772 18 7Z"
                fill="#343C6A"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18 0.999998C18 1.55228 17.4801 2 16.8387 2L1.16129 2C0.519928 2 -6.78526e-08 1.55229 -4.37115e-08 1C-1.95704e-08 0.447719 0.519928 3.94468e-06 1.16129 3.7939e-06L16.8387 -5.07615e-08C17.4801 -2.61145e-07 18 0.447714 18 0.999998Z"
                fill="#343C6A"
              />
            </svg>
          </div>
          <UserProfile />
        </div>
        <Text className="font-bold" as="h1">
          {admin.selectedLabel}
        </Text>
      </div>
      <div class="hidden md:flex items-center h-full w-full py-5 pl-9-5 pr-10">
        <div class="flex w-[220px]">
          <Text as="span" className="text-logo font-extrabold text-default">
            Admin
          </Text>
        </div>
        <div class="flex grow items-center justify-between gap-2.5">
          <Text as="h1">{admin.selectedLabel}</Text>
          <UserProfile />
        </div>
      </div>
      {children(() => props.children)()}
      <Suspense>
        <ChangePasswordModal open={modal()} onClose={() => setModal(false)} />
      </Suspense>
    </div>
  );
}
