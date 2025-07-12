import { json } from "@solidjs/router";
import { type APIEvent } from "@solidjs/start/server";
import { useSession } from "vinxi/http";

type SessionData = {
  user: number;
  role: string;
}

async function removeSession() {
  const session = await useSession<SessionData>({
    password: 'NYjpat9cF7usLx3gu4vSJNA2pTT1UZifi7l5YgeHLR4=',
    name: 'user',
  });

  await session.clear();
}

export async function POST(event: APIEvent) {
  await removeSession();
  return json({
    'message' : 'logout',
  });
}

