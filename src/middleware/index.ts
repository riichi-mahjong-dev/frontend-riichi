import { redirect } from "@solidjs/router";
import { createMiddleware } from "@solidjs/start/middleware";
import { getSessionUser } from "~/lib/auth/session";

export default createMiddleware({
  onRequest: async (event) => {
    const url = new URL(event.request.url);
    try {
      const session = await getSessionUser();

      if (!session && url.pathname === '/admin') {
         return redirect("/admin/login");
      }

      if (session?.user?.user_type === 'player' && url.pathname === '/admin') {
        return redirect("/");
      }

      if (session && ["/login", "/admin/login"].includes(url.pathname)) {
        return redirect(
          session.user?.user_type === "player" ? "/" : "/admin"
        );
      }
      
    } catch (e) {
      console.log(e)
    }
  },
  onBeforeResponse: async (event) => {
  }
});
