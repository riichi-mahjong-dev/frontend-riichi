import { useAction } from "@solidjs/router";
import InputField from "./InputField";
import { useForm } from "~/compose/useForm";
import { min } from "~/utils/validations";
import { INITIAL_FIELD, loginSubmit, USER } from "~/lib/admin";

type LoginProps = {
    type: USER,
};

export default function LoginForm({
    type = 'admin',
}: LoginProps) {
    const {
        fields,
        handleSubmit,
    } = useForm(INITIAL_FIELD, {
        'username': [
            min(2)
        ],
        'password': [
            min(8),
        ],
    });

    const loginAction = useAction(loginSubmit);

    return (
        <form
            class="flex flex-col lg:w-2/3 w-full gap-6 items-center rounded p-8"
            onSubmit={handleSubmit(async ({username, password}) => {
                const response = await loginAction(username, password, type);

                if (response.status === 'error' && response.field) {
                    fields[response.field].setError(response.message);
                }
            })}
        >
            <label class="text-left w-full">
              <h1 class="text-5xl text-mj-green-400 dark:text-white font-bold">Login</h1>
            </label>
            <InputField
                value={fields['username'].value}
                onInput={fields['username'].setValue}
                error={fields['username'].error}
                placeholder="Type Username..."/>
            <InputField
                typeInput="password"
                value={fields['password'].value}
                onInput={fields['password'].setValue}
                error={fields['password'].error}
                placeholder="Type Password..."/>
            <button
                class="w-full dark:bg-mj-green bg-mj-green-400 text-white p-4 text-gray-700 rounded font-bold text-xl"
                type="submit">
                Login
            </button>
        </form>
    );
}
