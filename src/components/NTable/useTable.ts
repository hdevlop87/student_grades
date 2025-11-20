import { useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  ColumnDef,
} from "@tanstack/react-table";
import { useKeyboard } from "@/hooks/useKeyboard";

interface TableConfig {
  pageSize?: number;
}

interface UseTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  config?: TableConfig;
  onBulkDelete?: any
}

export function useTable<T extends { id: string | number }>({
  data,
  columns,
  config = {},
  onBulkDelete
}: UseTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: config.pageSize || 10,
      },
    },
  });

  useKeyboard('ctrl+a', () => {
    table.getRowModel()
      .rows.forEach(row => row.toggleSelected(true));
  });

  useKeyboard('escape', () => {
    table.toggleAllRowsSelected(false);
  });

  useKeyboard('delete', () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0 && onBulkDelete) {
      const selectedIds = selectedRows.map((row) => row.original?.id);
      onBulkDelete(selectedIds);
      table.toggleAllRowsSelected(false);
    }
  });

  return {
    table,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter
  };
}