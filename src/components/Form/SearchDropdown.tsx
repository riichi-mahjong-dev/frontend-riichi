import { debounce } from "@solid-primitives/scheduled";
import { Accessor, createEffect, createSignal, For, onCleanup, Show } from "solid-js";

type FetchResult<T> = {
  items: T[];
  hasMore: boolean;
};

interface SearchableDropdownProps<T> {
  placeholder?: string;
  fetchData: (query: string, page: number) => Promise<FetchResult<T>>;
  getLabel?: (item: T) => string;
  onSelect?: (item: T) => void;
  disabledIds?: number[];
  error?: Accessor<string | null>;
}

export default function SearchDropdown<T>(props: SearchableDropdownProps<T>) {
const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<T[]>([]);
  const [page, setPage] = createSignal(1);
  const [hasMore, setHasMore] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [showDropdown, setShowDropdown] = createSignal(false);

  let observerRef: IntersectionObserver | null = null;

  const loadData = async (q: string, p: number) => {
    if (!q || !props.fetchData) return;
    setLoading(true);
    try {
      const data = await props.fetchData(q, p);
      if (p === 1) {
        setResults(data.items || []);
      } else {
        setResults((prev) => [...prev, ...(data.items || [])]);
      }
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      console.error("Data fetch error:", err);
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const triggerSearch = debounce(() => {
    loadData(query(), page());
    setPage(1);
    setHasMore(true);
  }, 200);

  // Fetch when query or page changes
  createEffect(() => {
    triggerSearch.clear();
    if (query().trim().length > 1) {
      triggerSearch();
    }
  });

  const setupObserver = (node: Element) => {
    if (observerRef) observerRef.disconnect();

    observerRef = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore() && !loading()) {
        setPage((p) => p + 1);
      }
    });

    if (node) observerRef.observe(node);
    onCleanup(() => observerRef?.disconnect());
  };
  const handleSelect = (item: T) => {
    const label = props.getLabel?.(item) ?? String(item);
    setQuery(label);
    setShowDropdown(false);
    props.onSelect?.(item);
  };
  return (
    <div class={`w-full relative my-2`}>
      <div class={`relative w-full border ${props.error && props.error() ? 'border-rose-700' : 'border-mj-green-400'}`}>
        {/* Search icon */}
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </span>

        {/* Input */}
        <input
          type="text"
          class="w-full pl-12 pr-4 py-3 rounded-sm border border-gray-300 bg-white text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          placeholder={props.placeholder || "Search..."}
          value={query()}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
      </div>

      {/* Dropdown */}
      <Show when={showDropdown() && query()}>
        <div class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto text-base sm:text-sm">
          <Show
            when={results().length > 0}
            fallback={<div class="px-4 py-3 text-gray-400">No results found.</div>}
          >
            <ul>
              <For each={results()}>
                {(item) => (
                  <li
                    class="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors"
                    onMouseDown={() => handleSelect(item)}
                  >
                    {props.getLabel?.(item) ?? String(item)}
                  </li>
                )}
              </For>
              <div ref={setupObserver} />
            </ul>
          </Show>
          <Show when={loading()}>
            <div class="px-4 py-3 text-gray-500">Loading...</div>
          </Show>
        </div>
      </Show>
      <Show when={props.error && props.error()}>
          <span class="text-rose-700">
              {props.error && props.error()}
          </span>
      </Show>
    </div>
  );
}
