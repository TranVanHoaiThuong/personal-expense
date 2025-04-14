export interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    apiUrl: string;
    defaultPageSize?: number;
    defaultPageSizeOptions?: number[];
    actionItems?: TableActionItem[];
    indexColumn?: boolean;
    loading?: boolean;
}

export interface TableActionItem {
    label: string;
    onClick: (row: any) => void;
    separator?: boolean;
}