import { useTranslation } from "@/lib/i18n";
import { BreadcrumbItem } from "@/types";
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from "@inertiajs/react";
import ExpenseCategory from "@/types/expense-category";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableRef } from "@/components/ui/data-table";
import { BulkAction, TableActionItem } from "@/types/table";
import { Plus } from "lucide-react";
import { FormEventHandler, useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Textarea } from "@/components/ui/textarea";
import axios from '@/lib/axios';
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

type CategoryForm = {
    id?: number;
    name: string;
    description: string;
    file?: File | null;
    iconUrl?: string;
}

export default function Index() {
    const { t } = useTranslation();
    const tableRef = useRef<DataTableRef>(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState<({ [key: string]: string[] })>({
        name: [],
        file: []
    });
    const { data, setData, reset } = useForm<Required<CategoryForm>>({
        id: 0,
        name: '',
        description: '',
        file: null,
        iconUrl: ''
    });
    const [deleteId, setDeleteId] = useState<number>(0);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('title.expenses'),
            href: '#',
        },
        {
            title: t('sidebar.expenses_categories'),
            href: '/expenses/categories',
        },
    ];

    const columns: ColumnDef<ExpenseCategory>[] = [
        {
            accessorKey: "name",
            header: t('expenses.expenses_categoryname'),
        },
        {
            accessorKey: "description",
            header: t('expenses.expenses_description'),
        },
        {
            accessorKey: "icon",
            header: t('expenses.expenses_icon'),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <img src={row.original.icon} alt={row.original.name} className="h-8 w-8" />
                </div>
            )
        }
    ];

    const actionItems: TableActionItem[] = [
        {
            label: t('button.edit'),
            onClick: (row) => {
                setData({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    file: null,
                    iconUrl: row.icon
                });
                setOpenDrawer(true);
                setIsEdit(true);
            },
            hidden: (row) => {
                return row.user_id == 0;
            }
        },
        {
            label: t('button.delete'),
            onClick: (row) => {
                const id = row.id;
                setDeleteId(id);
            },
            hidden: (row) => {
                return row.user_id == 0;
            }
        }
    ];

    const bulkActions: BulkAction[] = [
        {
            label: t('button.create'),
            onClick: () => {
                reset();
                setOpenDrawer(true);
                setErrors({
                    name: [],
                    file: []
                });
            },
            variant: "info",
            icon: <Plus />
        }
    ];

    const handleSubmitForm: FormEventHandler = async (e) => {
        e.preventDefault();
        if(!data.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: [t('expenses.require_category_name_error')] }));
            return;
        }
        const formData = new FormData();
        if(isEdit) {
            formData.append('id', data.id.toString());
        }
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.file) {
            formData.append('file', data.file);
        }

        try {
            setIsSaving(true);
            const response = await axios.post('/expenses/categories/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if(!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            tableRef?.current?.refreshData();
            reset();
            setOpenDrawer(false);
            toast.success(response.data.message);
        } catch (error: any) {
            console.log(error);
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
            } else {
                toast.error(t('expenses.category_create_failed', { message: error.message }));
            }
        } finally {
            setIsSaving(false);
        }
    }

    const onDrawerClose = () => {
        reset();
        setIsEdit(false);
        setOpenDrawer(false);
    }

    const onConfirmDelete = async () => {
        const response = await axios.delete(`/expenses/categories/delete/${deleteId}`);
        setDeleteId(0);
        if(!response.data.success) {
            toast.error(response.data.message);
            return;
        }
        tableRef?.current?.refreshData();
        toast.success(response.data.message);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sidebar.expenses_categories')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-4 py-2">
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    apiUrl="/expenses/categories/tabledata"
                    actionItems={actionItems}
                    indexColumn
                    bulkActions={bulkActions}
                />
            </div>
            <Drawer open={openDrawer} direction="right" onClose={onDrawerClose}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{isEdit ? t('expenses.edit_expense_category') : t('expenses.add_expense_category')}</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 py-4">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmitForm}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('expenses.expense_category_name')}</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoFocus
                                        tabIndex={1}
                                        value={data.name}
                                        autoComplete="off"
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('expenses.expense_category_name')}
                                    />
                                    <InputError message={errors.name?.join("\n")} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('expenses.description')}</Label>
                                    <Textarea
                                        id="name"
                                        tabIndex={1}
                                        value={data.description}
                                        autoComplete="off"
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('expenses.description')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="file">{t('expenses.icon')}</Label>
                                    {isEdit && data.iconUrl && <img src={data.iconUrl} alt={data.name} className="h-10 w-10" />}
                                    <Input
                                        id="file"
                                        type="file"
                                        tabIndex={1}
                                        accept="image/png, image/jpeg, image/jpg, image/gif"
                                        multiple={false}
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <InputError message={errors.file?.join("\n")} />
                                </div>
                            </div>
                            <div className="relative md:fixed md:bottom-0 md:right-0 flex justify-end gap-2 p-4">
                                <Button type="submit" disabled={isSaving}>{t('button.save')}</Button>
                                <Button type="button" variant="outline" onClick={onDrawerClose} disabled={isSaving}>{t('button.cancel')}</Button>
                            </div>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
            <ConfirmDialog open={deleteId != 0} title={t('expenses.category_delete_title')} message={t('expenses.category_delete_message')} onConfirm={onConfirmDelete} onCancel={() => setDeleteId(0)}/>
        </AppLayout>
    );
}
