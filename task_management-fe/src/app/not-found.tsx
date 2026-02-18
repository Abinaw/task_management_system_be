import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center font-sans gap-2">
      <div className="text-9xl font-bold">404</div>
      <div className="text-4xl text-muted-foreground font-bold">
        Oops, This Page Not Found!
      </div>
      <div className="text-3xl text-muted-foreground/30">
        The Link might be corrupte{" "}
      </div>
      <div>or the page may have been removed</div>
      <div className="mt-5">
        <Button size={"lg"}>Go back Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
