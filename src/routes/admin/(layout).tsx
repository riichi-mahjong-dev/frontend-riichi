import { RouteSectionProps } from "@solidjs/router";

export default function AdminLayout(props: RouteSectionProps) {
  return (
    <div>
    { props.children }
    </div>
  );
}
