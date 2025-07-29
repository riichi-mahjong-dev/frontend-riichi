import { useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { getMatchById, updateMatch } from "~/api/match";
import { getParlours, Parlour } from "~/api/parlour";
import { getPlayers, Player } from "~/api/player";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import { useForm } from "~/compose/useForm";
import { isNumber } from "~/utils/validations";

export default function EditMatchPage() {
  const params = useParams();
  const navigation = useNavigate();
  const [players, setPlayers] = createSignal<Array<Player>>([]);
  const [parlour, setParlour] = createSignal<Parlour>();
  const {
      fields,
      handleSubmit,
  } = useForm({
    'parlour_id': 0,
    'player_1': 0,
    'player_2': 0,
    'player_3': 0,
    'player_4': 0,
    'match_player_1': 0,
    'match_player_2': 0,
    'match_player_3': 0,
    'match_player_4': 0,
  }, {
      'parlour_id': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        }
      ],
      'player_1': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
        (value: string) => {
          const id = Number(value);
          if (id === 0) {
            return null;
          }
          const isExist = players().filter((val) => val.id == id).length > 1;
          return isExist ? "This player already input." : null;
        }
      ],
      'player_2': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
        (value: string) => {
          const id = Number(value);
          if (id === 0) {
            return null;
          }
          const isExist = players().filter((val) => val.id == id).length > 1;
          return isExist ? "This player already input." : null;
        }
      ],
      'player_3': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
        (value: string) => {
          const id = Number(value);
          if (id === 0) {
            return null;
          }
          const isExist = players().filter((val) => val.id == id).length > 1;
          return isExist ? "This player already input." : null;
        }
      ],
      'player_4': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
        (value: string) => {
          const id = Number(value);
          if (id === 0) {
            return null;
          }
          const isExist = players().filter((val) => val.id == id).length > 1;
          return isExist ? "This player already input." : null;
        }
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

  const submission = useSubmission(updateMatch);
  const actionUpdateMatch = useAction(updateMatch);

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

    fields['parlour_id'].setValue(res?.parlour?.id ?? 0);
    fields['player_1'].setValue(players[0].id);
    fields['player_2'].setValue(players[1].id);
    fields['player_3'].setValue(players[2].id);
    fields['player_4'].setValue(players[3].id);

    fields['match_player_1'].setValue(matchPlayers[0]);
    fields['match_player_2'].setValue(matchPlayers[1]);
    fields['match_player_3'].setValue(matchPlayers[2]);
    fields['match_player_4'].setValue(matchPlayers[3]);

    setPlayers(players);
    setParlour(res?.parlour);
  });

  return (
    <div class="min-h-screen flex flex-col gap-16 w-full max-w-[930px] mx-auto pt-10">
      <div class="bg-white p-8 rounded">
        <h2 class="text-xl font-bold mb-10">
          Edit Match ID {params.id}
        </h2>
        <form
          class="flex flex-col gap-4"
          onSubmit={handleSubmit(async ({parlour_id, player_1, player_2, player_3, player_4, match_player_1, match_player_2, match_player_3, match_player_4}) => {
            await actionUpdateMatch(Number(params.id), {
              parlour_id: parlour_id,
              players: [
                {
                  match_player_id: match_player_1,
                  player: player_1,
                },
                {
                  match_player_id: match_player_2,
                  player: player_2,
                },
                {
                  match_player_id: match_player_3,
                  player: player_3,
                },
                {
                  match_player_id: match_player_4,
                  player: player_4,
                }
              ],
            });
          })}
        >
          <SearchDropdown
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
            onSelect={(item) => {
              fields['parlour_id'].setValue(item.id);
            }}
            placeholder="Search Parlour"
            error={fields['parlour_id'].error}
            defaultSelected={parlour()}
          />
          <SearchDropdown
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
            onSelect={(item: Player) => {
              fields['player_1'].setValue(item.id);
              setPlayers((prev) => {
                prev[0] = item;
                return prev;
              });
            }}
            placeholder="Player 1"
            error={fields['player_1'].error}
            defaultSelected={players()[0]}
          />
          <SearchDropdown
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
            onSelect={(item: Player) => {
              fields['player_2'].setValue(item.id);
              setPlayers((prev) => {
                prev[1] = item;
                return prev;
              });
            }}
            placeholder="Player 2"
            error={fields['player_2'].error}
            defaultSelected={players()[1]}
          />
          <SearchDropdown
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
            onSelect={(item: Player) => {
              fields['player_3'].setValue(item.id);
              setPlayers((prev) => {
                prev[2] = item;
                return prev;
              });
            }}
            placeholder="Player 3"
            error={fields['player_3'].error}
            defaultSelected={players()[2]}
          />
          <SearchDropdown
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
            onSelect={(item: Player) => {
              fields['player_4'].setValue(item.id);
              setPlayers((prev) => {
                prev[3] = item;
                return prev;
              });
            }}
            placeholder="Player 4"
            error={fields['player_4'].error}
            defaultSelected={players()[3]}
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
    </div>
  );
}

