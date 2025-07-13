import { createAsync } from "@solidjs/router";
import { pageOnlyFor } from "~/lib/auth/session";

export default function AdminPage() {
  createAsync(() => pageOnlyFor(['admin', 'super-admin'], '/admin/login'));

  return (
    <div>Hello Admin</div>
  );
}
