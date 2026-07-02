"use client";

import axios from "axios";
import { HiPhoto, HiPaperAirplane } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useConversation from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";




const MessageForm = () => {
  const { conversationId } = useConversation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      message: ""
    }
  });



  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", { ...data, conversationId });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
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
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
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
