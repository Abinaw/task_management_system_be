"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../common/data-table";
import { Badge } from "../ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { DeleteTask } from "./delete-task";
import { TaskForm } from "./task-form";

export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  userId: number;
  user: User | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TableData = {
  tasks: Task[];
  pagination: PaginationMeta;
};

export const TaskTable = ({
  getAllTask,
  tableData,
  loading,
}: {
  getAllTask: () => void;
  tableData: TableData | null;
  loading: boolean;
}) => {
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return <Badge>Done</Badge>;
      case Status.IN_PROGRESS:
        return (
          <Badge variant={"secondary"} className="bg-blue-500 text-white">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant={"secondary"} className="bg-amber-700 text-white">
            Todo
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return <Badge variant={"destructive"}>High</Badge>;
      case Priority.MEDIUM:
        return (
          <Badge variant={"secondary"} className="bg-amber-500 text-white">
            Medium
          </Badge>
        );
      default:
        return (
          <Badge variant={"secondary"} className="bg-blue-700 text-white">
            Low
          </Badge>
        );
    }
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "id",
      header: "Task ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description");

        return <div className="max-w-45 truncate">{description as string}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");

        return <div>{getStatusBadge(status as Status)}</div>;
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority");

        return <div>{getPriorityBadge(priority as Priority)}</div>;
      },
    },
    {
      accessorKey: "user",
      header: "Assigned To",
      cell: ({ row }) => {
        const user = row.getValue("user") as User;

        return <div>{user?.name ?? "Unassigned"}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated at",
      cell: ({ row }) => {
        const updatedAt: string = row.getValue("updatedAt");
        const formatted = new Date(updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return <div>{formatted ?? "N/A"}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Action",
      cell: ({ row }) => {
        const id: string = row.getValue("id");

        return (
          <div className="flex items-center gap-2">
            <TaskForm isUpdate data={row?.original} callback={getAllTask} />
            <DeleteTask id={Number(id)} callback={getAllTask} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <>
      <div className="h-full">
        {loading ? (
          <div className="size-full flex items-center justify-center">
            Loading
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData?.tasks ?? []}
            rowsPerPage={15}
          />
        )}
      </div>
    </>
  );
};
