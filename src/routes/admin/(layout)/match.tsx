import { RouteSectionProps } from "@solidjs/router";

export default function MatchPage(props: RouteSectionProps) {
  return <div>{props.children}</div>;
}
