
import { createSignal, createMemo, For, Show } from "solid-js";
import Input from "../../components/Form/InputField";
import Button from "../../components/ui/Button";
import ChevronUp from "lucide-solid/icons/chevron-up";
import ChevronDown from "lucide-solid/icons/chevron-down";
import Pencil from "lucide-solid/icons/pencil";
import Trash2 from "lucide-solid/icons/trash-2";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const data: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Editor" },
  // Add more data here...
];

export default function TablePagination() {
  const [search, setSearch] = createSignal("");
  const [page, setPage] = createSignal(1);
  const pageSize = 5;

  const [sortField, setSortField] = createSignal<keyof User>("id");
  const [sortOrder, setSortOrder] = createSignal<"asc" | "desc">("asc");

  const filteredData = createMemo(() => {
    const term = search().toLowerCase();
    return data.filter((d) =>
      Object.values(d).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  });

  const sortedData = createMemo(() => {
    const field = sortField();
    const order = sortOrder();
    return [...filteredData()].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
  });

  const paginatedData = createMemo(() => {
    const start = (page() - 1) * pageSize;
    return sortedData().slice(start, start + pageSize);
  });

  const totalPages = createMemo(() =>
    Math.ceil(filteredData().length / pageSize)
  );

  const toggleSort = (field: keyof User) => {
    if (sortField() === field) {
      setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const headers: { key: keyof User; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  return (
    <div class="p-4">
      <Input
        placeholder="Search..."
        value={search}
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
                      <Show when={sortField() === header.key}>
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
            <For each={paginatedData()}>
              {(user, index) => (
                <tr
                  class={`${
                    index() % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td class="px-5 py-3">{user.id}</td>
                  <td class="px-5 py-3">{user.name}</td>
                  <td class="px-5 py-3">{user.email}</td>
                  <td class="px-5 py-3">{user.role}</td>
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
          Page {page()} of {totalPages()}
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
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages()))
            }
            disabled={page() === totalPages()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
