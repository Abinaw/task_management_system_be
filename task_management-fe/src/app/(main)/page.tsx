"use client";
import { TaskForm } from "@/components/task/task-form";
import { TableData, TaskTable } from "@/components/task/task-table";
import { apiClient } from "@/lib/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const getAllTask = async () => {
    try {
      await apiClient.get("/api/v1/tasks").then((res) => {
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
  return (
    <div className="h-full flex flex-col gap-2.5">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskForm callback={getAllTask} />
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
