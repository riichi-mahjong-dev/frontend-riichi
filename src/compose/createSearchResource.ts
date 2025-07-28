import { createSignal, createEffect } from "solid-js";

export type Params<TFilters> = {
    page: number;
    pageSize: number;
    search: string;
    sort: string;
    filter: TFilters;
}

type Options<TFilters, T> = {
  fetcher: (params: Params<TFilters>) => Promise<{list: Array<T>; has_more: boolean;}>;
  scrollData?: boolean;
  pageSize?: number;
  initialSort?: string;
  initialFilters?: TFilters;
  debounceMs?: number;
};

export function usePagination<T, TFilters extends Record<string, any> = Record<string, any>>(options: Options<TFilters, T>) {
  const [data, setData] = createSignal<Array<T>>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [hasMore, setHasMore] = createSignal<boolean>(false);

  const [search, setSearchRaw] = createSignal("");
  const [sort, setSort] = createSignal(options.initialSort ?? "");
  const [page, setPage] = createSignal(1);
  const [filters, setFilters] = createSignal<TFilters>(options.initialFilters || {} as TFilters);

  const pageSize = options.pageSize ?? 10;

  // Debounce logic
  let debounceTimer: NodeJS.Timeout | null = null;
  const setSearch = (value: string) => {
    setHasMore(false);
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setSearchRaw(value);
      setData([]);
      setPage(1); // reset to first page on new search
    }, options.debounceMs ?? 300);
  };

  let lastParams: string | null = null;

  createEffect(() => {
    if (filters()) {
      setData([]);
      setPage(1);
    }
  });

  createEffect(async () => {
    const currentPage = page();
    const currentSearch = search();
    const currentSort = sort();
    const currentFilters = filters();

    const params = {
      page: currentPage,
      pageSize,
      search: currentSearch,
      sort: currentSort,
      filter: currentFilters,
    };
    const serialized = JSON.stringify(params);
    if (serialized === lastParams) return;
    lastParams = serialized;

    setLoading(true);
    setError(null);

    options
      .fetcher(params)
      .then((data) => {
        console.log(data);
        setHasMore(data.has_more);
        if (options.scrollData) {
          setData((prev) => [...prev, ...data?.list]);
        } else {
          setData(data?.list);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  });

  return {
    data,
    loading,
    error,
    page,
    setPage,
    sort,
    setSort,
    filters,
    setFilters,
    search,
    setSearch,
    setHasMore,
    hasMore,
    filterEntries: () => Object.entries(filters()).filter(([_, v]) => v !== "" && v != null),
  };
}
