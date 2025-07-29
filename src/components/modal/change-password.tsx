import { createEffect, Show } from "solid-js";
import Modal from "~/components/ui/Modal";
import { useForm } from "~/compose/useForm";
import { min } from "~/utils/validations";
import Input from "../ui/Input";
import { useAction, useSubmission } from "@solidjs/router";
import Button from "../ui/Button";
import { updatePasswordPlayer } from "~/api/player";
import { updatePasswordAdmin } from "~/api/admin";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  type: 'admin' | 'player';
};

export default function ChangePasswordModal(props: ChangePasswordModalProps) {
  const {
    fields,
    handleSubmit,
  } = useForm(
    {
      old_password: "",
      new_password: "",
    },
    {
      old_password: [min(8)],
      new_password: [min(8)],
    }
  );

  const submission = useSubmission(props.type === 'player' ? updatePasswordPlayer : updatePasswordAdmin);
  const actionUpdatePasswordPlayer = useAction(props.type === 'player' ? updatePasswordPlayer : updatePasswordAdmin);

  createEffect(() => {
    console.log(submission.error)
    if (!submission.error && submission.result) {
      console.log("yes")
      props.onClose();
    }
  });

  return (
    <Modal open={props.open} onClose={props.onClose} title="Change Password">
      <form
        class="space-y-4"
        onSubmit={handleSubmit(async ({ old_password, new_password }) => {
          await actionUpdatePasswordPlayer({ old_password, new_password });
        })}
      >
        <Input
          label="Old Password"
          name="old_password"
          type="password"
          value={fields.old_password.value()}
          onInput={(e) => fields.old_password.setValue(e.currentTarget.value)}
          error={fields.old_password.error()}
        />
        <Input
          label="New Password"
          name="new_password"
          type="password"
          value={fields.new_password.value()}
          onInput={(e) => fields.new_password.setValue(e.currentTarget.value)}
          error={fields.new_password.error()}
        />

        <Show when={submission.error}>
          <p class="text-red-500 text-sm">{submission.error.message}</p>
        </Show>

        <div class="flex justify-end">
          <Button
            size="lg"
            variant="outline"
            type="submit"
            isLoading={submission.pending}
          >
            Update Password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
