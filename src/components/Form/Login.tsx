import { useAction, useSubmission } from "@solidjs/router";
import InputField from "./InputField";
import { useForm } from "~/compose/useForm";
import { min } from "~/utils/validations";
import { INITIAL_FIELD, USER } from "~/lib/admin";
import { loginUser } from "~/api/auth";
import { Show } from "solid-js";

type LoginProps = {
  type: USER;
};

export default function LoginForm({ type = "admin" }: LoginProps) {
  const { fields, handleSubmit } = useForm(INITIAL_FIELD, {
    username: [min(2)],
    password: [min(8)],
  });

  const submission = useSubmission(loginUser);
  const loginAction = useAction(loginUser);

  return (
    <form
      class="flex flex-col lg:w-2/3 w-full gap-6 items-center rounded p-8"
      onSubmit={handleSubmit(async ({ username, password }) => {
        await loginAction(username, password, type);
      })}
    >
      <label class="text-left w-full">
        <h1 class="text-5xl text-mj-green-400 dark:text-white font-bold">
          Login
        </h1>
      </label>
      <InputField
        onInput={fields["username"].setValue}
        error={fields["username"].error}
        placeholder="Type Username..."
      />
      <InputField
        typeInput="password"
        onInput={fields["password"].setValue}
        error={fields["password"].error}
        placeholder="Type Password..."
      />
      <button
        class="w-full dark:bg-mj-green bg-mj-green-400 dark:text-white p-4 text-gray-700 rounded font-bold text-xl"
        type="submit"
      >
        Login
      </button>
      <Show when={submission.result}>
        <span class="text-left text-rose-700">{submission.result}</span>
      </Show>
    </form>
  );
}
