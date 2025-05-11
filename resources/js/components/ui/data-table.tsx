import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import axios from "@/lib/axios";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LoaderCircle, MoreHorizontal } from "lucide-react";
import { DataTableProps } from "@/types/table";
import { useTranslation } from "@/lib/i18n";
import { Checkbox } from "./checkbox";
import { toast } from "sonner";

const generatePaginationNumbers = (currentPage: number, lastPage: number) => {
    const delta = 2;
    const range: (number | string)[] = [];
    
    for (let i = 1; i <= lastPage; i++) {
        if (
            i === 1 || 
            i === lastPage || 
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            range.push(i);
        } else if (range[range.length - 1] !== '...') {
            range.push('...');
        }
    }
    
    return range;
}

const LoadingOverlay = () => {
    return (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[1px] rounded-md">
            <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
        </div>
    );
};

export interface DataTableRef {
    refreshData: () => Promise<void>;
}

export const DataTable = forwardRef<DataTableRef, DataTableProps<any>>(({ 
    columns, 
    apiUrl,
    defaultPageSize = 10,
    defaultPageSizeOptions = [10, 20, 30, 40, 50],
    actionItems = [],
    indexColumn = false,
    bulkActions = [],
    enableRowSelection = false,
    onSelectedRowsChange = () => {}
}, ref) => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([]);
    const { pagination, setPagination } = usePagination({
        page_size: defaultPageSize,
        page_size_options: defaultPageSizeOptions
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState({});

    useImperativeHandle(ref, () => ({
        refreshData: fetchData
    }));

    const tableColumns = useMemo(() => {
        const finalColumns: ColumnDef<any>[] = [];

        if (enableRowSelection) {
            finalColumns.push({
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => {
                            table.toggleAllPageRowsSelected(!!value);
                        }}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                        }}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            });
        }

        if (indexColumn) {
            const indexCol: ColumnDef<any> = {
                id: "index",
                header: t('table.index'),
                cell: ({ row }) => row.index + 1
            };

            finalColumns.push(indexCol);
        }

        finalColumns.push(...columns);

        if (actionItems?.length) {
            const actionColumn: ColumnDef<any> = {
                id: "actions",
                header: t('table.action'),
                cell: ({ row }) => {
                    const ignoreHidden = actionItems.filter(item => !item.hidden || !item.hidden(row.original));
                    if(ignoreHidden.length === 0) return null;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {ignoreHidden.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <DropdownMenuItem onClick={() => item.onClick(row.original)}>
                                            {item.label}
                                        </DropdownMenuItem>
                                        {item.separator && <DropdownMenuSeparator />}
                                    </React.Fragment>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                }
            };
            finalColumns.push(actionColumn);
        }

        return finalColumns;
    }, [columns, actionItems]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiUrl, {
                params: {
                    page: pagination.current_page,
                    search,
                    per_page: pagination.page_size
                }
            });

            const responseData = response.data;
            responseData.pagination.page_size_options = pagination.page_size_options;

            setData(responseData.data || []);
            setPagination(responseData.pagination);
        } catch (err) {
            toast.error('Failed to fetch data:' + err);
        } finally {
            setLoading(false);
        }
    };

    const debounceSearch = useCallback(debounce((value) => {
        setSearch(value);
    }, 500), []);

    useEffect(() => {
        fetchData();
    }, [search, pagination.page_size, pagination.current_page]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        pageCount: pagination.last_page,
        state: {
            pagination: {
                pageIndex: pagination.current_page - 1,
                pageSize: pagination.page_size,
            },
            columnFilters,
            rowSelection: selectedRows
        },
        manualPagination: true,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        onRowSelectionChange: setSelectedRows
    });

    useEffect(() => {
        if (onSelectedRowsChange) {
            const selectedRows = table
                .getSelectedRowModel()
                .rows.map(row => row.original);
            onSelectedRowsChange(selectedRows);
        }
    }, [selectedRows]);

    const paginationNumbers = generatePaginationNumbers(
        pagination.current_page, 
        pagination.last_page
    );

    const BulkActionBar = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        return (
            <div className="flex items-center gap-2 py-2">
                <div className="flex items-center gap-2">
                    {bulkActions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || "default"}
                            size="sm"
                            onClick={() => action.onClick(selectedRows.map(row => row.original))}
                            disabled={action.isDisabled}
                        >
                            {action.icon && action.icon} {action.label}
                        </Button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex items-start gap-2 flex-col md:items-center md:flex-row md:justify-between py-4">
                <BulkActionBar />
                <Input
                    placeholder={`${t('table.search')}...`}
                    onChange={(event) =>
                        debounceSearch(event.target.value)
                    }
                    className="max-w-sm md:max-w-[250px]"
                />
            </div>
            <div className="rounded-md border relative">
                {loading && <LoadingOverlay />}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
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
                                    colSpan={tableColumns.length}
                                    className="h-24 text-center"
                                >
                                    {!loading && t('table.no_records')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground text-center md:text-start m-0">
                    {t('table.data_showing', {
                        from: pagination.from ? pagination.from.toString() : '0',
                        to: pagination.to ? pagination.to.toString() : '0',
                        total: pagination.total.toString()
                    })}
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-muted-foreground">{t('table.rows_per_page')}</p>
                    <Select
                        value={pagination.page_size.toString()}
                        onValueChange={(value) => {
                            setPagination((prev) => ({
                                ...prev,
                                page_size: parseInt(value),
                            }));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pagination.page_size.toString()} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pagination.page_size_options.map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            current_page: prev.current_page - 1,
                        }));
                    }}
                    disabled={pagination.current_page <= 1}
                >
                    <ChevronLeft />
                </Button>
                {paginationNumbers.map((pageNum, idx) => (
                    pageNum === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2">...</span>
                    ) : (
                        <Button
                            key={`page-${pageNum}`}
                            variant="outline"
                            size="sm"
                            className={cn(
                                "min-w-[32px]",
                                pagination.current_page === pageNum &&
                                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            )}
                            onClick={() => {
                                setPagination((prev) => ({
                                    ...prev,
                                    current_page: parseInt(pageNum.toString()),
                                }));
                            }}
                        >
                            {pageNum}
                        </Button>
                    )
                ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setPagination((prev) => ({
                            ...prev,
                            current_page: prev.current_page + 1,
                        }));
                    }}
                    disabled={pagination.current_page >= pagination.last_page}
                >
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
});
