import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";

const CardComp = clientOnly(() => import("~/components/Card"));
const PlayerCardComp = clientOnly(() => import("~/components/Card/Player"));

export default function HomeApp() {
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
                  <PlayerCardComp id={1} name="Kristian Ruben" mr={1000}/>
                  <PlayerCardComp id={2} name="Kristian Ruben" mr={1000}/>
                  <PlayerCardComp id={3} name="Kristian Ruben" mr={1000}/>
                  <PlayerCardComp id={4} name="Kristian Ruben" mr={1000}/>
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
                    <CardComp/>
                    <CardComp/>
                    <CardComp/>
                    <CardComp/>
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
                    <CardComp/>
                    <CardComp/>
                    <CardComp/>
                    <CardComp/>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </main>
  );
}
