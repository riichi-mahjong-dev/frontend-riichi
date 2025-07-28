import { createSignal } from "solid-js";

type ValidationRule = (value: any) => string | null;

type FieldState = {
    value: () => string;
    error: () => string | null;
    rules: ValidationRule[];
    setValue: (value: any) => void;
    setError: (error: string | null) => void;
}

type UseFormReturn<T> = {
    fields: Record<keyof T, FieldState>;
    handleSubmit: (onSubmit: (value: T) => void) => (e: Event) => void;
}

export function useForm<T extends Record<string, any>>(initialValues: T, rules: Record<keyof T, ValidationRule[]>): UseFormReturn<T> {
    const fields: Record<keyof T, FieldState> = {} as Record<keyof T, FieldState>;

    for (const key in initialValues) {
        const initialValue = initialValues[key];
        const fieldRules = rules[key];

        const [value, setValue] = createSignal<any>(initialValue);
        const [error, setError] = createSignal<string|null>(null);

        fields[key] = {
            value: () => value(),
            error: () => error(),
            rules: fieldRules,
            setValue: (newValue: any) => {
                setValue(newValue);
            },
            setError: (newError: string|null) => {
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
        field.setError(null);
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
            values[key] = field.value();
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
