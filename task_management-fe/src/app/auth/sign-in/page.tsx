import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center font-sans gap-2">
      <div className="p-10 border rounded-xl bg-sidebar shadow-sm">
        <div className="font-bold text-2xl">Login to your account</div>
        <div className="text-sm text-muted-foreground">
          Enter your email below to login to your account
        </div>
        <div className="mt-5 flex-col flex gap-3">
          <span className="font-medium">Email</span>
          <span>
            <Input type="email" placeholder="Enter your mail" />
          </span>
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
            <Input type="password" placeholder="Enter your password" />
          </span>
        </div>
        <div className="mt-6">
          <Button size={"lg"} className="w-full">
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
    </div>
  );
};

export default SignIn;
