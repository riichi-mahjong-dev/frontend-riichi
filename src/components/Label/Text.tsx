import { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

interface TextProps {
  children?: JSX.Element | JSX.Element[];
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "span" | "p" | "div";
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

export default function Text(props: TextProps) {
  const baseClass = "font-inter";
  const sizes: Record<TextProps["as"], string> = {
    h1: "text-head-1 leading-head-1",
    h2: "text-head-2 leading-head-2",
    h3: "text-head-3 leading-head-3",
    h4: "text-head-4 leading-head-4",
    h5: "text-head-5 leading-head-5",
    span: "",
    p: "",
    div: "",
  };

  return (
    <Dynamic
      component={props.as}
      onClick={props.onClick}
      class={`${baseClass} ${sizes[props.as]} ${props.className ?? ""}`}
      title={
        Array.isArray(props.children)
          ? props.children.join("")
          : `${props.children ?? ""}`
      }
    >
      {props.children}
    </Dynamic>
  );
}
