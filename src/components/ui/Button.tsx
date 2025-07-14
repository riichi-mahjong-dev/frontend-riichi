import { JSX, splitProps, mergeProps } from "solid-js";

export type ButtonProps = {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const merged = mergeProps(
    { variant: "default", size: "md", type: "button" },
    props
  );
  const [local, others] = splitProps(merged, [
    "class",
    "variant",
    "size",
    "children",
    "type"
  ]);

  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  const sizes: Record<string, string> = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3"
  };

  return (
    <button
      class={`${base} ${variants[local.variant!]} ${sizes[local.size!]} ${
        local.class ?? ""
      }`}
      type={local.type}
      {...others}
    >
      {local.children}
    </button>
  );
}
