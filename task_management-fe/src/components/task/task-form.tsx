import { useEffect, useState } from "react";
import { Priority, Status, Task, User } from "./task-table";
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
import { Loader, Pencil } from "lucide-react";
import { apiClient } from "@/lib/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TextField } from "../common/text-filed";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";

type TaskForm = {
  title: string;
  description: string;
  userId: number | null;
  status: Status;
  priority: Priority;
};

const intialValues = {
  title: "",
  description: "",
  userId: null,
  status: Status.TODO,
  priority: Priority.LOW,
};

export const TaskForm = ({
  data,
  isUpdate,
  callback,
}: {
  data?: Task;
  isUpdate?: boolean;
  callback: () => void;
}) => {
  const [isUserFetching, setIsUserFetching] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  const Unassigned = "Unassigned";

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const createOrUpdateTask = async (
    values: TaskForm,
    { setSubmitting }: FormikHelpers<TaskForm>,
  ) => {
    setSubmitting(true);
    try {
      if (isUpdate) {
        await apiClient
          .put("/api/v1/tasks", { ...values, id: data?.id })
          .then(() => {
            toast.success("Task updated Successfully.");
          });
      } else {
        await apiClient.post("/api/v1/tasks", values).then(() => {
          toast.success("Task created Successfully.");
        });
      }

      setSubmitting(false);
      await callback();
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  const taskForm = useFormik<TaskForm>({
    initialValues: intialValues,
    onSubmit: createOrUpdateTask,
    validationSchema,
    isInitialValid: true,
  });

  const {
    setValues,
    getFieldProps,
    errors,
    isSubmitting,
    isValid,
    touched,
    values,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = taskForm;

  useEffect(() => {
    if (!open) return;

    getAllUsers();

    if (isUpdate) {
      setValues(data as Task);
    } else {
      resetForm({ values: intialValues });
    }
  }, [open]);

  const getAllUsers = async () => {
    setIsUserFetching(true);
    try {
      await apiClient.get("/api/v1/users").then((res) => {
        if (res) setUsers(res?.data?.users);
      });

      setIsUserFetching(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setIsUserFetching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          {isUpdate ? (
            <Pencil
              size={16}
              className="text-muted-foreground cursor-pointer"
            />
          ) : (
            <Button className="">New Task</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{isUpdate ? "Update" : "Create New"} Task</DialogTitle>
            <DialogDescription>
              {isUpdate
                ? "Modify the details below to update this task."
                : "Fill in the required details to create a new task."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-12 gap-3 mt-3">
            <div className="col-span-12">
              <TextField
                label="Title"
                placeholder="Enter task title"
                {...getFieldProps("title")}
                errors={touched.title && errors.title ? errors.title : ""}
              />
            </div>
            <div className="col-span-12">
              <span className="font-medium">Description</span>
              <Textarea
                placeholder="Enter task description"
                {...getFieldProps("description")}
              />
              {touched.description && errors.description ? (
                <p className="text-xs text-red-500 mt-2">
                  {errors.description}
                </p>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-12">
              <span className="font-medium">Assign TO</span>
              <Select
                value={values.userId ? values.userId.toString() : Unassigned}
                onValueChange={(value) =>
                  setFieldValue(
                    "userId",
                    value === "Unassigned" ? null : Number(value),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Unassigned}>Unassigned</SelectItem>
                    {!isUserFetching &&
                      users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12">
              <span className="font-medium">Status</span>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setFieldValue("status", value as Status)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Status.TODO}>Todo</SelectItem>
                    <SelectItem value={Status.IN_PROGRESS}>
                      In progress
                    </SelectItem>
                    <SelectItem value={Status.DONE}>Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-12">
              <span className="font-medium">Priority</span>
              <Select
                value={values.priority}
                onValueChange={(value) =>
                  setFieldValue("priority", value as Priority)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select riority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            {/* TODO - Use isValid for disbled with isSubmitting */}
            <Button
              disabled={isSubmitting && !isValid}
              type="submit"
              onClick={() => handleSubmit()}
            >
              {isSubmitting && <Loader className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
