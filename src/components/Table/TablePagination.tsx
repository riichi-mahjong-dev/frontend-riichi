
import { For, Show } from "solid-js";
import Input from "../../components/Form/InputField";
import Button from "../../components/ui/Button";
import Pencil from "lucide-solid/icons/pencil";
import Trash2 from "lucide-solid/icons/trash-2";
import { Params, usePagination } from "~/compose/createSearchResource";

export type TablePaginationProps<T, TFilters> = {
  headers: { key: string; label: string, }[];
  fetcher: (params: Params<TFilters>) => Promise<{list: Array<T>, has_more: boolean}>;
  sort: string;
  searchAble: boolean;
  setData: (key: string, value: string) => string;
}

export default function TablePagination<T, TFilters>(props: TablePaginationProps<T, TFilters>) {
  const {
    data,
    setSearch,
    page,
    setPage,
    hasMore,
  } = usePagination({
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
          placeholder="Search..."
          onInput={setSearch}
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
              {(player, index) => (
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
                      }, player);

                      return (
                        <td class="px-5 py-3">{props.setData(items.key, value)}</td>
                      );
                    }}
                  </For>
                  <td class="px-5 py-3">
                    <div class="flex gap-2">
                      <Button size="sm" variant="outline" class="hover:bg-gray-200">
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" variant="destructive" class="hover:bg-red-100">
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p + 1, 1))}
            disabled={!hasMore()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
