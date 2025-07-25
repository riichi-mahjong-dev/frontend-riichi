import Dices from "lucide-solid/icons/dices";
import { For } from "solid-js";
import { Player } from "~/api/player";

type MatchProps = {
  id: number;
  playing_at: string;
  players: Player[];
  parlour_name: string;
}

export default function MatchCard({
  id,
  playing_at,
  players,
  parlour_name,
}: MatchProps) {
  console.log(playing_at);
  return (
    <a href={`/match/${id}`} class="flex flex-row w-full rounded shadow-lg bg-mj-green">
      <div class="flex items-center px-4">
        <Dices color="#fff"/>
      </div>
      <div class="flex flex-col flex-grow min-w-0 gap-1 bg-white px-4 py-2">
        <For each={players}>
          {(item) => (
            <div class="flex bg-mj-green text-white text-xl px-2 truncate rounded-sm">
              {item.name}
            </div>
          )}
        </For>
      </div>
      <div class="flex items-center px-4 text-white text-base font-bold">
        {parlour_name} - {playing_at}
      </div>
    </a>
  );
}
