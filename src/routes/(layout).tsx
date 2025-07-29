import { createAsync, RouteSectionProps, useAction, useLocation, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import Dropdown from "~/components/Layout/Dropdown";
import Button from "~/components/ui/Button";
import User from "lucide-solid/icons/user"
import { getSessionUser, logout } from "~/lib/auth/session";
import { UserProvider } from "~/components/context/UserContext";

export default function HomeLayout(props: RouteSectionProps) {
  const user = createAsync(() => getSessionUser());
  const location = useLocation();
  const navigate = useNavigate();
  const showBar = ['/login'];

  const shouldShowBar = () => !showBar.includes(location.pathname);

  const logoutAction = useAction(logout);

  return (
    <>
      <Show when={shouldShowBar()}>
        <div class="bg-white shadow-sm z-50 h-20 w-full">
          <div class="flex items-center justify-between mx-auto h-full max-w-[930px] xl:px-0 px-8">
            <a href="/" class="text-black">Logo</a>
            <Dropdown
              align="right"
              trigger={(toggle) => (
                <div class="flex gap-2">
                  <div
                    class="flex text-black justify-center items-center h-[36px] w-[36px] rounded-full text-xl font-bold bg-mj-green-300 text-white rounded cursor-pointer"
                    onClick={toggle}
                  >
                  <User/>
                  </div>
                </div>
              )}
            >
              <div class="flex flex-col gap-4 p-4">
                <Show when={user()} fallback={
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => {
                      navigate("/login")
                    }}
                  >
                  Login
                  </Button>
                }>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={async () => {
                      navigate("/profile")
                    }}
                  >
                  Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={async () => {
                      await logoutAction();
                    }}
                  >
                  Logout
                  </Button>
                </Show>
              </div>
            </Dropdown>
          </div>
        </div>
      </Show>
      <div class="bg-content">
      <UserProvider>
        {props.children}
      </UserProvider>
      </div>
    </>
  );
}
