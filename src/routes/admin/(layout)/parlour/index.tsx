import { clientOnly } from "@solidjs/start";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

export default function ParlourHome() {
  return (
    <div class="bg-white p-8 rounded">
      <TablePagination/>
    </div>
  )
}
