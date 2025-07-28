import { createResource, For, onMount, Suspense } from "solid-js";
import { PaginateRequest } from "~/api/base";
import PlayerCard from "../Card/Player";
import { getPlayers } from "~/api/player";

export default function RankingLayout() {
  const params: PaginateRequest = {
    page: 1,
    pageSize: 5,
    search: '',
  };

  const [ranks, {refetch: refetchRank}] = createResource(() => ({...params, sort: '-rank'}), getPlayers, {
    ssrLoadFrom: 'initial'
  });

  onMount(() => {
    refetchRank();
  });

  return (
    <div class="flex flex-col">
        <div class="flex justify-between players-center">
          <h2>
            <label class="text-4xl font-bold text-mj-green-400">Rankings</label>
          </h2>
        </div>
        <div class="flex flex-col w-full">
          <Suspense fallback={<div class="flex items-center justify-center h-40 w-full font-bold">Loading...</div>}>
            <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
              <For each={ranks()?.list}>
                {(player) => (
                  <PlayerCard
                    id={player.id}
                    name={player.name}
                    username={player.username}
                    rank={player.rank}
                  />
                )}
              </For>
            </div>
            <a href="/ranked" class="font-bold">see more</a>
          </Suspense>
        </div>
    </div>
  );
}
