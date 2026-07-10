"use client";
import axios from "axios";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRef } from "react";
import clsx from "clsx";

import useConversation from "@/app/hooks/useConversation";
import { CldUploadButton } from "next-cloudinary";
import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";

interface MessageFormProps {
  setMessages: React.Dispatch<React.SetStateAction<FullMessageType[]>>;
  currentUser: User;
}

const MessageForm: React.FC<MessageFormProps> = ({ setMessages, currentUser }) => {
  const { conversationId } = useConversation();
  const inputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ""
    }
  });

  const { ref: formRef, ...messageRegister } = register("message", { required: true });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const text = data.message;

    if (!text?.trim()) return;

    setValue("message", "", { shouldValidate: false });

    const clientId = crypto.randomUUID();

    const tempMessage: FullMessageType = {
      id: `temp-${clientId}`,
      clientId,
      body: text,
      image: null,
      createdAt: new Date(),
      conversationId,
      senderId: currentUser.id,
      seenIds: [],
      sender: currentUser,
      seen: [],
      pending: true,
    };

    // ✅ Instant UI
    setMessages((current) => [...current, tempMessage]);

    try {
      await axios.post("/api/messages", {
        message: text,
        conversationId,
        clientId
      });
    } catch {
      // Remove temp message if request fails
      setMessages((current) =>
        current.filter((message) => message.id !== clientId),
      );
    }
  };

  const handleUpload = async (result: unknown) => {
    const secureUrl = (result as { info?: { secure_url?: string } })?.info?.secure_url;

    await axios.post("/api/messages", {
      image: secureUrl,
      conversationId
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex gap-2 items-center w-full lg:gap-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="MessageHub_preset"
      >
        <HiPhoto
          size={30}
          className="text-sky-500 cursor-pointer hover:text-sky-600"
        />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 items-center w-full lg:gap-4"
      >
        <input
          id="message"
          type="text"
          autoComplete="message"
          placeholder="Write a message"
          {...messageRegister}
          ref={(element) => {
            formRef(element);
            inputRef.current = element;
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
            errors.message && "focus:ring-rose-500",
          )}
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
}

export default MessageForm;
