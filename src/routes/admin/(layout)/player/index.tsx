import { clientOnly } from "@solidjs/start";
import { getPlayers } from "~/api/player";
import { writeDate } from "~/utils/common";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "username", label: "Username" },
  { key: "rank", label: "Rank" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function PlayerHome() {
  return (
    <div class="bg-white p-8 rounded">
      <TablePagination
        headers={headers}
        fetcher={getPlayers}
        sort="-id"
        searchAble={true}
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
