import { JSX, Show, mergeProps } from "solid-js";

type InputSize = "small" | "medium" | "large" | "full";

type TextareaProps = {
  label?: string;
  value: string;
  onInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent>;
  name?: string;
  error?: string | null;
  readonly?: boolean;
  placeholder?: string;
  size?: InputSize;
  rows?: number;
};

const sizeClasses: Record<InputSize, string> = {
  small: "text-sm py-1 px-2",
  medium: "text-base py-2 px-3",
  large: "text-lg py-3 px-4",
  full: "text-base py-2 px-3 w-full",
};

export default function Textarea(p: TextareaProps) {
  const props = mergeProps(
    {
      error: null,
      size: "full" as InputSize,
      rows: 4,
    },
    p
  );

  const textareaClass = `${sizeClasses[props.size]} resize-none block w-full border border-gray-300 rounded-md text-gray-900 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none`;

  return (
    <div class={`flex flex-col gap-1 ${props.size === "full" ? "w-full" : ""}`}>
      <Show when={props.label}>
        <label for={props.name} class="text-base font-medium text-gray-700">
          {props.label}
        </label>
      </Show>

      <textarea
        id={props.name}
        name={props.name}
        rows={props.rows}
        value={props.value}
        onInput={props.onInput}
        placeholder={props.placeholder || ""}
        readOnly={props.readonly}
        class={textareaClass}
      />

      <Show when={props.error}>
        <p class="text-sm text-red-600">{props.error}</p>
      </Show>
    </div>
  );
}

