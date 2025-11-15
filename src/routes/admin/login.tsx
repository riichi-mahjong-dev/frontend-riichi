import { createAsync } from "@solidjs/router";
import LoginForm from "~/components/Form/Login";
import { loginProtected } from "~/lib/auth/session";

export default function Login() {
  createAsync(() => loginProtected());

  return (
    <main class="flex xl:flex-row flex-col w-full h-screen min-h-120">
      <div class="lg:flex flex-col flex-1 items-center justify-center none dark:bg-mj-green bg-mj-green-400">
        <div class="flex w-12 h-12">
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
      </div>
      <div class="flex flex-col flex-1 items-center dark:bg-mj-dark-green bg-white justify-center lg:p-16 p-4">
        <LoginForm type="admin" />
      </div>
    </main>
  );
}
