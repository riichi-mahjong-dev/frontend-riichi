import { createSignal } from 'solid-js';

export default function AdminLogin() {
  const [username, setUsername] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");

  const loginAction = (e: Event) => {
    e.preventDefault();
    const currUsername: string = username();
    const currPassword: string = password();
    console.log("login");
  }

  return (
    <main class="flex lg:flex-row flex-col w-full h-screen">
        <div class="lg:flex flex-1 items-center justify-center hidden none dark:bg-mj-green bg-mj-green-400">
          <div class="text-5xl p-4">
            Logo
          </div>
        </div>
        <div class="flex flex-col flex-1 items-center dark:bg-mj-dark-green bg-white justify-center lg:p-16 p-4">
            <form class="flex flex-col lg:w-2/3 w-full gap-6 items-center rounded p-8" onSubmit={loginAction}>
                <label class="text-left w-full">
                  <h1 class="text-5xl text-mj-green-400 dark:text-white font-bold">Login</h1>
                </label>
                <div class="flex w-full bg-white p-4 rounded border dark:border-mj-green border-mj-green-400">
                  <input
                    class="w-full outline-none focus:outline-none focus:ring-0 text-gray-700 text-lg"
                    type="text"
                    placeholder="Username"
                    value={username()}
                    onInput={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div class="flex w-full bg-white p-4 rounded border dark:border-mj-green border-mj-green-400">
                  <input
                    class="w-full outline-none focus:outline-none focus:ring-0 text-gray-700 text-lg"
                    type="password"
                    placeholder="Password"
                    value={password()}
                    onInput={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button class="w-full dark:bg-mj-green bg-mj-green-400 text-white p-4 text-gray-700 rounded font-bold text-xl" type="submit">Login</button>
            </form>
        </div>
    </main>
  );
}
