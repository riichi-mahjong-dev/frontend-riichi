import { createSignal } from "solid-js";

export default function Ranked() {
  const [query, setQuery] = createSignal<string>("");
  const [sort, setSort] = createSignal<string>("asc");
  const [sortBy, setSortBy] = createSignal<string>("id");

  return (
    <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-white">
        <div class="relative w-full bg-mj-green-400">
          <div class="w-full h-[250px] text-left">
          </div>
          <div class="absolute -bottom-14 h-28 w-full px-8">
            <div class="flex bg-white xl:w-[930px] h-full mx-auto shadow-xl rounded-xl px-6 py-8">
              <div class="flex-1">
                <input class="outline-none focus:outline-none focus:ring-0 w-full h-full text-2xl" type="search" placeholder="Search..."/>
              </div>
              <div class="w-30 h-full">
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-white">
          <div>
          </div>
        </div>
    </main>
  );
}
