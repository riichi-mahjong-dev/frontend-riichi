import { JSX } from "solid-js";

type MenuItem = {
  label: string;
  onClick?: () => void;
};

type TextMenuStackProps = {
  items: MenuItem[];
};

export default function TextMenuStack(props: TextMenuStackProps): JSX.Element {
  const [title, second, ...rest] = props.items;

  return (
    <div class="flex flex-col border rounded-md bg-white shadow-md overflow-hidden text-sm">
      {/* Title Label */}
      <div class="px-4 py-3 font-semibold text-gray-600 bg-gray-50 border-b select-none">
        {title.label}
      </div>

      {/* Single Action (Second item) */}
      {second && (
        <div
          class="px-4 py-3 border-b text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
          onClick={() => second.onClick?.()}
        >
          {second.label}
        </div>
      )}

      {/* Hoverable List */}
      {rest.length > 0 && (
        <div class="flex flex-col divide-y">
          {rest.map((item) => (
            <div
              class="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              onClick={() => item.onClick?.()}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
