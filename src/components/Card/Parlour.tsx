import House from "lucide-solid/icons/house";

type ParlourProps = {
  id: number;
  name: string;
  country: string;
  province: string;
  address: string;
}

export default function ParlourCard({
  id,
  name,
  country,
  province,
  address,
}: ParlourProps) {
  return (
    <a href={`/parlour/${id}`} class="w-full max-w-[930px] bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left: Name */}
      <div class="flex-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
        <div class="text-sm text-gray-500 dark:text-gray-400">{country} — {province}</div>
      </div>

      {/* Right: Address */}
      <div class="flex items-center text-sm text-gray-700 dark:text-gray-300 max-w-full md:max-w-[50%]">
        <span class="text-gray-500 dark:text-gray-400 mr-1">📍</span>
        <span class="truncate" title={address}>{address}</span>
      </div>
    </a>
  );
}
