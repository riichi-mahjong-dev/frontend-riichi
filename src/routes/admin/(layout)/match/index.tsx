import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { getMatches } from "~/api/match";
import { writeDate } from "~/utils/common";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "creator.name", label: "Creator Name" },
  { key: "parlour.name", label: "Parlour Name" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function MatchHome() {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div>
          Table
        </div>
        <div>
          <button
            onClick={() => {
              navigate('/admin/match/create')
            }}
          >
            Create
          </button>
        </div>
      </div>
      <TablePagination
        headers={headers}
        fetcher={getMatches}
        sort="-id"
        searchAble={false}
        setData={(key, value) => {
          if (['created_at', 'updated_at'].includes(key)) {
            return writeDate(new Date(value));
          }
          return value;
        }}
      />
    </div>
  )
}
