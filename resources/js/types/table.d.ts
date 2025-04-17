export interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    apiUrl: string;
    defaultPageSize?: number;
    defaultPageSizeOptions?: number[];
    actionItems?: TableActionItem[];
    indexColumn?: boolean;
    bulkActions?: BulkAction[];
    enableRowSelection?: boolean;
    onSelectedRowsChange?: (rows: T[]) => void;
}

export interface TableActionItem {
    label: string;
    onClick: (row: any) => void;
    separator?: boolean;
    hidden?: (row: any) => boolean;
}

export interface BulkAction {
    label: string;
    onClick: (rows: any[]) => void;
    variant?: 'default' | 
              'destructive' | 
              'outline' | 
              'secondary' | 
              'ghost' | 
              'link' | 
              'success' | 
              'warning' | 
              'info' | 
              'subtle' | 
              'soft' | 
              'outline_destructive' | 
              'outline_success' | 
              'glass' | 
              'premium' | 
              'muted';
    icon?: React.ReactNode;
    isDisabled?: boolean;
}