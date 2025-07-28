import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { getParlourById } from "~/api/parlour";
import { getProvinces, Province } from "~/api/province";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { useForm } from "~/compose/useForm";
import { isNumber, max, min } from "~/utils/validations";

export default function DetailParlour() {
  const params = useParams();
  const navigation = useNavigate();
  const [province, setProvince] = createSignal<Province>();
  const {
    fields,
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

  onMount(async () => {
    const res = await getParlourById(Number(params.id));

    fields['name'].setValue(res?.name);
    fields['country'].setValue(res?.country);
    fields['address'].setValue(res?.address);
    fields['province_id'].setValue(res?.province_id);
    setProvince(res?.province);
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Edit Player {params.id}
      </h2>
      <form
        class="flex flex-col gap-4"
      >
        <Input
          readonly
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
          readonly
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
          defaultSelected={province()}
        />
        <Textarea
          readonly
          label="Address"
          name="new_address"
          value={fields['address'].value()}
          onInput={(e) => fields['address'].setValue(e.currentTarget.value)}
          error={fields['address'].error()}
          placeholder="Type Address..."
        />
        <Button size="lg" variant="outline" type="submit" onClick={() => {
          navigation(`/admin/parlour/${params.id}/edit`);
        }}>
          Edit Parlour
        </Button>
      </form>
    </div>
  );
}
