import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import Button from "~/components/ui/Button";
import Pencil from "lucide-solid/icons/pencil";
import Eye from "lucide-solid/icons/eye";
import { writeDate, writeDateOnly } from "~/utils/common";
import { usePagination } from "~/compose/createSearchResource";
import Input from "~/components/ui/Input";
import Search from "lucide-solid/icons/search";
import { getLogs, Log } from "~/api/log";
import Dropdown from "~/components/Layout/Dropdown";
import { MatchFilter } from "~/components/Layout/MatchFilter";
import Funnel from "lucide-solid/icons/funnel";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const {
    data,
    setSearch,
    search,
    page,
    setPage,
    hasMore,
    loading,
    setFilters,
  } = usePagination<Log, any>({
    fetcher: getLogs,
    pageSize: 5,
    initialSort: "-id",
  });

  return (
    <div class="flex flex-col bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div class="text-xl font-bold">
          Table Admin
        </div>
        <div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              navigate('/admin/admin/create')
            }}
          >
            Create
          </Button>
        </div>
      </div>
      <div class="flex flex-row gap-4 p-4">
        <Dropdown
          trigger={(toggle) => (
            <Button
              variant="outline"
              fullWidth
              onClick={toggle}
              leftIcon={<Funnel/>}
            >
            Filter
            </Button>
          )}
        >
        {(toggle) => (
          <div class="p-6">
            <MatchFilter
              onApply={(start_date, end_date) => {
                if (start_date && end_date) {
                  setFilters((prev) => {
                    return {...prev, 'created_between': `${writeDateOnly(start_date)},${writeDateOnly(end_date)}`}
                  });
                  toggle();
                }
              }}
            />
          </div>
        )}
        </Dropdown>
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
      </div>
      <TablePagination
        headers={headers}
        data={data}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        loading={loading}
        setData={(key, value) => {
          if (['created_at', 'updated_at'].includes(key)) {
            return writeDate(new Date(value));
          }
          return value;
        }}
        renderActions={ (data: unknown, index: number) => {
          const parlour = data as Log;
          return (
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/admin/${parlour.id}`)
                }}
              >
                <Eye size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/admin/${parlour.id}/edit`)
                }}
              >
                <Pencil size={16} />
              </Button>
            </div>
          );
        }}
      />
    </div>
  )
}

