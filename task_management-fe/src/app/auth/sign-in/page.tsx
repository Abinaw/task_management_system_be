"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiAuthClient } from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { TextField } from "@/components/common/text-filed";

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
    try {
      await apiAuthClient.post("/api/v1/auth/login", values).then((res) => {
        const { token, user } = res.data;
        Cookies.set("token", token);
        setSubmitting(false);
        router.push("/");
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setSubmitting(false);
    }
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
    handleSubmit,
    getFieldProps,
    touched,
  } = signinForm;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center font-sans gap-2">
      <form onSubmit={handleSubmit}>
        <div className="p-10 border rounded-xl bg-sidebar shadow-sm">
          <div className="font-bold text-2xl">Login to your account</div>
          <div className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </div>
          <div className="space-y-4 mt-5">
            <TextField
              label="Email"
              type="email"
              placeholder="Enter your mail"
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
