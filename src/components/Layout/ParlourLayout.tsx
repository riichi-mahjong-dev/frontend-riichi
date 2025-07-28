import { createResource, For, onMount, Suspense } from "solid-js";
import { PaginateRequest } from "~/api/base";
import { getParlours } from "~/api/parlour";
import ParlourCard from "../Card/Parlour";

export default function ParlourLayout() {
  const params: PaginateRequest = {
    page: 1,
    pageSize: 5,
    search: '',
  };

  const [parlours, {refetch: refetchParlour}] = createResource(() => ({...params, sort: '-parlours.created_at'}), getParlours, {
    ssrLoadFrom: 'initial'
  });

  onMount(() => {
    refetchParlour();
  });

  return (
    <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <h2>
            <label class="text-4xl font-bold text-mj-green-400">Parlours</label>
          </h2>
        </div>
        <div class="flex flex-col w-full">
          <Suspense fallback={<div class="flex items-center justify-center h-40 w-full font-bold">Loading...</div>}>
            <div class="flex flex-col w-full lf:gap-2 gap-4 py-10">
              <For each={parlours()?.list}>
                {(parlour) => 
                  <ParlourCard
                    id={parlour.id}
                    name={parlour.name}
                    country={parlour.country}
                    province={parlour.province?.name ?? ""}
                    address={parlour.address}
                  />
                }
              </For>
            </div>
            <a href="/parlour" class="font-bold">see more</a>
          </Suspense>
        </div>
    </div>
  );
}
