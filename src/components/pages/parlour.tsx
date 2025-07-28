import { For, onCleanup, onMount, Show } from "solid-js";
import { usePagination } from "~/compose/createSearchResource";
import Search from "../Search";
import ParlourCard from "../Card/Parlour";
import { getParlours } from "~/api/parlour";

export default function ParlourPage() {
  const {
    data,
    setSearch,
    setPage,
    hasMore,
    loading,
  } = usePagination({
    fetcher: getParlours,
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
      <Search onInput={(value: string) => setSearch(value)}/>
      <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mt-20 mx-auto bg-content">
        <For each={data()}>
          {(item) => (
            <ParlourCard
              id={item.id}
              name={item.name}
              country={item.country}
              province={item.province?.name ?? ""}
              address={item.address}
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

