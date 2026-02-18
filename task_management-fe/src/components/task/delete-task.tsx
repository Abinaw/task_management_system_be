"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { AxiosError } from "axios";

export const DeleteTask = ({
  id,
  callback,
}: {
  id: number;
  callback: () => void;
}) => {
  const [deleting, setDeleting] = useState(false);

  const deleteTask = async (id: number) => {
    if (!id) {
      toast.error("Id is missing.");
      setDeleting(false);
      return null;
    }

    try {
      await apiClient.delete(`/api/v1/tasks/${id}`).then(() => {
        toast.success("Task deleted Successfully.");
        setDeleting(false);
        callback();
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setDeleting(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Trash2 className="text-destructive cursor-pointer" size={16} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"} disabled={deleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant={"destructive"}
              disabled={deleting}
              onClick={() => deleteTask(id)}
            >
              {deleting && <Loader className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
