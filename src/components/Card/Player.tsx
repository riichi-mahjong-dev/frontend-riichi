type PlayerProps = {
  id: number;
  name?: string;
  username?: string;
  rank: number;
  country?: string;
  province?: string;
}

export default function PlayerCard({
  id,
  name,
  username,
  rank,
  country,
  province,
}: PlayerProps) {
  return (
      <a href={`/player/${id}`} class="w-full max-w-[930px] bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col text-center md:text-left">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <p class="text-gray-500 dark:text-gray-400 text-md">@{username}</p>
          </div>

          <div class="flex items-center justify-between h-[78px] w-full md:w-auto bg-gray-50 dark:bg-gray-700 rounded-xl px-6">
            <span class="text-gray-500 dark:text-gray-300 text-sm font-medium mr-2">Rank</span>
            <span class="text-gray-900 dark:text-white font-semibold text-lg">{rank}</span>
          </div>
        </div>
      </a>
  );
}
