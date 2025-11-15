import { clientOnly } from "@solidjs/start";

const MatchPage = clientOnly(() => import("~/components/pages/match"));

export default function Matches() {
  return <MatchPage />;
}
