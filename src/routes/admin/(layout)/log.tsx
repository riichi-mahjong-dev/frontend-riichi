import { RouteSectionProps } from "@solidjs/router";

export default function LogPage(props: RouteSectionProps) {
  return (
    <div>
      {props.children}
    </div>
  );
}

