import { BalanceHeading } from '@/components/balance-heading';
import { DataTable, DataTableRef } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from "@/lib/i18n";
import { BreadcrumbItem } from "@/types";
import Transaction from '@/types/expense-transaction';
import { BulkAction } from '@/types/table';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useRef } from 'react';

export default function Index() {
    const { t } = useTranslation();
    const tableRef = useRef<DataTableRef>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('title.expenses'),
            href: '#',
        },
        {
            title: t('sidebar.income_expense_tracker'),
            href: '/expenses/transactions',
        },
    ];

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "type",
            header: t('expenses.expense_type'),
        },
        {
            accessorKey: "amount",
            header: t('expenses.expense_amount'),
        },
        {
            accessorKey: "category_name",
            header: t('expenses.expense_category'),
        },
        {
            accessorKey: "transaction_date",
            header: t('expenses.expense_transaction_date'),
        },
        {
            accessorKey: "note",
            header: t('expenses.expense_note'),
        },
    ];

    const bulkActions: BulkAction[] = [
        {
            label: t('button.create'),
            onClick: () => {
                console.log('create');
            },
            variant: "info",
            icon: <Plus />
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sidebar.income_expense_tracker')} />
            <BalanceHeading />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-2">
                <DataTable
                    apiUrl='/expenses/transactions/tabledata'
                    columns={columns}
                    indexColumn
                    ref={tableRef}
                    bulkActions={bulkActions}
                />
            </div>
        </AppLayout>
    )
}