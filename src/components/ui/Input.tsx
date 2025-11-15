import { JSX, mergeProps, Show } from "solid-js";

type SizeInput = "small" | "medium" | "large" | "full";

type InputProps = {
  label?: string;
  value: string;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  type?: "text" | "password" | "number";
  name?: string;
  error?: string | null;
  readonly?: boolean;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  placeholder?: string;
  size?: SizeInput;
};

type SizeClassMap = Record<"small" | "medium" | "large" | "full", string>;

export default function Input(p: InputProps) {
  const props = mergeProps(
    {
      type: "text",
      iconPosition: "left",
      error: null,
    },
    p,
  );

  const paddingClass = () => {
    if (!props.icon) return "";
    return props.iconPosition === "left" ? "pl-11" : "pr-11";
  };

  const sizeClasses: SizeClassMap = {
    small: "text-sm py-1 px-2",
    medium: "text-base py-2 px-3",
    large: "text-lg py-3 px-4",
    full: "text-base py-2 px-3 w-full",
  };

  const sizeClass: SizeInput = props.size ?? "full";
  const inputClass = `${sizeClasses[sizeClass]} ${paddingClass()}`;

  return (
    <div class={`flex flex-col gap-1 ${props.size === "full" ? "w-full" : ""}`}>
      {props.label && (
        <label for={props.name} class="text-base font-medium text-gray-700">
          {props.label}
        </label>
      )}

      <div class="relative w-full">
        <Show when={props.icon && props.iconPosition === "left"}>
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            {props.icon}
          </div>
        </Show>

        <input
          id={props.name}
          name={props.name}
          type={props.type}
          value={props.value}
          onInput={props.onInput}
          placeholder={props.placeholder || ""}
          readOnly={props.readonly}
          class={`block border border-gray-300 rounded-md shadow-sm px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${inputClass}`}
        />

        <Show when={props.icon && props.iconPosition === "right"}>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
            {props.icon}
          </div>
        </Show>
      </div>

      <Show when={props.error}>
        <p class="text-sm text-red-600">{props.error}</p>
      </Show>
    </div>
  );
}
