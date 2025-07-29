import { createSignal } from "solid-js";

export function RankingFilter(props: {
  onApply: (min: number, max: number) => void;
}) {
  const [min, setMin] = createSignal<number>(0);
  const [max, setMax] = createSignal<number>(0);

  return (
    <form class="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Rank range filter */}
      <div>
        <label class="block font-medium mb-1">Min MMR</label>
        <input type="number" class="w-full border p-2 rounded" onInput={(e) => setMin(Number(e.currentTarget.value))}/>
      </div>
      <div>
        <label class="block font-medium mb-1">Max MMR </label>
        <input type="number" class="w-full border p-2 rounded" onInput={(e) => setMax(Number(e.currentTarget.value))}/>
      </div>

      <button
        class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded"
        onClick={() => {
          props.onApply(min(), max());
        }}
      >
        Apply Filters
      </button>
    </form>
  );
}

