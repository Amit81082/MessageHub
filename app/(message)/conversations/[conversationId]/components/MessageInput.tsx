import { FieldErrors, FieldValues, UseFormRegister, UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";
import { useEffect, useRef } from "react";

interface MessageInputProps {
  id: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  autoFocus?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  placeholder,
  type = "text",
  register,
  errors,
  required,
  autoFocus,
}) => {
  const { ref, ...rest } = register(id, {
    required,
  }) as UseFormRegisterReturn;

  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && internalRef.current) {
      internalRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      id={id}
      type={type}
      autoComplete={id}
      {...rest}
      ref={(element) => {
        ref(element);
        internalRef.current = element;
      }}
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
