import { clientOnly } from "@solidjs/start";
import { getParlours, Parlour } from "~/api/parlour";
import Button from "~/components/ui/Button";
import { writeDate } from "~/utils/common";
import Pencil from "lucide-solid/icons/pencil";
import Trash2 from "lucide-solid/icons/trash-2";
import Eye from "lucide-solid/icons/eye";
import { useNavigate } from "@solidjs/router";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

const headers: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Parlour Name"},
  { key: "address", label: "Address"},
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

export default function ParlourHome() {
  const navigate = useNavigate();

  return (
    <div class="bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div>
          Table
        </div>
        <div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              console.log("test");
              navigate('/admin/parlour/create')
            }}
          >
            Create
          </Button>
        </div>
      </div>
      <TablePagination
        headers={headers}
        fetcher={getParlours}
        sort="-id"
        searchAble={true}
        setData={(key, value) => {
          if (['created_at', 'updated_at'].includes(key)) {
            return writeDate(new Date(value));
          }
          return value;
        }}
        renderActions={ (data: unknown, index: number) => {
          const parlour = data as Parlour;
          return (
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/parlour/${parlour.id}`)
                }}
              >
                <Eye size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/parlour/${parlour.id}/edit`)
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
