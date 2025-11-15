import { redirect } from "@solidjs/router";
import { createMiddleware } from "@solidjs/start/middleware";
import { useSession } from "vinxi/http";
import { SessionData } from "~/lib/auth/session";

export default createMiddleware({
  onRequest: async (event) => {
    const url = new URL(event.request.url);
    try {
      const secret_password = import.meta.env.VITE_SESSION_SECRET as string;
      const { data: sessionData } = await useSession<SessionData>({
        password: secret_password,
      });

      const session = Boolean(sessionData.access_token) ? sessionData : null;

      if (!session && url.pathname === "/admin") {
        return redirect("/admin/login");
      }

      if (session?.user?.user_type === "player" && url.pathname === "/admin") {
        return redirect("/");
      }

      if (session && ["/login", "/admin/login"].includes(url.pathname)) {
        return redirect(session.user?.user_type === "player" ? "/" : "/admin");
      }
    } catch (e) {
      console.error(e);
    }
  },
});
