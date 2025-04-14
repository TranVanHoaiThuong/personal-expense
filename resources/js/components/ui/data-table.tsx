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

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "@/lib/axios";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LoaderCircle, MoreHorizontal } from "lucide-react";
import { DataTableProps } from "@/types/table";
import { useTranslation } from "@/lib/i18n";

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

export function DataTable<T extends object>({ 
    columns, 
    apiUrl,
    defaultPageSize = 10,
    defaultPageSizeOptions = [10, 20, 30, 40, 50],
    actionItems = [],
    indexColumn = false,
}: DataTableProps<T>) {
    const { t } = useTranslation();
    const [data, setData] = useState<T[]>([]);
    const { pagination, setPagination } = usePagination({
        page_size: defaultPageSize,
        page_size_options: defaultPageSizeOptions
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const tableColumns = useMemo(() => {
        const finalColumns = [...columns];

        if (indexColumn) {
            const indexCol: ColumnDef<T> = {
                id: "index",
                header: t('title.index'),
                cell: ({ row }) => row.index + 1
            };

            finalColumns.unshift(indexCol);
        }
        if (actionItems?.length) {

            const actionColumn: ColumnDef<T> = {
                id: "actions",
                header: t('title.action'),
                cell: ({ row }) => {
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
                                {actionItems.map((item, index) => (
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
            console.error('Failed to fetch data:', err);
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
        },
        manualPagination: true,
    });

    const paginationNumbers = generatePaginationNumbers(
        pagination.current_page, 
        pagination.last_page
    );

    return (
        <div>
            <div className="flex items-center justify-end md:w-[1/4] py-4">
                <Input
                    placeholder="Search..."
                    onChange={(event) =>
                        debounceSearch(event.target.value)
                    }
                    className="max-w-sm"
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
                                    {!loading && t('title.no_results')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground text-center md:text-start m-0">
                    Showing {pagination.from} to {pagination.to} of{" "}
                    {pagination.total} entries
                </div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-muted-foreground">Rows per page</p>
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
}
