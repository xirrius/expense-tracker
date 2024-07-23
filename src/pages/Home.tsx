import TransactionForm from "../components/molecules/TransactionForm";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { columns, Payment } from "../components/ui/TransactionsColumn";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import useStore from "../store";

const Home = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const navigate = useNavigate();
  const { loggedIn, logOut } = useStore();
  const [list, setList] = useState<Payment[]>([
    {
      amount: 0,
      description: "",
      title: "",
      transactionType: "",
      date: "",
      uid: "",
      id: "",
    },
  ]);

  const deleteSelectedTransactions = async () => {
    const idsToDelete = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => {
        // Convert key to number if list is an array and the key is a valid index
        const index = parseInt(key, 10);
        if (!isNaN(index) && index >= 0 && index < list.length) {
          return list[index].id;
        }
        return null;
      })
      .filter((id): id is string => id !== null);
    console.log("IDs to delete:", idsToDelete);
    idsToDelete.forEach(async (id) => {
      await deleteDoc(doc(db, "transactions", id));
    });
    setRowSelection({});
    getData();
  };

  const getData = async () => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "transactions"),
        where("uid", "==", auth.currentUser?.uid)
      )
    );
    const newList: any = [];
    querySnapshot.forEach((doc) => {
      newList.push({ id: doc.id, ...doc.data() });
    });
    newList.reverse();
    setList(newList);
    calculateTotals(list);
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
    getData();
  }, []);

  async function signout() {
    logOut();
    signOut(auth).then(() => {
      console.log("clicked");
      navigate("/login");
    });
  }

  const calculateTotals = (transactions: Payment[]) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      if (transaction.transactionType === "Income") {
        income += transaction.amount;
      } else if (transaction.transactionType === "Expense") {
        expense += transaction.amount;
      }
    });

    // Update the state with totals
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  const table = useReactTable({
    data: list,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      {console.log(list)}
      <h1 className="text-center text-5xl mt-6 font-bold my-8">
        Expense Tracker
      </h1>

      <div className="mx-20 p-4 shadow-md rounded-xl flex gap-6">
        <p className="font-semibold">
          Balance : <span className="bg-slate-200 py-1 px-2 rounded shadow-sm">{totalIncome - totalExpense} </span>
        </p>
        <p className="font-semibold">
          Income : <span className="bg-slate-200 py-1 px-2 rounded shadow-sm">{totalIncome}</span>
        </p>
        <p className="font-semibold">
          Expense : <span className="bg-slate-200 py-1 px-2 rounded shadow-sm">{totalExpense}</span>{" "}
        </p>
      </div>

      <div className="my-4 mx-20">
        <div className="flex justify-between items-center py-4">
          <Input
            placeholder="Filter transactions..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger>
                <Button className="">Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                  <DialogDescription>
                    Manage your finances, keep updating your transactions.
                  </DialogDescription>
                </DialogHeader>
                <TransactionForm getData={getData} />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto ">
                  <MoreHorizontal className="h-4 w-4" />{" "}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem></DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="bg-transparent text-black w-full hover:bg-gray-100"
                    onClick={deleteSelectedTransactions}
                  >
                    Delete
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    className="bg-transparent text-black w-full hover:bg-gray-100"
                    onClick={signout}
                  >
                    Sign Out{" "}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* <DataTable columns={columns} data={list}></DataTable> */}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
