"use client";
import { TaskForm } from "@/components/task/task-form";
import {
  Priority,
  Status,
  TableData,
  TaskTable,
} from "@/components/task/task-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Filter = {
  status?: Status | null;
  priority?: Priority | null;
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [filters, setFilters] = useState<Filter | null>(null);

  const getAllTask = async () => {
    try {
      let url = "/api/v1/tasks";
      if (filters) {
        url = `${url}/filter?status=${filters?.status ?? ""}&priority=${filters?.priority ?? ""}`;
      }
      await apiClient.get(url).then((res) => {
        if (res) {
          setTableData(res?.data);
        }
        setLoading(false);
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage =
        err.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTask();
  }, [filters]);

  return (
    <div className="h-full flex flex-col gap-2.5">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-3">
          <Select
            value={filters?.priority ? filters?.priority : "ALL"}
            onValueChange={(value) => {
              const priority = value;
              setFilters({
                ...filters,
                priority: priority === "ALL" ? null : (value as Priority),
              });
            }}
            defaultValue={"ALL"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"ALL"}>All</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={filters?.status ? filters?.status : "ALL"}
            onValueChange={(value) => {
              const status = value;
              setFilters({
                ...filters,
                status: status === "ALL" ? null : (value as Status),
              });
            }}
            defaultValue={"ALL"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"ALL"}>All</SelectItem>
                <SelectItem value={Status.TODO}>Todo</SelectItem>
                <SelectItem value={Status.IN_PROGRESS}>In progress</SelectItem>
                <SelectItem value={Status.DONE}>Done</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TaskForm callback={getAllTask} />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <TaskTable
          getAllTask={getAllTask}
          loading={loading}
          tableData={tableData}
        />
      </div>
    </div>
  );
};

export default Home;
