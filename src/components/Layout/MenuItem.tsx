import { Component, JSX } from "solid-js";

interface MenuItemProps {
  children: JSX.Element;
  onClick?: () => void;
  class?: string;
}

const MenuItem: Component<MenuItemProps> = (props) => {
  return (
    <div
      class={`px-4 py-3 text-sm text-gray-800 
              hover:bg-gray-100 active:bg-gray-200 
              cursor-pointer select-none ${props.class ?? ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default MenuItem;

