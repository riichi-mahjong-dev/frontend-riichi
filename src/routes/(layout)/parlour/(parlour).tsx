import {clientOnly} from "@solidjs/start";

const ParlourPage = clientOnly(() => import("~/components/pages/parlour"))

export default function Ranked() {
  return (
    <ParlourPage/>
  );
}

