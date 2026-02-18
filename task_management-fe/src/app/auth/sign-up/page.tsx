"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

type SignupValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one symbol",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const SignUp = () => {
  const router = useRouter();

  const handleCreateUser = async (
    values: SignupValues,
    { setSubmitting }: FormikHelpers<SignupValues>,
  ) => {
    console.log("values : ", values);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setSubmitting(false);
    router.push("/auth/sign-in");
  };

  const createForm = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleCreateUser,
    isInitialValid: true,
  });

  const { errors, isSubmitting, isValid, touched, handleSubmit } = createForm;

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center font-sans gap-2">
      <div className="p-10 border rounded-xl bg-sidebar shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="font-bold text-2xl">Create your account</div>
          <div className="text-sm text-muted-foreground">
            Enter your information to create your account
          </div>
          <div className="mt-5 flex-col flex gap-3">
            <span className="font-medium">Username</span>
            <span>
              <Input
                type="text"
                placeholder="Enter your username"
                {...createForm.getFieldProps("username")}
              />
            </span>
            {touched.username && errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="mt-5 flex-col flex gap-3">
            <span className="font-medium">Email</span>
            <span>
              <Input
                type="email"
                placeholder="Enter your mail"
                {...createForm.getFieldProps("email")}
              />
            </span>
            {touched.email && errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="mt-5 flex justify-between">
              <span className="font-medium">Password</span>
            </div>
            <span>
              <Input
                type="password"
                placeholder="Enter your password"
                {...createForm.getFieldProps("password")}
              />
            </span>
            {touched.password && errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="mt-5 flex justify-between">
              <span className="font-medium">Confirm Password</span>
            </div>
            <span>
              <Input
                type="password"
                placeholder="Enter your password"
                {...createForm.getFieldProps("confirmPassword")}
              />
            </span>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
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
              Create Account
            </Button>
          </div>
        </form>

        <p className="w-full text-center mt-2 text-sm">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="underline hover:font-medium">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
