import { createSignal } from "solid-js";

export function MatchFilter(props: {
  onApply: (start_date?: Date, end_date?: Date) => void;
}) {
  const [startDate, setStartDate] = createSignal<Date>();
  const [endDate, setEndDate] = createSignal<Date>();

  return (
    <form class="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {/* Date range filter */}
      <div>
        <label class="block font-medium mb-1">Start Date</label>
        <input type="date" class="w-full border p-2 rounded" onInput={(e) => setStartDate(new Date(e.currentTarget.value))}/>
      </div>
      <div>
        <label class="block font-medium mb-1">End Date</label>
        <input type="date" class="w-full border p-2 rounded" onInput={(e) => setEndDate(new Date(e.currentTarget.value))}/>
      </div>

      <button
        class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded"
        onClick={() => {
          props.onApply(startDate(), endDate());
        }}
      >
        Apply Filters
      </button>
    </form>
  );
}

