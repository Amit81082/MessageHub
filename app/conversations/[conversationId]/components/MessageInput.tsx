import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import clsx from "clsx";

interface MessageInputProps {
  id: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  placeholder,
  type = "text",
  register,
  errors,
  required,
}) => {
  return (
    <input
      id={id}
      type={type}
      autoComplete={id}
      {...register(id, {
        required,
      })}
      className={clsx(
        `
          w-full
          rounded-full
          border-0
          bg-neutral-100
          px-4
          py-3
          text-black
          focus:outline-none
          focus:ring-2
          focus:ring-sky-500
        `,
        errors[id] && "focus:ring-rose-500",
      )}
      placeholder={placeholder}
    />
  );
};

export default MessageInput;
