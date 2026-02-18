"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { TextField } from "@/components/common/text-filed";
import { apiAuthClient } from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";

type SignupValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "name must be at least 3 characters")
    .required("name is required"),
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
    try {
      await apiAuthClient.post("/api/v1/auth/register", values).then((res) => {
        setSubmitting(false);
        router.push("/auth/sign-in");
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  const createForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleCreateUser,
    isInitialValid: true,
  });

  const {
    errors,
    isSubmitting,
    isValid,
    touched,
    handleSubmit,
    getFieldProps,
  } = createForm;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center font-sans gap-2">
      <div className="p-10 border rounded-xl bg-sidebar shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="font-bold text-2xl">Create your account</div>
          <div className="text-sm text-muted-foreground">
            Enter your information to create your account
          </div>
          <div className="space-y-4 mt-5">
            <TextField
              label="Name"
              type="text"
              placeholder="John Doe"
              {...getFieldProps("name")}
              errors={touched.name && errors.name ? errors.name : ""}
            />
            <TextField
              label="Email"
              type="email"
              placeholder="john@example.com"
              {...getFieldProps("email")}
              errors={touched.email && errors.email ? errors.email : ""}
            />
            <TextField
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...getFieldProps("password")}
              errors={
                touched.password && errors.password ? errors.password : ""
              }
            />
            <TextField
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              {...getFieldProps("confirmPassword")}
              errors={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : ""
              }
            />
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

        <p className="w-full text-center mt-2 text-sm gap-x-2 flex items-center justify-center">
          Already have an account?
          <Link href="/auth/sign-in" className="underline hover:font-medium">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
