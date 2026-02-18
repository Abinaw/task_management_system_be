"use client";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

const Home = () => {
  return (
    <Button
      variant={"destructive"}
      onClick={() => {
        Cookies.remove("token");
        redirect("/auth/sign-in");
      }}
    >
      Logout
    </Button>
  );
};

export default Home;
