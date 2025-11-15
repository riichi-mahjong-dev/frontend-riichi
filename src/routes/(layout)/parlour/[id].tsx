import { Title } from "@solidjs/meta";
import { createAsync, useParams } from "@solidjs/router";
import { getParlourById } from "~/api/parlour";

export default function ParlourDetail() {
  const params = useParams();
  const parlour = createAsync(() => getParlourById(Number(params.id)));

  return (
    <>
      <Title>Parlour: {parlour()?.name}</Title>
      <div class="min-h-screen bg-linear-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex justify-center">
        <div class="w-full  max-w-[930px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {parlour()?.name}
            </h1>
          </div>

          {/* Detail Grid */}
          <div class="grid grid-cols-1 gap-4 text-sm text-gray-800 dark:text-gray-200">
            <div>
              <span class="text-gray-500 dark:text-gray-400">🌍 Country:</span>
              <div class="font-medium">{parlour()?.country}</div>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">🏘️ Province:</span>
              <div class="font-medium">{parlour()?.province?.name}</div>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">🗺️ Address:</span>
              <div class="font-medium truncate" title={parlour()?.address}>
                {parlour()?.address}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
