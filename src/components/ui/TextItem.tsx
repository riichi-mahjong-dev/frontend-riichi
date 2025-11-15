import { Component } from "solid-js";

interface TextItemProps {
  text: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  class?: string;
}

const sizeClassMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const TextItem: Component<TextItemProps> = (props) => {
  const sizeClass = sizeClassMap[props.size ?? "md"];

  return (
    <div
      class={`px-4 py-2 rounded text-gray-800
              ${sizeClass}
              hover:bg-gray-100 active:bg-gray-200
              transition-colors duration-150
              select-none cursor-pointer ${props.class ?? ""}`}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
};

export default TextItem;
