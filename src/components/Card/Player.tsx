type PlayerProps = {
  id: number;
  name?: string;
  username?: string;
  mr: number;
  country?: string;
  province?: string;
}

export default function PlayerCard({
  id,
  name,
  username,
  mr,
  country,
  province,
}: PlayerProps) {
  return (
    <a href={`/player/${id}`} class="flex flex-row w-full h-26 rounded shadow-lg bg-mj-green">
      <div class="flex flex-row items-center flex-grow min-w-0 gap-4 bg-white px-4 py-2">
          <div class="shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-mj-green text-white text-2xl font-bold">
            {name?.slice(0, 2).toUpperCase() ?? ''}
          </div>
          <div class="flex flex-col items-start">
            <div class="text-2xl font-bold text-mj-green truncate">
              { name }
            </div>
            <div class="text-lg text-mj-green truncate">
              { username }
            </div>
          </div>
      </div>
      <div class="flex flex-shrink-0 items-center justify-center text-4xl text-white w-40">
        { mr }
      </div>
    </a>
  );
}
