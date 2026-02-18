"use client";
import { ChevronDown, PackageCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const Header = () => {
  return (
    <div className="h-13 w-full bg-sidebar-accent border-b flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary size-8.5 flex items-center justify-center rounded-md">
          <PackageCheck className="text-background" size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold">Task Management</p>
          <p className="text-xs font-medium text-muted-foreground">
            Track your tasks.
          </p>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="max-w-23 overflow-hidden">
            <span className="block truncate">username</span> <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>username</PopoverTitle>
            <PopoverDescription>email</PopoverDescription>
          </PopoverHeader>
          <Button
            variant={"destructive"}
            onClick={() => {
              Cookies.remove("token");
              redirect("/auth/sign-in");
            }}
            className="w-full mt-4"
          >
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
