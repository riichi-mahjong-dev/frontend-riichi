import { useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { getMatchById, updateMatchApprove } from "~/api/match";
import { getParlours, Parlour } from "~/api/parlour";
import { getPlayers, Player } from "~/api/player";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import { useForm } from "~/compose/useForm";

export default function ApproveMatchPage() {
  const params = useParams();
  const navigation = useNavigate();
  const [creator, setCreator] = createSignal<Player>();
  const [players, setPlayers] = createSignal<Array<Player>>([]);
  const [parlour, setParlour] = createSignal<Parlour>();
  const [approved, setApproved] = createSignal<boolean>(false);
  const {
      handleSubmit,
  } = useForm({
  }, {
  });

  const submission = useSubmission(updateMatchApprove);
  const actionUpdateMatchApprove = useAction(updateMatchApprove);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/match");
    }
  });

  onMount(async () => {
    const res = await getMatchById(Number(params.id));
    let players: Array<Player> = [];
    let matchPlayers: Array<number> = [];
    let index = 1;

    for (const matchPlayer of res?.match_players ?? []) {
      players.push(matchPlayer.player);
      matchPlayers.push(matchPlayer.id);
      index++;
    }

    setApproved(res?.approved_at !== null);
    setPlayers(players);
    setParlour(res?.parlour);
    setCreator(res?.creator);
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Approve Match ID {params.id}
      </h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(async () => {
          await actionUpdateMatchApprove(Number(params.id));
        })}
      >
        <SearchDropdown
          readonly
          label="Creator:"
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          defaultSelected={creator()}
        />
        <SearchDropdown
          readonly
          label="Parlour:"
          fetchData={async (query, page) => {
            const parlours = await getParlours({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: parlours.list,
              hasMore: parlours.list.length > 0,
            }
          }}
          getLabel={(item: Parlour) => {
            return item.name;
          }}
          defaultSelected={parlour()}
        />
        <SearchDropdown
          readonly
          label="Player 1:"
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          defaultSelected={players()[0]}
        />
        <SearchDropdown
          readonly
          label="Player 2:"
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          defaultSelected={players()[1]}
        />
        <SearchDropdown
          readonly
          label="Player 3:"
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          defaultSelected={players()[2]}
        />
        <SearchDropdown
          readonly
          label="Player 4:"
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          defaultSelected={players()[3]}
        />

        <Button disabled={approved()} size="lg" variant="outline" type="submit" isLoading={submission.pending}>
          {approved() ? 'Already Approved' : 'Approve This Match'}
        </Button>
        <Show when={submission.error}>
            <span class="text-left text-rose-700">
                {submission.error.message}
            </span>
        </Show>
      </form>
    </div>
  );
}
