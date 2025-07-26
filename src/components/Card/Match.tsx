import { For } from "solid-js";
import { MatchPlayer } from "~/api/match";
import { Player } from "~/api/player";

type MatchProps = {
  id: number;
  playing_at: string;
  players: MatchPlayer[];
  parlour_name: string;
  created_by?: Player;
}

export default function MatchCard({
  id,
  playing_at,
  players,
  parlour_name,
  created_by,
}: MatchProps) {
  console.log(playing_at);
  return (
    <a href={`/match/${id}`} class="w-full max-w-[930px] bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-all flex flex-col md:flex-row justify-between gap-6">
      {/* Left: Players */}
      <div class="flex-1">
        <h2 class="text-gray-900 dark:text-white font-semibold text-lg mb-3">Players</h2>
        <div class="grid grid-cols-2 gap-4">
          <For each={players}>
            {(player) => (
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-100 shadow-sm">
                <div class="font-medium">{player.player.name}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs">@{player.player.username}</div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Right: Match Info */}
      <div class="flex flex-col justify-center gap-3 text-sm text-gray-800 dark:text-gray-200 min-w-[250px]">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400 font-medium">📍 Location:</span>
          <span>{parlour_name}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400 font-medium">📅 Date:</span>
          <span>{playing_at}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-400 font-medium">👤 Creator:</span>
          <span>{created_by?.name ?? 'By Admin'}</span>
        </div>
      </div>
    </a>
  );
}
