import { For, JSX, Show } from "solid-js";
import Button from "../../components/ui/Button";

export type HeaderTable<T> = {
  key: string;
  label: string;
  value?: (row: T) => JSX.Element | string;
};

export type TablePaginationProps<T> = {
  headers: HeaderTable<T>[];
  data: () => T[];
  page: () => number;
  hasMore: () => boolean;
  loading: () => boolean;
  setPage: (fn: (prev: number) => number) => void;
  setData: (key: string, value: string) => string;
  renderActions?: (row: T, index: number) => JSX.Element;
};

const TablePagination = <T,>(props: TablePaginationProps<T>) => {
  return (
    <div class="p-4">
      <div class="overflow-x-auto rounded-xl shadow-sm mt-4 border border-gray-200">
        <table class="min-w-full text-sm text-gray-800">
          <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <For each={props.headers}>
                {(header) => (
                  <th class="px-5 py-3 text-left whitespace-nowrap">
                    <div class="flex items-center gap-1">{header.label}</div>
                  </th>
                )}
              </For>
              <th class="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.data()}>
              {(row, index) => (
                <tr
                  class={`${
                    index() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <For each={props.headers}>
                    {(header) => {
                      let content: JSX.Element | string;

                      if (header.value) {
                        content = header.value(row);
                      } else {
                        const keys = header.key.split(".");
                        let value = keys.reduce((acc: any, key) => acc?.[key] ?? "By Admin", row);
                        content = props.setData(header.key, value);
                      }

                      return <td class="px-5 py-3">{content}</td>;
                    }}
                  </For>
                  <td class="px-5 py-3">
                    <Show when={props.renderActions}>
                      {props.renderActions?.(row, index())}
                    </Show>
                  </td>
                </tr>
              )}
            </For>
            <Show when={props.data().length === 0}>
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
        <span class="text-sm text-gray-500"></span>
        <div class="flex gap-2">
          <Button
            variant="outline"
            onClick={() => props.setPage((p) => Math.max(p - 1, 1))}
            disabled={props.page() === 1}
            isLoading={props.loading()}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => props.setPage((p) => p + 1)}
            disabled={!props.hasMore()}
            isLoading={props.loading()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
