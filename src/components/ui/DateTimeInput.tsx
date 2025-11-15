import { JSX } from "solid-js";

type DateTimeInputProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  error?: string;
  name?: string;
  min?: string;
  max?: string;
  mode?: "date" | "time" | "datetime";
};

export default function DateTimeInput(props: DateTimeInputProps): JSX.Element {
  const inputType = () => {
    switch (props.mode) {
      case "date":
        return "date";
      case "time":
        return "time";
      default:
        return "datetime-local";
    }
  };

  return (
    <div class="w-full relative">
      {props.label && (
        <label
          for={props.name}
          class="block mb-1 text-sm font-medium text-gray-700"
        >
          {props.label} {props.required && <span class="text-red-500">*</span>}
        </label>
      )}

      <input
        type={inputType()}
        name={props.name}
        value={props.value}
        onInput={(e) => props.onChange?.(e.currentTarget.value)}
        required={props.required}
        min={props.min}
        max={props.max}
        class={`
          w-full px-4 py-3 rounded-lg border
          ${props.error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-2 focus:ring-blue-500
          text-gray-700 bg-white shadow-sm transition
        `}
      />

      {props.error && <p class="mt-1 text-sm text-red-600">{props.error}</p>}
    </div>
  );
}
