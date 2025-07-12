import { json } from "@solidjs/router";
import { type APIEvent } from "@solidjs/start/server";
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

  await session.update({
    user: 1,
    role: 'user',
  });

  return session;
}

export async function POST(event: APIEvent) {
  const user = await session();
  return json(user.data);
}
