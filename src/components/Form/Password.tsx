import { Show } from "solid-js";

type PasswordProps = {
    value: string;
    onInput: (value: string) => void;
    placeholder: string;
    label?: string | null;
    error?: string | null;
}

export default function Password({
    value,
    onInput,
    placeholder,
    label,
    error,
}: PasswordProps) {
    return (
        <div class={`px-1 py-2 border ${error ? 'border-rose-700' : 'border-black'}`}>
            <Show when={label}>
                <label class="text-sm font-medium">{label}</label>
            </Show>
            <input
                type="password"
                value={value}
                onInput={(e) => onInput(e.target.value)}
                placeholder={placeholder}
            />
            <Show when={error}>
                <span class="text-rose-700">
                    {error}
                </span>
            </Show>
        </div>
    );
}