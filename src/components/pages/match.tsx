import { For, onCleanup, onMount, Show } from "solid-js";
import { usePagination } from "~/compose/createSearchResource";
import { getMatches } from "~/api/match";
import MatchCard from "../Card/Match";

export default function MatchPage() {
  const {
    data,
    setPage,
    hasMore,
    loading,
  } = usePagination({
    fetcher: getMatches,
    pageSize: 10,
    initialSort: "-id",
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

    if (scrollingDown && nearBottom && hasMore()) {
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
      <div class="flex flex-col gap-10 xl:w-[930px] w-full xl:px-0 px-8 py-8 mt-20 mx-auto bg-content">
        <For each={data()}>
          {(item) => (
            <MatchCard
              id={item.id}
              players={item.match_players}
              playing_at={item.playing_at}
              parlour_name={item.parlour?.name ?? ""}
              created_by={item.creator}
            />
          )}
        </For>
        <Show when={loading()}>
          <span>Loading...</span>
        </Show>
      </div>
    </main>
  );
}
