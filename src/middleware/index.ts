import { redirect } from "@solidjs/router";
import { createMiddleware } from "@solidjs/start/middleware";
import { useSession } from "vinxi/http";

type SessionData = {
  user: number;
  role: string;
}

async function session() {
  const session = await useSession<SessionData>({
    password: 'NYjpat9cF7usLx3gu4vSJNA2pTT1UZifi7l5YgeHLR4=',
    name: 'user',
  });

}
export default createMiddleware({
  onRequest: async (event) => {
    await session();
  },
  onBeforeResponse: (event) => {
  }
});
