import { JSX, splitProps, mergeProps, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

export type ButtonProps = {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  as?: "button" | "a" | "div";
  isLoading?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const merged = mergeProps(
    {
      variant: "default",
      size: "md",
      type: "button",
      as: "button",
      isLoading: false,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    "class",
    "variant",
    "size",
    "children",
    "type",
    "leftIcon",
    "rightIcon",
    "as",
    "isLoading",
  ]);

  const base = `
    inline-flex items-center justify-center gap-2
    rounded-xl font-semibold shadow-sm
    transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:pointer-events-none
    transform hover:-translate-y-0.5 active:scale-95
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `;

  const variants: Record<string, string> = {
    default: `
      bg-gradient-to-r from-blue-500 to-indigo-600
      text-white
      hover:from-blue-600 hover:to-indigo-700
      focus-visible:ring-blue-500
    `,
    outline: `
      border border-gray-300 text-gray-700
      hover:bg-gray-100
      focus-visible:ring-gray-400
    `,
    destructive: `
      bg-gradient-to-r from-red-500 to-rose-600
      text-white
      hover:from-red-600 hover:to-rose-700
      focus-visible:ring-red-500
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100
      focus-visible:ring-gray-300
    `,
  };

  const sizes: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  return (
    <Dynamic
      component={local.as!}
      class={`
        ${base}
        ${variants[local.variant!]}
        ${sizes[local.size!]}
        ${local.class ?? ""}
      `}
      type={local.as === "button" ? local.type : undefined}
      aria-busy={local.isLoading}
      {...others}
    >
      <Show when={local.leftIcon && !local.isLoading}>
        <span class="inline-flex items-center">{local.leftIcon}</span>
      </Show>

      <Show when={!local.isLoading} fallback={<span class="animate-pulse">...</span>}>
        {local.children}
      </Show>

      <Show when={local.rightIcon && !local.isLoading}>
        <span class="inline-flex items-center">{local.rightIcon}</span>
      </Show>
    </Dynamic>
  );
}
