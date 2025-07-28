import { useAction, useNavigate, useParams, useSubmission } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { AdminPermissionInput, createAdmin, getAdminById, updateAdmin } from "~/api/admin";
import { getParlours, Parlour } from "~/api/parlour";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { useForm } from "~/compose/useForm";
import { max, min } from "~/utils/validations";

export default function EditAdminPage() {
  const params = useParams();
  const navigation = useNavigate();
  const [parlours, setParlours] = createSignal<Array<Parlour>>([]);
  const {
      fields,
      handleSubmit,
  } = useForm({
    'username': '',
    'password': '',
    'role': 'admin',
    'admin_permission': [],
  }, {
      'username': [
        min(3),
        max(120),
      ],
      'password': [
        min(8, true),
      ],
      'role': [],
      'admin_permission': [
        (value: Array<AdminPermissionInput>) => {
          if (value.length > 4) {
            return "cannot select more than 4";
          }
          return null;
        }
      ]
  });

  const submission = useSubmission(updateAdmin);
  const actionUpdateAdmin = useAction(updateAdmin);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/match");
    }
  });

  onMount(async () => {
    const res = await getAdminById(Number(params.id));

    fields['username'].setValue(res?.username);

    let parlours: Array<Parlour> = [];

    for (const permission of res?.admin_permission ?? []) {
      parlours.push(permission.parlour);
    }

    setParlours(parlours);
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Edit Parlour {params.id}
      </h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(async ({username, password, role, admin_permission}) => {
          await actionUpdateAdmin(Number(params.id), {
            username,
            password,
            role,
            admin_permission,
          });
        })}
      >
        <Input
          label="Username"
          name="new_username"
          value={fields['username'].value()}
          onInput={(e) => fields['username'].setValue(e.currentTarget.value)}
          error={fields['username'].error()}
        />
        <Input
          label="Password"
          type="password"
          name="new_password"
          value={fields['password'].value()}
          onInput={(e) => fields['password'].setValue(e.currentTarget.value)}
          error={fields['password'].error()}
        />
        <SearchDropdown
          multi
          label="Parlour Permission :"
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
          onSelect={(items) => {
            const permission: AdminPermissionInput[] = items.map((value: Parlour) => {
              return {
                parlour_id: value.id,
                province_id: value.province_id,
              }
            });
            fields['admin_permission'].setValue(permission);
          }}
          placeholder="Parlour Permission"
          error={fields['admin_permission'].error}
          defaultSelected={parlours()}
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
