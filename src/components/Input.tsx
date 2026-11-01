interface InputProps {
    classname: string,
    placeholder: string,
    value: string | number | undefined,
    type: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number;
    minLength?: number;
    min?: number | string;
    max?: number | string;
    autoComplete?: string;
    required?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export const Input = ({
    classname,
    placeholder,
    value,
    type,
    onChange,
    maxLength,
    minLength,
    min,
    max,
    autoComplete,
    required = true,
    inputMode,
}: InputProps) => {
    return (
        <input
            value={value}
            placeholder={placeholder}
            className={classname}
            onChange={onChange}
            type={type}
            maxLength={maxLength}
            minLength={minLength}
            min={min}
            max={max}
            autoComplete={autoComplete}
            inputMode={inputMode}
            required={required}
        />
    );
}
