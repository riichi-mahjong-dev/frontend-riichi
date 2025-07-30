import { For, onCleanup, onMount, Show } from "solid-js";
import { usePagination } from "~/compose/createSearchResource";
import { getMatches } from "~/api/match";
import MatchCard from "~/components/Card/Match";
import Funnel from "lucide-solid/icons/funnel";
import { writeDateOnly } from "~/utils/common";
import { MatchFilter } from "~/components/Layout/MatchFilter";
import Button from "~/components/ui/Button";
import Dropdown from "~/components/Layout/Dropdown";
import SearchDropdown from "~/components/Form/SearchDropdown";
import { getPlayers, Player } from "~/api/player";

export default function MatchPage() {
  const {
    data,
    setPage,
    hasMore,
    loading,
    setFilters,
    filterEntries,
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
      <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-content">
        <div class="flex flex-col gap-2 bg-white px-4 py-4 rounded-md">
          <div class="flex flex-row justify-between gap-4">
            <Dropdown
              trigger={(toggle) => (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={toggle}
                  leftIcon={<Funnel/>}
                >
                Filter
                </Button>
              )}
            >
              <div class="p-6">
                <MatchFilter
                  onApply={(start_date, end_date) => {
                    if (start_date && end_date) {
                      setFilters((prev) => {
                        return {...prev, 'playing_between': `${writeDateOnly(start_date)},${writeDateOnly(end_date)}`}
                      });
                    }
                  }}
                />
              </div>
            </Dropdown>
            <SearchDropdown
              multi
              fetchData={async (query, page) => {
                const player = await getPlayers({
                  page:page,
                  pageSize: 10,
                  search: query,
                });

                return {
                  items: player.list,
                  hasMore: player.list.length > 0,
                }
              }}
              getLabel={(item: Player) => {
                return item.name;
              }}
              onSelect={(item) => {
                setFilters((prev) => {
                  return {...prev, 'match_players.player_id': item.map((player) => player.id).join(",")}
                })
              }}
              placeholder="Select Player Name"
            />
          </div>
          <div class="flex flex-row">
            {filterEntries().map(([key, value]) => {
              if (key === 'match_players.player_id') return;
              return (
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
            )})}
          </div>
        </div>
        <Show when={data().length === 0}>
          <div class="flex justify-center items-center h-screen font-bold text-4xl">
            Empty
          </div>
        </Show>
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

