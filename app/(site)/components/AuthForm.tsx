"use client";
import React from "react";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import Button from "../../components/inputs/Button";
import AuthSocialButton from "./AuthSocialButton";
// import colorfull social icons of google and github
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      if (variant === "REGISTER") {
        await axios.post("/api/register", data);
        toast.success("Account created successfully");
        const callback = await signIn("credentials", {
          email: data?.email,
          password: data?.password,
          redirect: false,
        });

        if (callback?.ok) {
          toast.success("Welcome to MessageHub");
          router.refresh();
        }
        if (callback?.error) {
          toast.error("Unable to sign in after registration");
        }

        return;
      }

      if (variant === "LOGIN") {
        const callback = await signIn("credentials", {
          email: data?.email,
          password: data?.password,
          redirect: false,
        });

        if (callback?.ok) {
          router.refresh();
        }

        if (callback?.error) {
          toast.error("Invalid email or password");
          console.log(callback.error);
        }
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  const socialAction = (action: string) => {
    setIsLoading(true);
    // TODO: SOCIAL SIGN IN
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }
        if (callback?.ok) {
          toast.success("Welcome to MessageHub");
          router.refresh();
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              register={register}
              errors={errors}
              disabled={isLoading}
              required
              label="Name"
              id="name"
            />
          )}
          <Input
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            label="Email address"
            id="email"
            type="email"
          />

          <Input
            register={register}
            errors={errors}
            disabled={isLoading}
            required
            label="Password"
            id="password"
            type="password"
          />
          {/* Button component */}
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        {/* TODO: SOCIAL SIGN IN */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={AiFillGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={FcGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to MessageHub?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
