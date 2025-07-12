import { createSignal, Suspense } from "solid-js";
import { clientOnly } from "@solidjs/start";
import PlayerCard from "~/components/Card/Player";
const SearchBar = clientOnly(() => import('~/components/Search'));

export default function Ranked() {
  const [query, setQuery] = createSignal<string>("");
  const [sort, setSort] = createSignal<string>("asc");
  const [sortBy, setSortBy] = createSignal<string>("id");

  return (
    <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-content">
      <Suspense>
        <SearchBar/>
      </Suspense>
      <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mt-20 mx-auto bg-content">
        <div>
          <PlayerCard />
        </div>
      </div>
    </main>
  );
}
