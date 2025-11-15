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
import PinTileLoader from "../ui/Loading";

export default function MatchPage() {
  const { data, setPage, hasMore, loading, setFilters, filterEntries } =
    usePagination({
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
  };

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
                  leftIcon={<Funnel />}
                >
                  Filter
                </Button>
              )}
            >
              {(toggle) => (
                <div class="p-6">
                  <MatchFilter
                    onApply={(start_date, end_date) => {
                      if (start_date && end_date) {
                        setFilters((prev) => {
                          return {
                            ...prev,
                            playing_between: `${writeDateOnly(start_date)},${writeDateOnly(end_date)}`,
                          };
                        });
                        toggle();
                      }
                    }}
                  />
                </div>
              )}
            </Dropdown>
            <SearchDropdown
              multi
              fetchData={async (query, page) => {
                const player = await getPlayers({
                  page: page,
                  pageSize: 10,
                  search: query,
                });

                return {
                  items: player.list,
                  hasMore: player.list.length > 0,
                };
              }}
              getLabel={(item: Player) => {
                return item.name;
              }}
              onSelect={(item) => {
                setFilters((prev) => {
                  return {
                    ...prev,
                    "match_players.player_id": item
                      .map((player) => player.id)
                      .join(","),
                  };
                });
              }}
              placeholder="Select Player Name"
            />
          </div>
          <div class="flex flex-row">
            {filterEntries().map(([key, value]) => {
              if (key === "match_players.player_id") return;
              return (
                <div class="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-md">
                  <span>
                    {key}: {value}
                  </span>
                  <button
                    class="ml-2 text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setFilters((prev) => {
                        const updated = { ...prev };
                        delete updated[key];
                        return updated;
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <Show when={data().length === 0}>
          <div class="flex flex-col gap-3 items-center justify-center h-screen">
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
            <span class="font-bold text-xl">No Match Found</span>
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
          <div class="flex flex-row items-center justify-center">
            <PinTileLoader />
          </div>
        </Show>
      </div>
    </main>
  );
}
