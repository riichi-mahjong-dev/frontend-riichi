
import { createSignal, createMemo, For, Show, onMount } from "solid-js";
import Input from "../../components/Form/InputField";
import Button from "../../components/ui/Button";
import ChevronUp from "lucide-solid/icons/chevron-up";
import ChevronDown from "lucide-solid/icons/chevron-down";
import Pencil from "lucide-solid/icons/pencil";
import Trash2 from "lucide-solid/icons/trash-2";
import { usePagination } from "~/compose/createSearchResource";
import { getPlayers } from "~/api/player";

type Player = {
  id: number;
  name: string;
  username: string;
  rank: string;
};

export default function TablePagination() {
  const {
    data,
    setSort,
    sort,
    setSearch,
    page,
    setPage,
  } = usePagination({
    fetcher: getPlayers,
    pageSize: 10,
    initialSort: "-rank",
    debounceMs: 300,
    scrollData: false,
  });

  const toggleSort = (field: keyof Player) => {
    let sortField = sort();
    let order = 'asc';
    if (sortField[0] === '-') {
      sortField = sortField.slice(1);
      order = 'desc';
    }

    if (sortField === field) {
      setSort(order === 'asc' ? `-${sortField}` : sortField);
    } else {
      setSort(sortField);
    }
  };

  const headers: { key: keyof Player; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "rank", label: "Rank" },
  ];

  return (
    <div class="p-4">
      <Input
        placeholder="Search..."
        onInput={setSearch}
      />

      <div class="overflow-x-auto rounded-xl shadow-sm mt-4 border border-gray-200">
        <table class="min-w-full text-sm text-gray-800">
          <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <For each={headers}>
                {(header) => (
                  <th
                    class="px-5 py-3 text-left cursor-pointer select-none whitespace-nowrap"
                    onClick={() => toggleSort(header.key)}
                  >
                    <div class="flex items-center gap-1">
                      {header.label}
                      <Show when={sort() === header.key}>
                        {sortOrder() === "asc" ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </Show>
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
                  <td class="px-5 py-3">{player.id}</td>
                  <td class="px-5 py-3">{player.name}</td>
                  <td class="px-5 py-3">{player.username}</td>
                  <td class="px-5 py-3">{player.rank}</td>
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
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
