type ParlourProps = {
  id: number;
  name: string;
  country: string;
  province: string;
  address: string;
}

export default function PlayerCard({
  id,
  name,
  country,
  province,
  address,
}: ParlourProps) {
  return (
    <a href="#" class="flex flex-col w-70 h-70 rounded shadow-lg bg-mj-green">
      <div class="flex flex-col items-center flex-grow gap-4 bg-white px-4 py-8">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-mj-green text-white text-2xl font-bold">
            KR
          </div>
          <div class="text-xl font-bold text-mj-green">
            Kristian Ruben
          </div>
      </div>
      <div class="flex items-center justify-center px-4 py-8 text-4xl text-white">
        MR: 1000
      </div>
    </a>
  );
}
