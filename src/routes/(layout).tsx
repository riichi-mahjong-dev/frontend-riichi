import { RouteSectionProps, useLocation, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

export default function HomeLayout(props: RouteSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const showBar = ['/login'];

  const shouldShowBar = () => !showBar.includes(location.pathname);

  return (
    <>
      <Show when={shouldShowBar()}>
        <div class="bg-white shadow-sm z-50 h-20 w-full">
          <div class="flex items-center justify-between mx-auto h-full max-w-[930px] xl:px-0 px-8">
            <div class="text-black">Logo</div>
            <div
              class="flex py-2 px-12 text-black justify-center items-center h-12 text-xl font-bold bg-mj-green-300 text-white rounded cursor-pointer"
              onClick={() => {
                navigate('/login');
              }}
            >
            Login
            </div>
          </div>
        </div>
      </Show>
      {props.children}
    </>
  );
}
