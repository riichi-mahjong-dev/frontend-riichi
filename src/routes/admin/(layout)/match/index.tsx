import { clientOnly } from "@solidjs/start";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

export default function MatchHome() {
  return (
    <div>
      <TablePagination/>
    </div>
  )
}
