import { createEffect, createResource, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { getPlayers, Player } from "~/api/player";
import PlayerCard from "~/components/Card/Player";
import { usePagination } from "~/compose/createSearchResource";
import Search from "../Search";

export default function RankedPage() {
  const {
    data,
    setSearch,
    setPage,
    finalData,
    loading,
  } = usePagination({
    fetcher: getPlayers,
    pageSize: 10,
    initialSort: "-rank",
    debounceMs: 300,
    scrollData: true,
  });

  let lastScrollY = 0;

  const handleWindowScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollingDown = scrollTop > lastScrollY;
    lastScrollY = scrollTop;

    const nearBottom = scrollTop + windowHeight >= documentHeight - 200;

    if (scrollingDown && nearBottom && !finalData()) {
      setPage((p) => p + 1);
    }
  }

  onMount(() => {
    window.addEventListener("scroll", handleWindowScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", handleWindowScroll);
  });

  return (
    <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-content">
      <Search onInput={(value: string) => setSearch(value)}/>
      <Show when={!loading()} fallback={<div>Loading</div>}>
        <div class="flex flex-col gap-2 xl:w-[930px] w-full xl:px-0 px-8 py-8 mt-20 mx-auto bg-content">
          <For each={data()}>
            {(item) => (
              <PlayerCard
                id={item.id}
                name={item.name}
                mr={item.rank}/>
            )}
          </For>
        </div>
      </Show>
    </main>
  );
}
