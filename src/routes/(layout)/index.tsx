import { Meta, Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { createResource, createSignal, For, onMount, Suspense } from "solid-js";
import { PaginateRequest } from "~/api/base";
import { getMatches } from "~/api/match";
import { getParlours } from "~/api/parlour";
import { getPlayers } from "~/api/player";

const MatchCardComp = clientOnly(() => import("~/components/Card/Match"));
const ParlourCardComp = clientOnly(() => import("~/components/Card/Parlour"));
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

  const [parlours, {refetch: refetchParlour}] = createResource(() => ({...params, sort: '-parlours.created_at'}), getParlours, {
    ssrLoadFrom: 'initial'
  });

  onMount(() => {
    refetchMatch();
    refetchRank();
    refetchParlour();
  });

  return (
    <>
      <Title>Mahjong Indonesia</Title>
      <Meta name="description" content="Mahjong Indonesia Match" />
      <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-content">
        <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-content">
          <div class="flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Rankings</label>
                </h2>
                <a href="/ranked" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full">
                <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
                  <For each={ranks()?.list}>
                    {(item, index) => (
                      <PlayerCardComp
                        id={item.id}
                        name={item.name}
                        username={item.username}
                        rank={item.rank}
                      />
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
                <a href="/match" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full">
                <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
                  <For each={matches()?.list}>
                    {(item, index) => (
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
          <div class="flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
              <div class="flex justify-between items-center">
                <h2>
                  <label class="text-4xl text-mj-green-400">Parlours</label>
                </h2>
                <a href="/parlour" class="text-2xl text-mj-green-300">See more</a>
              </div>
              <div class="flex w-full">
                <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
                  <For each={parlours()?.list}>
                    {(item, index) => 
                      <ParlourCardComp
                        id={item.id}
                        name={item.name}
                        country={item.country}
                        province={item.province?.name ?? ""}
                        address={item.address}
                      />
                    }
                  </For>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
