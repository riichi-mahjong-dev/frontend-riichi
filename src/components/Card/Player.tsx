type PlayerProps = {
  id: number;
  name: string;
  mr: number;
  country?: string;
  province?: string;
}

export default function PlayerCard({
  id,
  name,
  mr,
  country,
  province,
}: PlayerProps) {
  return (
    <a href={`/player/${id}`} class="flex flex-col w-70 h-70 rounded shadow-lg bg-mj-green">
      <div class="flex flex-col items-center flex-grow gap-4 bg-white px-4 py-8">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-mj-green text-white text-2xl font-bold">
            KR
          </div>
          <div class="text-xl font-bold text-mj-green">
            { name }
          </div>
      </div>
      <div class="flex items-center justify-center h-30 text-4xl text-white">
        MR: { mr }
      </div>
    </a>
  );
}
