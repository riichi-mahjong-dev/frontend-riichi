import { useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { createParlour, getParlourById, updateParlour } from "~/api/parlour";
import { getProvinces, Province } from "~/api/province";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { useForm } from "~/compose/useForm";
import { isNumber, max, min } from "~/utils/validations";

export default function CreateParlour() {
  const navigation = useNavigate();
  const {
    fields,
    handleSubmit,
  } = useForm({
    'name': '',
    'country': 'Indonesia',
    'province_id': 0,
    'address': '',
  },{
      'name': [
        min(3),
        max(120)
      ],
      'country': [
      ],
      'province_id': [
        isNumber(),
        (value: string) => {
          if (Number(value) === 0) {
            return "This field cannot be empty";
          }
          return null;
        },
      ],
      'address': [
        min(10),
        max(500),
      ]
  });

  const submission = useSubmission(createParlour);
  const actionCreateParlour = useAction(createParlour);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/parlour");
    }
  });


  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Create Parlour
      </h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(async ({name, country, province_id, address}) => {
          await actionCreateParlour({
            province_id: province_id,
            name: name,
            country: country,
            address: address,
          });
        })}
      >
        <Input
          label="Name"
          name="new_name"
          value={fields['name'].value()}
          onInput={(e) => fields['name'].setValue(e.currentTarget.value)}
          error={fields['name'].error()}
        />
        <Input
          readonly
          label="Country"
          name="new_country"
          value={fields['country'].value()}
          onInput={(e) => fields['country'].setValue(e.currentTarget.value)}
          error={fields['country'].error()}
        />
        <SearchDropdown
          label="Province :"
          fetchData={async (query, page) => {
            const player = await getProvinces({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Province) => {
            return item.name;
          }}
          onSelect={(item: Province) => {
            fields['province_id'].setValue(item.id);
          }}
          placeholder="Province"
          error={fields['province_id'].error}
        />
        <Textarea
          label="Address"
          name="new_address"
          value={fields['address'].value()}
          onInput={(e) => fields['address'].setValue(e.currentTarget.value)}
          error={fields['address'].error()}
          placeholder="Type Address..."
        />
        <Button size="lg" variant="outline" type="submit" isLoading={submission.pending}>
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
