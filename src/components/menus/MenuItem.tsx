import { Accessor, Component, JSX } from "solid-js";
import Text from "../Label/Text";
import { Dynamic } from "solid-js/web";

export type MenuItemProps = {
  label: string;
  Icon: Component<{color: string}>;
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
      class="flex items-center gap-6.5 h-default cursor-pointer pl-10"
    >
      <Dynamic
        component={Icon}
        color={selected() ? '#232323' : '#B1B1B1'}
      />
      <Text
        as="span"
        className={`font-medium text-lg ${selected() ? "text-label-selected" : "text-label-unselected"}`}
      >
        {label}
      </Text>
    </div>
  )
}
