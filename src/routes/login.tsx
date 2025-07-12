import { createAsync } from "@solidjs/router";
import LoginForm from "~/components/Form/Login";
import { loginProtected } from "~/lib/auth/session";

export default function Login() {
  createAsync(() => loginProtected());

  return (
    <main class="flex xl:flex-row flex-col w-full h-screen min-h-120">
        <div class="lg:flex flex-col flex-1 items-center justify-center none dark:bg-mj-green bg-mj-green-400">
          <div class="text-5xl p-4">
            Logo
          </div>
        </div>
        <div class="flex flex-col flex-1 items-center dark:bg-mj-dark-green bg-white justify-center lg:p-16 p-4">
          <LoginForm type="player"/>
        </div>
    </main>
  );
}
