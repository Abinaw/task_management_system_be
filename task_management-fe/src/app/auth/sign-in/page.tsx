"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { Loader, Router } from "lucide-react";
import { useRouter } from "next/navigation";

type SigninValues = {
  email: string;
  password: string;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const router = useRouter();

  const handleSigninUser = async (
    values: SigninValues,
    { setSubmitting }: FormikHelpers<SigninValues>,
  ) => {
    console.log("values : ", values);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setSubmitting(false);
    router.push("/auth/sign-up");
  };

  const signinForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSigninUser,
    isInitialValid: true,
  });

  const {
    errors,
    isSubmitting,
    isValid,
    touched,
    handleSubmit,
    getFieldProps,
  } = signinForm;

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center font-sans gap-2">
      <form onSubmit={handleSubmit}>
        <div className="p-10 border rounded-xl bg-sidebar shadow-sm">
          <div className="font-bold text-2xl">Login to your account</div>
          <div className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </div>
          <div className="mt-5 flex-col flex gap-3">
            <span className="font-medium">Email</span>
            <span>
              <Input
                type="email"
                placeholder="Enter your mail"
                {...getFieldProps("email")}
              />
            </span>
            {touched.email && errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="mt-5 flex justify-between">
              <span className="font-medium">Password</span>
              <span>
                <a href="#" className="text-sm hover:underline">
                  Forgot your password?
                </a>
              </span>
            </div>
            <span>
              <Input
                type="password"
                placeholder="Enter your password"
                {...getFieldProps("password")}
              />
            </span>
            {touched.password && errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="mt-6">
            <Button
              size={"lg"}
              className="w-full"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && <Loader className="animate-spin" />}
              Login
            </Button>
          </div>
          <p className="w-full text-center mt-2 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="underline hover:font-medium">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
