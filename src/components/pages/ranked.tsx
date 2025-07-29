import { For, onCleanup, onMount, Show } from "solid-js";
import { getPlayers } from "~/api/player";
import PlayerCard from "~/components/Card/Player";
import { usePagination } from "~/compose/createSearchResource";
import Dropdown from "../Layout/Dropdown";
import Button from "../ui/Button";
import Funnel from "lucide-solid/icons/funnel";
import Input from "../ui/Input";
import Search from "lucide-solid/icons/search";
import { RankingFilter } from "../Layout/RankingFilter";

export default function RankedPage() {
  const {
    data,
    search,
    setSearch,
    setPage,
    hasMore,
    loading,
    setFilters,
    filterEntries,
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
            <Dropdown
              trigger={(toggle) => (
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={toggle}
                  leftIcon={<Funnel/>}
                >
                Filter
                </Button>
              )}
            >
              <div class="p-6">
                <RankingFilter
                  onApply={(min, max) => {
                    if (min && max) {
                      setFilters({
                        'mmr_between': `${min},${max}`
                      });
                    }
                  }}
                />
              </div>
            </Dropdown>
            <Input
              size="full"
              value={search()}
              type="text"
              placeholder="Search"
              icon={<Search size={18}/>}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
          </div>
          <div class="flex flex-row">
            {filterEntries().map(([key, value]) => (
              <div class="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-md">
                <span>{key}: {value}</span>
                <button
                  class="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setFilters(prev => {
                      const updated = { ...prev };
                      delete updated[key];
                      return updated;
                    });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <For each={data()}>
          {(item) => (
            <PlayerCard
              id={item.id}
              name={item.name}
              username={item.username}
              rank={item.rank}/>
          )}
        </For>
        <Show when={loading()}>
          <span>Loading...</span>
        </Show>
      </div>
    </main>
  );
}
