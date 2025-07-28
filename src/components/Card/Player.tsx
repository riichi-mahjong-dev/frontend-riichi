import { MatchPlayer } from "~/api/match";

type PlayerProps = {
  id: number;
  name?: string;
  username?: string;
  rank: number;
  country?: string;
  province?: string;
  match_player?: Array<MatchPlayer>;
}

export default function PlayerCard({
  id,
  name,
  username,
  rank,
  match_player,
}: PlayerProps) {
  const mmrDelta = match_player?.[0]?.mmr_delta;
  const hasValidMMR = typeof mmrDelta === "number";

  const isPositive = hasValidMMR && mmrDelta >= 0;
  const mmrTextColor = hasValidMMR
    ? isPositive
      ? "text-green-600"
      : "text-red-600"
    : "text-gray-400";

  const mmrArrow = hasValidMMR ? (isPositive ? "↑" : "↓") : "-";
  const mmrValue = hasValidMMR ? `${Math.abs(mmrDelta!)} MMR` : "";

  return (
    <a
      href={`/player/${id}`}
      class="w-full max-w-[930px] bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2"
    >
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-col text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <p class="text-gray-500 dark:text-gray-400 text-md">@{username}</p>
        </div>

        <div class="flex flex-col items-center justify-center h-[78px] w-full md:w-auto bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2">
          <div class="flex items-center gap-2">
            <span class="text-gray-500 dark:text-gray-300 text-sm font-medium">MMR</span>
            <span class="text-gray-900 dark:text-white font-semibold text-lg">{rank}</span>
          </div>
          <div class={`flex items-center text-sm font-medium ${mmrTextColor}`}>
            <span class="mr-1">{mmrArrow}</span>
            <span>{mmrValue}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
