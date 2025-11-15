import { createResource, For, onMount, Suspense } from "solid-js";
import { PaginateRequest } from "~/api/base";
import MatchCard from "../Card/Match";
import { getMatches } from "~/api/match";

export default function MatchLayout() {
  const params: PaginateRequest = {
    page: 1,
    pageSize: 5,
    search: "",
  };

  const [matches, { refetch: refetchMatch }] = createResource(
    () => ({ ...params, sort: "-created_at" }),
    getMatches,
    {
      ssrLoadFrom: "initial",
    },
  );

  onMount(() => {
    refetchMatch();
  });

  return (
    <div class="flex flex-col">
      <div class="flex justify-between items-center">
        <h2>
          <label class="text-4xl font-bold text-mj-green-400">Matches</label>
        </h2>
      </div>
      <div class="flex flex-col w-full">
        <Suspense
          fallback={
            <div class="flex items-center justify-center h-40 w-full font-bold">
              Loading...
            </div>
          }
        >
          <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
            <For each={matches()?.list}>
              {(item) => (
                <MatchCard
                  id={item.id}
                  players={item.match_players}
                  playing_at={item.playing_at}
                  parlour_name={item.parlour?.name ?? ""}
                  created_by={item.creator}
                />
              )}
            </For>
          </div>
          <a href="/match" class="font-bold">
            see more
          </a>
        </Suspense>
      </div>
    </div>
  );
}
