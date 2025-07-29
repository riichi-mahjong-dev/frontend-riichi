
import { For, JSX, Show } from "solid-js";
import Button from "../../components/ui/Button";
import { Params, usePagination } from "~/compose/createSearchResource";
import Input from "../ui/Input";
import Search from "lucide-solid/icons/search";

export type TablePaginationProps<T, TFilters> = {
  headers: { key: string; label: string, }[];
  fetcher: (params: Params<TFilters>) => Promise<{list: Array<T>, has_more: boolean}>;
  sort: string;
  searchAble: boolean;
  setData: (key: string, value: string) => string;
  renderActions?: (row: T, index: number) => JSX.Element;
}

const TablePagination = <T, TFilters extends Record<string, any> = Record<string, any>>(props: TablePaginationProps<T, TFilters>) => {
  const {
    data,
    setSearch,
    search,
    page,
    setPage,
    hasMore,
    loading,
  } = usePagination<T, TFilters>({
    fetcher: props.fetcher,
    pageSize: 5,
    initialSort: props.sort,
    debounceMs: 300,
    scrollData: false,
  });

  return (
    <div class="p-4">
      <Show when={props.searchAble}>
        <Input
          name="search"
          value={search()}
          label="Search"
          onInput={(e) => {
            setSearch(e.currentTarget.value);
          }}
          error={null}
          icon={<Search size={18}/>}
          placeholder="Search..."
        />
      </Show>

      <div class="overflow-x-auto rounded-xl shadow-sm mt-4 border border-gray-200">
        <table class="min-w-full text-sm text-gray-800">
          <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <For each={props.headers}>
                {(header) => (
                  <th
                    class="px-5 py-3 text-left cursor-pointer select-none whitespace-nowrap"
                  >
                    <div class="flex items-center gap-1">
                      {header.label}
                    </div>
                  </th>
                )}
              </For>
              <th class="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={data()}>
              {(data, index) => (
                <tr
                  class={`${
                    index() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <For each={props.headers}>
                    {(items) => {
                      const keys = items.key.split(".");
                      let value = keys.reduce((acc: any, key) => {
                        return acc[key] ?? 'By Admin';
                      }, data);

                      return (
                        <td class="px-5 py-3">{props.setData(items.key, value)}</td>
                      );
                    }}
                  </For>
                  <td class="px-5 py-3">
                    <Show when={props.renderActions}>
                      {props.renderActions?.(data, index())}
                    </Show>
                  </td>
                </tr>
              )}
            </For>
            <Show when={data().length === 0}>
              <tr>
                <td class="px-4 py-4 text-center" colspan={props.headers.length + 1}>
                  No Result
                </td>
              </tr>
            </Show>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-4">
        <span class="text-sm text-gray-500">
        </span>
        <div class="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page() === 1}
            isLoading={loading()}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p + 1, 1))}
            disabled={!hasMore()}
            isLoading={loading()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TablePagination;
