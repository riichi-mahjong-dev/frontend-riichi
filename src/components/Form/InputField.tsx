import { Accessor, createEffect, Show } from "solid-js";

type UsernameProps = {
    name?: string;
    onInput: (value: string) => void;
    placeholder: string;
    label?: string | null;
    error?: Accessor<string | null>;
    typeInput?: 'text' | 'password';
}

export default function InputField({
    name,
    onInput,
    placeholder,
    label,
    error,
    typeInput = 'text',
}: UsernameProps) {
    return (
        <div class="w-full">
            <Show when={label}>
                <label class="text-left w-full">
                  <h1 class="text-5xl text-mj-green-400 dark:text-white font-bold">{label}</h1>
                </label>
            </Show>
            <div class={`flex w-full bg-white p-4 rounded border ${error && error() ? 'dark:border-rose-800' : 'dark:border-mj-green'} ${error && error() ? 'border-rose-700' : 'border-mj-green-400'}`}>
                <input
                    class="w-full outline-none focus:outline-none focus:ring-0 text-gray-700 text-lg"
                    onInput={(e) => onInput(e.target.value)}
                    placeholder={placeholder}
                    type={typeInput}
                    name={name}
                />
            </div>
            <Show when={error && error()}>
                <span class="text-rose-700">
                    {error && error()}
                </span>
            </Show>
        </div>
    );
}
