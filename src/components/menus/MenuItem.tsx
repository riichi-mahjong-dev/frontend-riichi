import { Accessor, Component, JSX } from "solid-js";
import Text from "../Label/Text";
import { Dynamic } from "solid-js/web";

export type MenuItemProps = {
  label: string;
  Icon: Component;
  selected: Accessor<boolean>;
  onClick: () => void;
}

export default function MenuItem({
  label,
  Icon,
  selected,
  onClick,
}: MenuItemProps) {
  return (
    <div
      tabIndex={0}
      onClick={onClick}
      class={`flex items-center gap-6.5 h-auto cursor-pointer pl-10 py-6 ${selected() ? "text-label-selected" : "text-label-unselected hover:text-label-selected"}`}
    >
      <Dynamic
        component={Icon}
      />
      <Text
        as="span"
        className="font-medium text-lg"
      >
        {label}
      </Text>
    </div>
  )
}
