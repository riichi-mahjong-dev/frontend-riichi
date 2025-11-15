import { Title } from "@solidjs/meta";
import { createAsync, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createResource, For, onMount, Suspense } from "solid-js";
import { getMatches } from "~/api/match";
import { getPlayerById } from "~/api/player";
const MatchCardComp = clientOnly(() => import("~/components/Card/Match"));

export default function PlayerDetail() {
  const params = useParams();
  const player = createAsync(() => getPlayerById(Number(params.id)));

  const [matches, { refetch: refetchMatch }] = createResource(
    () => ({
      page: 1,
      pageSize: 10,
      sort: "-created_at",
      filter: {
        "match_players.player_id": params.id ?? "",
      },
    }),
    getMatches,
    {
      ssrLoadFrom: "initial",
    },
  );

  onMount(() => {
    refetchMatch();
  });

  return (
    <>
      <Suspense fallback={<span>Loading</span>}>
        <Title>Player: {player()?.username}</Title>
        <div class="min-h-screen flex flex-col gap-16 w-full px-4 max-w-[930px] mx-auto pt-10">
          <div class="backdrop-blur-xl bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-8 transition-all w-full">
            <div class="text-center mb-8">
              <h1 class="text-4xl font-extrabold text-gray-800 dark:text-white">
                {player()?.name}
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-xl mt-1">
                @{player()?.username}
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300 text-base">
              <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Rank
                </span>
                <span class="font-semibold text-lg">{player()?.rank}</span>
              </div>
              <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Province
                </span>
                <span class="font-semibold text-lg">
                  {player()?.province?.name}
                </span>
              </div>
              <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Country
                </span>
                <span class="font-semibold text-lg">{player()?.country}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Recent Match</label>
                </h2>
              </div>
              <div class="flex w-full">
                <div class="flex flex-col w-full lf:gap-2 gap-10 py-10">
                  <For each={matches()?.list}>
                    {(item) => (
                      <MatchCardComp
                        id={item.id}
                        players={item.match_players}
                        playing_at={item.playing_at}
                        parlour_name={item.parlour?.name ?? ""}
                        created_by={item.creator}
                      />
                    )}
                  </For>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </Suspense>
    </>
  );
}
