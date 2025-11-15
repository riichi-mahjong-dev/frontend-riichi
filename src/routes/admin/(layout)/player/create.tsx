import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { createPlayer } from "~/api/player";
import { getProvinces, Province } from "~/api/province";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { useForm } from "~/compose/useForm";
import { isNumber, max, min } from "~/utils/validations";

export default function CreateParlour() {
  const navigation = useNavigate();
  const { fields, handleSubmit } = useForm(
    {
      username: "",
      password: "",
      name: "",
      rank: 0,
      country: "Indonesia",
      province_id: 0,
    },
    {
      username: [min(3), max(120)],
      password: [min(8)],
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

  const submission = useSubmission(createPlayer);
  const actionUpdateMatch = useAction(createPlayer);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/player");
    }
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">Create Player</h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(
          async ({ username, password, name, rank, country, province_id }) => {
            await actionUpdateMatch({
              province_id: province_id,
              username: username,
              password: password,
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
          label="Password"
          type="password"
          name="new_password"
          value={fields["password"].value()}
          onInput={(e) => fields["password"].setValue(e.currentTarget.value)}
          error={fields["password"].error()}
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
        />
        <Input
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
