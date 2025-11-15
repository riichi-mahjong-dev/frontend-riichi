import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { createMatch } from "~/api/match";
import { getParlours, Parlour } from "~/api/parlour";
import { getPlayers, Player } from "~/api/player";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import { useForm } from "~/compose/useForm";
import { isNumber } from "~/utils/validations";

export default function CreateMatchPage() {
  const navigation = useNavigate();
  const [players, setPlayers] = createSignal<Array<number>>([0, 0, 0, 0]);
  const { fields, handleSubmit } = useForm(
    {
      parlour_id: 0,
      player_1: 0,
      player_2: 0,
      player_3: 0,
      player_4: 0,
    },
    {
      parlour_id: [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
      ],
      player_1: [
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
          const isExist = players().filter((val) => val == id).length > 1;
          return isExist ? "This player already input." : null;
        },
      ],
      player_2: [
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
          const isExist = players().filter((val) => val == id).length > 1;
          return isExist ? "This player already input." : null;
        },
      ],
      player_3: [
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
          const isExist = players().filter((val) => val == id).length > 1;
          return isExist ? "This player already input." : null;
        },
      ],
      player_4: [
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
          const isExist = players().filter((val) => val == id).length > 1;
          return isExist ? "This player already input." : null;
        },
      ],
    },
  );

  const submission = useSubmission(createMatch);
  const actionCreateMatch = useAction(createMatch);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/match");
    }
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">Create Match</h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(
          async ({ parlour_id, player_1, player_2, player_3, player_4 }) => {
            await actionCreateMatch({
              parlour_id: parlour_id,
              players: [
                {
                  player: player_1,
                },
                {
                  player: player_2,
                },
                {
                  player: player_3,
                },
                {
                  player: player_4,
                },
              ],
            });
          },
        )}
      >
        <SearchDropdown
          fetchData={async (query, page) => {
            const parlours = await getParlours({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: parlours.list,
              hasMore: parlours.list.length > 0,
            };
          }}
          getLabel={(item: Parlour) => {
            return item.name;
          }}
          onSelect={(item) => {
            fields["parlour_id"].setValue(item.id);
          }}
          placeholder="Search Parlour"
          error={fields["parlour_id"].error}
        />
        <SearchDropdown
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            };
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          onSelect={(item: Player) => {
            fields["player_1"].setValue(item.id);
            setPlayers((prev) => {
              prev[0] = item.id;
              return prev;
            });
          }}
          placeholder="Player 1"
          error={fields["player_1"].error}
        />
        <SearchDropdown
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            };
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          onSelect={(item: Player) => {
            fields["player_2"].setValue(item.id);
            setPlayers((prev) => {
              prev[1] = item.id;
              return prev;
            });
          }}
          placeholder="Player 2"
          error={fields["player_2"].error}
        />
        <SearchDropdown
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            };
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          onSelect={(item: Player) => {
            fields["player_3"].setValue(item.id);
            setPlayers((prev) => {
              prev[2] = item.id;
              return prev;
            });
          }}
          placeholder="Player 3"
          error={fields["player_3"].error}
        />
        <SearchDropdown
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            };
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          onSelect={(item: Player) => {
            fields["player_4"].setValue(item.id);
            setPlayers((prev) => {
              prev[3] = item.id;
              return prev;
            });
          }}
          placeholder="Player 4"
          error={fields["player_4"].error}
        />

        <Button
          size="lg"
          variant="outline"
          type="submit"
          isLoading={submission.pending}
        >
          Create
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
