import {clientOnly} from "@solidjs/start";

const RankedPage = clientOnly(() => import("~/components/pages/ranked"))

export default function Ranked() {
  return (
    <RankedPage/>
  );
}
