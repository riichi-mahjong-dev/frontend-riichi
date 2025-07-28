import {
  createSignal,
  createEffect,
  For,
  Show,
  onCleanup,
  Accessor,
} from "solid-js";
import { debounce } from "@solid-primitives/scheduled";

type FetchResult<T> = {
  items: T[];
  hasMore: boolean;
};

interface BaseProps<T> {
  label?: string;
  placeholder?: string;
  fetchData: (query: string, page: number) => Promise<FetchResult<T>>;
  getLabel?: (item: T) => string;
  disabledIds?: number[];
  error?: Accessor<string | null>;
  defaultSelected?: T | T[];
  readonly?: boolean;
}

interface SingleSelectProps<T> extends BaseProps<T> {
  multi?: false;
  onSelect?: (item: T) => void;
}

interface MultiSelectProps<T> extends BaseProps<T> {
  multi: true;
  onSelect?: (items: T[]) => void;
}

type SearchableDropdownProps<T> = SingleSelectProps<T> | MultiSelectProps<T>;


export default function SearchDropdown<T>(props: SearchableDropdownProps<T>) {
  const [query, setQuery] = createSignal("");
  const [results, setResults] = createSignal<T[]>([]);
  const [page, setPage] = createSignal(1);
  const [hasMore, setHasMore] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [showDropdown, setShowDropdown] = createSignal(false);
  const [highlightedIndex, setHighlightedIndex] = createSignal<number>(-1);
  const [selectedItems, setSelectedItems] = createSignal<T[]>(
    Array.isArray(props.defaultSelected)
      ? props.defaultSelected
      : props.defaultSelected
      ? [props.defaultSelected]
      : []
  );

  let observerRef: IntersectionObserver | null = null;

  const loadData = async (q: string, p: number) => {
    if (!q || !props.fetchData) return;
    setLoading(true);
    setHighlightedIndex(-1);
    try {
      const data = await props.fetchData(q, p);
      const filtered = data.items;

      if (p === 1) {
        setResults(filtered || []);
      } else {
        setResults((prev) => [...prev, ...(filtered || [])]);
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
    loadData(query(), 1);
    setPage(1);
    setHasMore(true);
  }, 200);

  createEffect(() => {
    setSelectedItems(Array.isArray(props.defaultSelected)
      ? props.defaultSelected
      : props.defaultSelected
      ? [props.defaultSelected]
      : []);
  });

  createEffect(() => {
    if (!query().trim()) {
      setResults([]);
      return;
    }
    if (query().trim().length > 1) {
      triggerSearch();
    }
  });

  createEffect(() => {
    if (!props.multi && props.defaultSelected) {
      const label = props.getLabel?.(props.defaultSelected as T) ?? String(props.defaultSelected);
      setQuery(label);
    }
  });

  const setupObserver = (node: Element) => {
    if (observerRef) observerRef.disconnect();

    observerRef = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore() && !loading()) {
        const nextPage = page() + 1;
        setPage(nextPage);
        loadData(query(), nextPage);
      }
    });

    if (node) observerRef.observe(node);
    onCleanup(() => observerRef?.disconnect());
  };

  const toggleSelect = (item: T) => {

    if (props.readonly) return;

    if (props.multi) {
      const exists = selectedItems().some(
        (s) => props.getLabel?.(s) === props.getLabel?.(item)
      );
      const updated = exists
        ? selectedItems().filter((s) => props.getLabel?.(s) !== props.getLabel?.(item))
        : [...selectedItems(), item];

      setSelectedItems(updated);
      props.onSelect?.(updated);

      if (!exists) {
        setQuery("");
        setResults([]);
        setHighlightedIndex(-1);
      }
    } else {
      setSelectedItems([item]);
      setQuery(props.getLabel?.(item) ?? String(item));
      setShowDropdown(false);
      props.onSelect?.(item);
    }
  };

  return (
    <div class="w-full relative my-2">
      <Show when={props.label}>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {props.label}
        </label>
      </Show>

      <div class="relative w-full">
        <input
          type="text"
          class="w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder={props.placeholder || "Search..."}
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          disabled={props.readonly}
          value={query()}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            const items = results();
            const index = highlightedIndex();

            if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextIndex = index < items.length - 1 ? index + 1 : 0;
              setHighlightedIndex(nextIndex);
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              const prevIndex = index > 0 ? index - 1 : items.length - 1;
              setHighlightedIndex(prevIndex);
            }

            if (e.key === "Enter" || e.key === "Tab") {
              const selected = results()[highlightedIndex()];
              if (selected) {
                e.preventDefault();
                toggleSelect(selected);
                setQuery("");
                setResults([]);
                setHighlightedIndex(-1);
              } else {
                setShowDropdown(false);
              }
            }
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => {
            setShowDropdown(false);
            setHighlightedIndex(-1);
          }, 150)}
        />
      </div>
      <Show when={props.multi && selectedItems().length > 0}>
        <div class="mt-3 flex flex-wrap gap-2 border border-gray-200 p-2 rounded-md bg-gray-50">
          <For each={selectedItems()}>{(item) => (
            <div class="flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              <span>{props.getLabel?.(item) ?? String(item)}</span>
              <Show when={!props.readonly}>
                <button
                  type="button"
                  class="text-blue-600 hover:text-blue-800 focus:outline-none"
                  onClick={() => {
                    if (props.multi) {
                      const updated = selectedItems().filter(
                        (s) => props.getLabel?.(s) !== props.getLabel?.(item)
                      );
                      setSelectedItems(updated);
                      props.onSelect?.(updated);
                    }
                  }}
                >
                  ✕
                </button>
              </Show>
            </div>
          )}</For>
        </div>
      </Show>

      <Show when={!props.readonly && showDropdown() && query()}>
        <div class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm">
          <Show
            when={results().length > 0}
            fallback={<div class="px-4 py-3 text-gray-400">No results found.</div>}
          >
            <ul>
              <For each={results()}>
                {(item, i) => {
                  const index = i();
                  const selected = selectedItems().some(
                    (s) => props.getLabel?.(s) === props.getLabel?.(item)
                  );
                  return (
                    <li
                      class={`px-4 py-4 cursor-pointer flex justify-between items-center hover:bg-blue-100 ${
                        selected ? "bg-blue-50" : ""
                      } ${highlightedIndex() === index ? "bg-blue-100" : ""}`}
                      onMouseDown={() => toggleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(i)}
                    >
                      <span>{props.getLabel?.(item) ?? String(item)}</span>
                      <Show when={selected}>
                        <svg
                          class="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </Show>
                    </li>
                  );
                }}
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
        <span class="text-rose-700 text-sm mt-1 block">
          {props.error && props.error()}
        </span>
      </Show>
    </div>
  );
}
