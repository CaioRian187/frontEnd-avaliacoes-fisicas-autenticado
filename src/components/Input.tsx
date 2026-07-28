interface InputProps {
    classname: string,
    placeholder: string,
    value: string | number | undefined,
    type: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ classname, placeholder, value, type, onChange }: InputProps) => {
    return (
        <input
            value={value}
            placeholder={placeholder}
            className={classname}
            onChange={onChange}
            type={type}
            required
        />
    );
}