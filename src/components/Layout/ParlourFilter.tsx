type SearchProps = {
  onInput: (value: string) => void;
};

export default function ParlourFilter(props: SearchProps) {
  return (
    <form class="space-y-4" onSubmit={(e) => e.preventDefault()}>

      <button
        class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded"
        onClick={() => {
        }}
      >
        Apply Filters
      </button>
    </form>
  );
}

