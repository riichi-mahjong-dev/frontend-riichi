import { For, onCleanup, onMount, Show } from "solid-js";
import { usePagination } from "~/compose/createSearchResource";
import ParlourCard from "../Card/Parlour";
import { getParlours } from "~/api/parlour";
import Search from "lucide-solid/icons/search";
import Input from "../ui/Input";

export default function ParlourPage() {
  const {
    data,
    search,
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
      <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-content">
        <div class="flex flex-col gap-2 bg-white px-4 py-4 rounded-md">
          <div class="flex flex-row justify-between gap-4">
            <Input
              size="full"
              value={search()}
              type="text"
              placeholder="Search"
              icon={<Search size={18}/>}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
          </div>
        </div>
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

