import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { AdminPermissionInput, createAdmin } from "~/api/admin";
import { getParlours, Parlour } from "~/api/parlour";
import SearchDropdown from "~/components/Form/SearchDropdown";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { useForm } from "~/compose/useForm";
import { max, min } from "~/utils/validations";

export default function CreateAdminPage() {
  const navigation = useNavigate();
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
        min(8),
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

  const submission = useSubmission(createAdmin);
  const actionCreateAdmin = useAction(createAdmin);

  createEffect(() => {
    if (!submission.error && submission.result) {
      navigation("/admin/match");
    }
  });

  return (
    <div class="bg-white p-8 rounded">
      <h2 class="text-xl font-bold mb-10">
        Create Match
      </h2>
      <form
        class="flex flex-col gap-4"
        onSubmit={handleSubmit(async ({username, password, role, admin_permission}) => {
          await actionCreateAdmin({
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
