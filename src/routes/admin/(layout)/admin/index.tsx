import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { getMatches, Match } from "~/api/match";
import Button from "~/components/ui/Button";
import Pencil from "lucide-solid/icons/pencil";
import Trash2 from "lucide-solid/icons/trash-2";
import Eye from "lucide-solid/icons/eye";
import { writeDate } from "~/utils/common";
import { getAdmins } from "~/api/admin";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Username" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div class="flex flex-col bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div>
          Table
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
      <TablePagination
        headers={headers}
        fetcher={getAdmins}
        sort="-id"
        searchAble={true}
        setData={(key, value) => {
          if (['created_at', 'updated_at'].includes(key)) {
            return writeDate(new Date(value));
          }
          return value;
        }}
        renderActions={ (data: unknown, index: number) => {
          const parlour = data as Match;
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
