type SearchProps = {
  onInput: (value: string) => void;
};

export default function ParlourFilter(props: SearchProps) {
  return (
      <div class="relative w-full bg-mj-green-400">
        <div class="w-full h-[250px] text-left">
          <div class="flex items-center xl:w-[930px] mx-auto h-full px-8">
            <h1 class="text-4xl text-white font-bold">Parlour's</h1>
          </div>
        </div>
        <div class="absolute -bottom-14 h-28 w-full px-8">
          <div class="flex bg-white xl:w-[930px] h-full mx-auto shadow-xl rounded-xl px-6 py-8">
            <div class="flex-1">
              <input
                class="outline-none focus:outline-none focus:ring-0 w-full h-full text-2xl"
                type="text"
                placeholder="Search..."
                onInput={(e) => props.onInput(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
      </div>
  );
}

