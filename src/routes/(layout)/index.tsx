import { Meta, Title } from "@solidjs/meta";
import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";

const ParlourLayout = clientOnly(() => import("~/components/Layout/ParlourLayout"));
const MatchLayout = clientOnly(() => import("~/components/Layout/MatchLayout"));
const RankingLayout = clientOnly(() => import("~/components/Layout/RankingLayout"));


export default function HomeApp() {
  return (
    <>
      <Title>Mahjong Indonesia</Title>
      <Meta name="description" content="Mahjong Indonesia Match" />
      <main class="flex flex-col w-full text-center mx-auto text-gray-700 bg-content">
        <div class="flex flex-col gap-4 xl:w-[930px] w-full xl:px-0 px-8 py-8 mx-auto bg-content">
          <Suspense fallback={<div class="flex items-center justify-center h-40 w-full bg-white"></div>}>
            <RankingLayout/>
          </Suspense>
          <Suspense fallback={<div class="flex items-center justify-center h-40 w-full bg-white"></div>}>
            <MatchLayout/>
          </Suspense>
          <Suspense fallback={<div class="flex items-center justify-center h-40 w-full bg-white"></div>}>
            <ParlourLayout/>
          </Suspense>
        </div>
      </main>
    </>
  );
}
