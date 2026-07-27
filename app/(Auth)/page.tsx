import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import authOptions from "@/app/libs/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/users");
  }
  return (
    <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8 bg-gray-100 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="messagehub logo"
          width="60"
          height="60"
          priority
        />
        <h2 className="mt-1 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <AuthForm />
    </div>
  );
}
