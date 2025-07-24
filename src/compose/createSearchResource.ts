import { createSignal, createEffect } from "solid-js";

type Options<TFilters> = {
  fetcher: (params: {
    page: number;
    pageSize: number;
    search: string;
    sort: string;
    filters: TFilters;
  }) => Promise<any>;
  scrollData?: boolean;
  pageSize?: number;
  initialSort?: string;
  initialFilters?: TFilters;
  debounceMs?: number;
};

export function usePagination<TFilters = Record<string, any>>(options: Options<TFilters>) {
  const [data, setData] = createSignal<Array<any>>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);
  const [finalData, setFinalData] = createSignal<boolean>(false);

  const [search, setSearchRaw] = createSignal("");
  const [sort, setSort] = createSignal(options.initialSort ?? "");
  const [page, setPage] = createSignal(1);
  const [filters, setFilters] = createSignal<TFilters>(options.initialFilters || {} as TFilters);

  const pageSize = options.pageSize ?? 10;

  // Debounce logic
  let debounceTimer: NodeJS.Timeout | null = null;
  const setSearch = (value: string) => {
    setFinalData(false);
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setSearchRaw(value);
      setData([]);
      setPage(1); // reset to first page on new search
    }, options.debounceMs ?? 300);
  };

  let lastParams: string | null = null;

  createEffect(async () => {
    setLoading(true);
    setError(null);

    const params = {
      page: page(),
      pageSize,
      search: search(),
      sort: sort(),
      filters: filters(),
    };

    const serialized = JSON.stringify(params);
    if (serialized === lastParams) return;
    lastParams = serialized;


    options
      .fetcher(params)
      .then((data) => {
        if (options.scrollData) {
          setData((prev) => [...prev, ...data?.list]);
        } else {
          setData(data?.list);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  });

  createEffect(() => {
    if (data().length <= 0) {
      setFinalData(true);
    }
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
    setFinalData,
    finalData,
  };
}
