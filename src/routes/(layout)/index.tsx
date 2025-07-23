import { clientOnly } from "@solidjs/start";
import { createResource, createSignal, For, onMount, Suspense } from "solid-js";
import { PaginateRequest } from "~/api/base";
import { getMatches } from "~/api/match";
import { getParlours } from "~/api/parlour";
import { getPlayers } from "~/api/player";

const CardComp = clientOnly(() => import("~/components/Card"));
const PlayerCardComp = clientOnly(() => import("~/components/Card/Player"));

export default function HomeApp() {
  const [sortRank, setSortRank] = createSignal<string>('-rank');

  const params: PaginateRequest = {
    page: 1,
    pageSize: 4,
    search: '',
  };

  const [ranks, {refetch: refetchRank}] = createResource(() => ({...params, sort: sortRank()}), getPlayers, {
    ssrLoadFrom: 'initial'
  });

  const [matches, {refetch: refetchMatch}] = createResource(() => ({...params, sort: '-created_at'}), getMatches, {
    ssrLoadFrom: 'initial'
  });

  const [parlours, {refetch: refetchParlour}] = createResource(() => ({...params, sort: '-created_at'}), getParlours, {
    ssrLoadFrom: 'initial'
  });

  onMount(() => {
    refetchMatch();
    refetchRank();
    refetchParlour();
  });

  return (
    <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-content">
        <div class="flex w-full bg-mj-green-400">
          <div class="h-[350px]">
          </div>
        </div>
        <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-content">
          <div class="flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Rankings</label>
                </h2>
                <a href="/ranked" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full scrollable-container">
                <div class="flex flex-row min-w-[930px] lf:gap-2 gap-4 py-10 px-4">
                  <For each={ranks()?.list}>
                    {(item, index) => (
                      <PlayerCardComp id={item.id} name={item.name} mr={item.rank}/>
                    )}
                  </For>
                </div>
              </div>
            </Suspense>
          </div>
          <div class="flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Matches</label>
                </h2>
                <a href="/matches" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full scrollable-container">
                <div class="flex flex-row min-w-[930px] lf:gap-2 gap-4 py-10">
                  <For each={matches()?.list}>
                    {(item, index) => 
                      <CardComp/>
                    }
                  </For>
                </div>
              </div>
            </Suspense>
          </div>
          <div class="flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Parlours</label>
                </h2>
                <a href="/parlour" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full scrollable-container">
                <div class="flex flex-row min-w-[930px] lf:gap-2 gap-4 py-10">
                  <For each={parlours()?.list}>
                    {(item, index) => 
                      <CardComp/>
                    }
                  </For>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </main>
  );
}
