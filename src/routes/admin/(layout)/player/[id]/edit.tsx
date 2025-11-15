import {
  useAction,
  useNavigate,
  useParams,
  useSubmission,
} from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { getPlayerById, updatePlayer } from "~/api/player";
import { getProvinces, Province } from "~/api/province";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { useForm } from "~/compose/useForm";
import { isNumber, max, min } from "~/utils/validations";

export default function EditPlayer() {
  const params = useParams();
  const navigation = useNavigate();
  const [province, setProvince] = createSignal<Province>();
  const { fields, handleSubmit } = useForm(
    {
      username: "",
      name: "",
      rank: 0,
      country: "Indonesia",
      province_id: 0,
    },
    {
      username: [min(3), max(120)],
      name: [min(3), max(120)],
      rank: [isNumber()],
      country: [],
      province_id: [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
      ],
    },
  );

  const submission = useSubmission(updatePlayer);
  const actionUpdatePlayer = useAction(updatePlayer);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/player");
    }
  });

  onMount(async () => {
    const res = await getPlayerById(Number(params.id));

    fields["name"].setValue(res?.name);
    fields["username"].setValue(res?.username);
    fields["rank"].setValue(res?.rank);
    fields["country"].setValue(res?.country);
    setProvince(res?.province);
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">Edit Player {params.id}</h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(
          async ({ username, name, rank, country, province_id }) => {
            await actionUpdatePlayer(Number(params.id), {
              province_id: province_id,
              username: username,
              name: name,
              rank: rank,
              country: country,
            });
          },
        )}
      >
        <Input
          label="Name"
          name="new_name"
          value={fields["name"].value()}
          onInput={(e) => fields["name"].setValue(e.currentTarget.value)}
          error={fields["name"].error()}
        />
        <Input
          label="Username"
          name="new_username"
          value={fields["username"].value()}
          onInput={(e) => fields["username"].setValue(e.currentTarget.value)}
          error={fields["username"].error()}
        />
        <Input
          readonly
          label="Country"
          name="new_country"
          value={fields["country"].value()}
          onInput={(e) => fields["country"].setValue(e.currentTarget.value)}
          error={fields["country"].error()}
        />
        <SearchDropdown
          label="Province :"
          fetchData={async (query, page) => {
            const player = await getProvinces({
              page: page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            };
          }}
          getLabel={(item: Province) => {
            return item.name;
          }}
          onSelect={(item: Province) => {
            fields["province_id"].setValue(item.id);
          }}
          placeholder="Province"
          error={fields["province_id"].error}
          defaultSelected={province()}
        />
        <Input
          readonly
          label="MMR"
          type="number"
          name="mmr"
          value={fields["rank"].value()}
          onInput={(e) =>
            fields["rank"].setValue(Number(e.currentTarget.value))
          }
          error={fields["rank"].error()}
        />
        <Button
          size="lg"
          variant="outline"
          type="submit"
          isLoading={submission.pending}
        >
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
