import { useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Index, onMount, Show } from "solid-js";
import { getMatchById, MatchPlayer, updateMatchPoint } from "~/api/match";
import { getPlayers, Player } from "~/api/player";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { useForm } from "~/compose/useForm";
import { isNumber } from "~/utils/validations";

export default function PointMatchPage() {
  const params = useParams();
  const navigation = useNavigate();
  const [players, setPlayers] = createSignal<Array<Player>>([]);
  const {
      fields,
      handleSubmit,
  } = useForm({
    'score_player_1': 0,
    'score_player_2': 0,
    'score_player_3': 0,
    'score_player_4': 0,
    'match_player_1': 0,
    'match_player_2': 0,
    'match_player_3': 0,
    'match_player_4': 0,
  }, {
      'score_player_1': [
        isNumber(),
      ],
      'score_player_2': [
        isNumber(),
      ],
      'score_player_3': [
        isNumber(),
      ],
      'score_player_4': [
        isNumber(),
      ],
      'match_player_1': [
        isNumber(),
      ],
      'match_player_2': [
        isNumber(),
      ],
      'match_player_3': [
        isNumber(),
      ],
      'match_player_4': [
        isNumber(),
      ],
  });

  const submission = useSubmission(updateMatchPoint);
  const actionUpdateMatchPoint = useAction(updateMatchPoint);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/match");
    }
  });

  onMount(async () => {
    const res = await getMatchById(Number(params.id));
    let players: Array<Player> = [];
    let matchPlayers: Array<MatchPlayer> = [];
    let index = 1;

    for (const matchPlayer of res?.match_players ?? []) {
      players.push(matchPlayer.player);
      matchPlayers.push(matchPlayer);
      index++;
    }

    fields['score_player_1'].setValue(matchPlayers[0].point ?? 0);
    fields['score_player_2'].setValue(matchPlayers[1].point ?? 0);
    fields['score_player_3'].setValue(matchPlayers[2].point ?? 0);
    fields['score_player_4'].setValue(matchPlayers[3].point ?? 0);

    fields['match_player_1'].setValue(matchPlayers[0].id);
    fields['match_player_2'].setValue(matchPlayers[1].id);
    fields['match_player_3'].setValue(matchPlayers[2].id);
    fields['match_player_4'].setValue(matchPlayers[3].id);

    setPlayers(players);
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Input Point Match ID {params.id}
      </h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(async ({score_player_1, score_player_2, score_player_3, score_player_4, match_player_1, match_player_2, match_player_3, match_player_4}) => {
          await actionUpdateMatchPoint(Number(params.id), {
            point_match_players: [
              {
                match_player_id: match_player_1,
                score: score_player_1,
              },
              {
                match_player_id: match_player_2,
                score: score_player_2,
              },
              {
                match_player_id: match_player_3,
                score: score_player_3,
              },
              {
                match_player_id: match_player_4,
                score: score_player_4,
              }
            ],
          });
        })}
      >
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
          placeholder="Player 1"
          defaultSelected={players()[0]}
        />
        <Input
          label="Point Player 1:"
          value={fields['score_player_1'].value()}
          onInput={(e) => fields['score_player_1'].setValue(Number(e.currentTarget.value))}
          type="number"
          placeholder="Point..."
          error={fields['score_player_1'].error()}
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
          placeholder="Player 2"
          defaultSelected={players()[1]}
        />
        <Input
          label="Point Player 2:"
          value={fields['score_player_2'].value()}
          onInput={(e) => fields['score_player_2'].setValue(Number(e.currentTarget.value))}
          type="number"
          placeholder="Point..."
          error={fields['score_player_1'].error()}
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
        <Input
          label="Point Player 3:"
          value={fields['score_player_3'].value()}
          onInput={(e) => fields['score_player_3'].setValue(Number(e.currentTarget.value))}
          type="number"
          placeholder="Point..."
          error={fields['score_player_1'].error()}
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
        <Input
          label="Point Player 4:"
          value={fields['score_player_4'].value()}
          onInput={(e) => fields['score_player_4'].setValue(Number(e.currentTarget.value))}
          type="number"
          placeholder="Point..."
          error={fields['score_player_1'].error()}
        />

        <Button size="lg" variant="outline" type="submit" isLoading={submission.pending}>
          Update
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
