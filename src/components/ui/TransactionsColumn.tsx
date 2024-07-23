"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  title: string;
  description: string;
  amount: number;
  transactionType: string;
  uid: string;
  id: string;
  date:
    | {
        seconds: number;
        nanoseconds: number;
      }
    | string
    | Date;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          className=""
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "transactionType",
    header: () => <div className="text-center">Income/Expense</div>,
    cell: ({ row }) => {
      const ieValue = row.getValue("transactionType") as "Income" | "Expense";
      return <div className="text-center">{ieValue}</div>;
    },
  },
  {
    accessorKey: "date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => {
      const dateValue = row.getValue("date");
      let formattedDate = "Invalid Date";

      if (dateValue) {
        if (typeof dateValue === "object" && "seconds" in dateValue) {
          // It's a Firestore timestamp
          const { seconds } = dateValue as { seconds: number }; // Explicitly assert the type
          formattedDate = format(new Date(seconds * 1000), "dd MMM yyyy");
        } else if (dateValue instanceof Date) {
          // It's already a Date object
          formattedDate = format(dateValue, "dd MMM yyyy");
        } else if (typeof dateValue === "string") {
          // It's a string, attempt to parse it
          const parsedDate = new Date(dateValue);
          if (!isNaN(parsedDate.getTime())) {
            formattedDate = format(parsedDate, "dd MMM yyyy");
          }
        }
      }

      return <div className="text-center font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.amount.toString())
              }
            >
              Copy transaction amount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
