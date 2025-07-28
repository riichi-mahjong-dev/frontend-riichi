import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { usePagination } from "~/compose/createSearchResource";
import { getMatches } from "~/api/match";
import MatchCard from "../Card/Match";
import { Portal } from "solid-js/web";
import Funnel from "lucide-solid/icons/funnel";
import Cross from "lucide-solid/icons/x";
import { writeDateOnly } from "~/utils/common";

export default function MatchPage() {
  const [showFilters, setShowFilters] = createSignal(false);
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
      {/* Floating filter button (bottom-right) */}
      <button
        onClick={() => setShowFilters(true)}
        class="fixed bottom-6 right-20 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        aria-label="Open Filters"
      >
        <Funnel/>
      </button>

      {/* Modal for filters */}
      <Show when={showFilters()}>
        <Portal>
          <div class="fixed inset-0 z-50 bg-white-700 flex items-center justify-center">
            <div class="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-8 relative">
              <button
                onClick={() => setShowFilters(false)}
                class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                <Cross/>
              </button>
              <h3 class="text-lg font-bold mb-4">Filter Games</h3>
              <FilterPanel
                onApply={(status, start_date, end_date) => {
                  console.log(status, start_date, end_date);
                  if (start_date && end_date) {
                    setFilters({
                      'playing_between': `${writeDateOnly(start_date)},${writeDateOnly(end_date)}`
                    })
                  }
                }}
              />
            </div>
          </div>
        </Portal>
      </Show>
    </main>
  );
}

function FilterPanel(props: {
  onApply: (status?: string, start_date?: Date, end_date?: Date) => void;
}) {
  const [status, setStatus] = createSignal<string>();
  const [startDate, setStartDate] = createSignal<Date>();
  const [endDate, setEndDate] = createSignal<Date>();

  return (
    <form class="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Status filter */}
      <div>
        <label class="block font-medium mb-1">Status</label>
        <select class="w-full border p-2 rounded" onChange={(e) => setStatus(e.currentTarget.value)}>
          <option value="all">All</option>
          <option value="playing">Playing</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Date range filter */}
      <div>
        <label class="block font-medium mb-1">Start Date</label>
        <input type="date" class="w-full border p-2 rounded" onInput={(e) => setStartDate(new Date(e.currentTarget.value))}/>
      </div>
      <div>
        <label class="block font-medium mb-1">End Date</label>
        <input type="date" class="w-full border p-2 rounded" onInput={(e) => setEndDate(new Date(e.currentTarget.value))}/>
      </div>

      <button
        class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded"
        onClick={() => {
          props.onApply(status(), startDate(), endDate());
        }}
      >
        Apply Filters
      </button>
    </form>
  );
}

