
import { Title } from "@solidjs/meta";
import { createAsync, useParams } from "@solidjs/router";
import { For, Index, Show } from "solid-js";
import { getMatchById } from "~/api/match";
import { useUser } from "~/components/context/UserContext";
import Pencil from "lucide-solid/icons/pencil";

export default function MatchDetail() {
  const params = useParams();
  const match = createAsync(() => getMatchById(Number(params.id)));
  const [user] = useUser();

  return (
    <>
      <Title>Match from {match()?.creator?.name ?? 'Admin'}</Title>
      <div class="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-6 flex flex-col items-center">
        <div class="w-full max-w-[930px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-8">
        
          {/* Header */}
          <div class="flex flex-row items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Match Details</h1>
            <Show when={user.userId === match()?.created_by}>
              <a
                href={`/match/${params.id}/edit`}
                class="text-blue-600 hover:text-blue-800 ml-2"
                onClick={(e) => e.stopPropagation()} // prevent navigating to match page
              >
                <Pencil size={16} />
              </a>
            </Show>
          </div>

          {/* Players */}
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Players</h2>
            <div class="grid grid-col-1 sm:grid-cols-2 gap-4">
              <Index each={match()?.match_players}>
                {(match_player) => (
                  <a href={`/player/${match_player().player.id}`} class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm shadow-sm text-gray-800 dark:text-gray-100">
                    <div class="font-medium">{match_player().player.name}</div>
                    <div class="text-gray-500 dark:text-gray-400 text-xs">@{match_player().player.username}</div>
                  </a>
                )}
              </Index>
            </div>
          </div>

          {/* Match Info */}
          <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div class="flex gap-2">
              <span class="text-gray-500 dark:text-gray-400">📍 Location:</span>
              <span>{match()?.parlour?.name}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-gray-500 dark:text-gray-400">🗺️ Address:</span>
              <span class="truncate max-w-[600px]" title={match()?.parlour?.address}>{match()?.parlour?.address}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-gray-500 dark:text-gray-400">🏘️ Province:</span>
              <span>{match()?.parlour?.province?.name ?? '-'}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-gray-500 dark:text-gray-400">📅 Date:</span>
              <span>{match()?.playing_at}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-gray-500 dark:text-gray-400">👤 Creator:</span>
              <span>{match()?.creator?.name ?? 'By Admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
