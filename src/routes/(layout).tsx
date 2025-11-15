import {
  createAsync,
  RouteSectionProps,
  useAction,
  useLocation,
  useNavigate,
} from "@solidjs/router";
import { createSignal, Show, Suspense } from "solid-js";
import Dropdown from "~/components/Layout/Dropdown";
import User from "lucide-solid/icons/user";
import { getSessionUser, logout } from "~/lib/auth/session";
import { UserProvider } from "~/components/context/UserContext";
import MenuItem from "~/components/Layout/MenuItem";
import { clientOnly } from "@solidjs/start";
const ChangePasswordModal = clientOnly(
  () => import("~/components/modal/change-password"),
);

export default function HomeLayout(props: RouteSectionProps) {
  const user = createAsync(() => getSessionUser());
  const location = useLocation();
  const navigate = useNavigate();
  const showBar = ["/login"];
  const [modal, setModal] = createSignal<boolean>(false);

  const shouldShowBar = () => !showBar.includes(location.pathname);

  const logoutAction = useAction(logout);

  return (
    <>
      <Show when={shouldShowBar()}>
        <div class="bg-white shadow-sm z-50 h-20 w-full">
          <div class="flex items-center justify-between mx-auto h-full max-w-[930px] xl:px-0 px-8">
            <a href="/" class="text-black">
              <div class="w-12 h-12">
                <svg
                  viewBox="0 0 64 64"
                  width="48"
                  height="48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14"
                    y="14"
                    width="30"
                    height="40"
                    rx="4"
                    ry="4"
                    fill="#fff9ec"
                    stroke="#888"
                    stroke-width="2"
                    transform="rotate(-5 30 34)"
                  />
                  <circle
                    cx="29"
                    cy="30"
                    r="5"
                    fill="#ef4444"
                    stroke="#991b1b"
                    stroke-width="1"
                  />
                  <rect
                    x="26"
                    y="18"
                    width="30"
                    height="40"
                    rx="4"
                    ry="4"
                    fill="#fff"
                    stroke="#444"
                    stroke-width="2"
                    transform="rotate(8 40 38)"
                  />
                  <text
                    x="41"
                    y="42"
                    font-size="18"
                    text-anchor="middle"
                    fill="#2563eb"
                    font-family="sans-serif"
                    font-weight="bold"
                  >
                    東
                  </text>
                </svg>
              </div>
            </a>
            <Dropdown
              align="right"
              trigger={(toggle) => (
                <div class="flex gap-2">
                  <div
                    class="flex text-black justify-center items-center h-9 w-9 text-xl font-bold bg-mj-green-300 dark:text-white rounded cursor-pointer"
                    onClick={toggle}
                  >
                    <User />
                  </div>
                </div>
              )}
            >
              {(toggle) => (
                <div class="divide-y divide-gray-200">
                  <Show
                    when={user()}
                    fallback={
                      <>
                        <div class="p-3 text-sm text-gray-500">Not SignIn</div>
                        <div class="py-1">
                          <MenuItem
                            onClick={() => {
                              toggle();
                              navigate("/login");
                            }}
                          >
                            Login
                          </MenuItem>
                        </div>
                      </>
                    }
                  >
                    <div class="p-3 text-sm text-gray-500">
                      Signed in as{" "}
                      <strong>
                        ({user()?.user?.user_type}){user()?.user?.username}
                      </strong>
                    </div>
                    <div class="py-1">
                      <Show
                        when={user()?.user?.user_type === "player"}
                        fallback={
                          <MenuItem
                            onClick={() => {
                              toggle();
                              navigate("/admin");
                            }}
                          >
                            Go To Admin Page
                          </MenuItem>
                        }
                      >
                        <MenuItem
                          onClick={() => {
                            toggle();
                            navigate("/profile");
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
                      </Show>
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
                  </Show>
                </div>
              )}
            </Dropdown>
          </div>
        </div>
      </Show>
      <div class="bg-content">
        <UserProvider>{props.children}</UserProvider>
      </div>
      <Suspense>
        <ChangePasswordModal
          open={modal()}
          onClose={() => setModal(false)}
          type="player"
        />
      </Suspense>
    </>
  );
}
