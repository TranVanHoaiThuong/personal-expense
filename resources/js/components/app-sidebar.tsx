import { SidebarBlock } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileChartColumn, HandCoins, LayoutGrid, ShieldCheck, SquareStack, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { useCan } from '@/hooks/use-can';
import { useTranslation } from '@/lib/i18n';

export function AppSidebar() {
    const { t } = useTranslation();
    const { isadmin } = usePage<SharedData>().props;

    const generalItems: NavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('sidebar.reports'),
            href: '/reports',
            icon: FileChartColumn,
        },
    ];

    const roleItems: NavItem[] = [
        {
            title: t('sidebar.roles'),
            href: '/roles',
            icon: ShieldCheck,
        },
        {
            title: t('sidebar.users'),
            href: '/users',
            icon: Users,
        },
    ];

    const expenseItems: NavItem[] = [
        {
            title: t('sidebar.expenses_categories'),
            href: '/expenses/categories',
            icon: SquareStack,
        },
        {
            title: t('sidebar.income_expense_tracker'),
            href: '/expenses/transactions',
            icon: HandCoins,
        },
    ];

    // Chỉ hiển thị menu Role nếu có quyền manage users
    const hasManageUsersPermission = useCan('manage users');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarBlock items={generalItems} heading={t('title.general')} />
                {hasManageUsersPermission && <SidebarBlock items={roleItems} heading={t('title.roleandpermissions')} />}
                {!isadmin && <SidebarBlock items={expenseItems} heading={t('title.expenses')} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
