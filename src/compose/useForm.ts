import { createSignal } from "solid-js/types/server/reactive.js";

type ValidationRule = (value: string) => string | undefined;

type FieldState = {
    value: () => string;
    error: () => string | undefined;
    rules: ValidationRule[];
    setValue: (value: any) => void;
    setError: (error: string | undefined) => void;
}

type UseFormReturn<T> = {
    fields: Record<keyof T, FieldState>;
    handleSubmit: (onSubmit: (value: T) => void) => (e: Event) => void;
}

export function useForm<T extends Record<string, string>>(initialValues: T, rules: Record<keyof T, ValidationRule[]>): UseFormReturn<T> {
    const fields: Record<keyof T, FieldState> = {} as Record<keyof T, FieldState>;

    for (const key in initialValues) {
        const initialValue = initialValues[key];
        const fieldRules = rules[key];

        const [value, setValue] = createSignal<any>(initialValue);
        const [error, setError] = createSignal<string|undefined>(undefined);

        fields[key] = {
            value: () => value(),
            error: () => error(),
            rules: fieldRules,
            setValue: (newValue: any) => {
                setValue(newValue);
            },
            setError: (newError: string|undefined) => {
                setError(newError);
            }
        };
    }

    const validateField = (key: keyof T) => {
        const field = fields[key];
        for (const rule of field.rules) {
            const validationError = rule(field.value());
            if (validationError) {
                field.setError(validationError);
                return false;
            }
        }
        field.setError(undefined);
        return true;
    }

    const handleSubmit = (onSubmit: (value: T) => void) => (e: Event) => {
        e.preventDefault();

        const values: Record<string, any> = {};
        let isValid: boolean = true;

        for (const key in fields) {
            const field = fields[key];
            if (!validateField(key as keyof T)) {
                isValid = false;
            }
            values[key] = field.value;
        }

        if (isValid) {
            onSubmit(values as T);
        }
    }

    return {
        fields,
        handleSubmit,
    }
}