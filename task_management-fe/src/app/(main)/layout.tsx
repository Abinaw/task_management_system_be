import { Header } from "@/components/common/header";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-dvh w-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto p-2.5">{children}</div>
    </div>
  );
};

export default MainLayout;
