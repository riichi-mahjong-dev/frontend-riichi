import House from "lucide-solid/icons/house";

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
    <a href={`/parlour/${id}`} class="flex flex-row w-full h-26 rounded shadow-lg bg-mj-green">
      <div class="flex items-center px-4">
        <House color="#fff"/>
      </div>
      <div class="flex flex-row items-center flex-grow min-w-0 gap-4 bg-white px-4 py-2">
          <div class="shrink-0 flex items-center justify-center bg-mj-green text-white text-2xl font-bold">
            {name}
          </div>
          <div class="flex flex-col items-start">
            <div class="text-2xl font-bold text-mj-green truncate">
              { country }
            </div>
            <div class="text-lg text-mj-green truncate">
              { province }
            </div>
          </div>
      </div>
    </a>
  );
}
