import { clientOnly } from "@solidjs/start";
import { getParlours, Parlour } from "~/api/parlour";
import Button from "~/components/ui/Button";
import { writeDate } from "~/utils/common";
import Pencil from "lucide-solid/icons/pencil";
import Eye from "lucide-solid/icons/eye";
import { useNavigate } from "@solidjs/router";
import { usePagination } from "~/compose/createSearchResource";
import Input from "~/components/ui/Input";
import Search from "lucide-solid/icons/search";

const TablePagination = clientOnly(
  () => import("~/components/Table/TablePagination"),
);

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Parlour Name" },
  { key: "address", label: "Address" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function ParlourHome() {
  const navigate = useNavigate();
  const { data, setSearch, search, page, setPage, hasMore, loading } =
    usePagination<Parlour, any>({
      fetcher: getParlours,
      pageSize: 5,
      initialSort: "-id",
    });

  return (
    <div class="bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div class="text-xl font-bold">Table Parlour</div>
        <div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              navigate("/admin/parlour/create");
            }}
          >
            Create
          </Button>
        </div>
      </div>
      <div class="p-4">
        <Input
          name="search"
          value={search()}
          label="Search"
          onInput={(e) => {
            setSearch(e.currentTarget.value);
          }}
          error={null}
          icon={<Search size={18} />}
          placeholder="Search..."
        />
      </div>
      <TablePagination
        headers={headers}
        setData={(key, value) => {
          if (["created_at", "updated_at"].includes(key)) {
            return writeDate(new Date(value));
          }
          return value;
        }}
        data={data}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        loading={loading}
        renderActions={(data: unknown, index: number) => {
          const parlour = data as Parlour;
          return (
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/parlour/${parlour.id}`);
                }}
              >
                <Eye size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/parlour/${parlour.id}/edit`);
                }}
              >
                <Pencil size={16} />
              </Button>
            </div>
          );
        }}
      />
    </div>
  );
}
