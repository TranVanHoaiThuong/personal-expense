import { SidebarBlock } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileChartColumn, LayoutGrid, ShieldCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { useCan } from '@/hooks/use-can';
import { useTranslation } from '@/lib/i18n';

export function AppSidebar() {
    const { t } = useTranslation();

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
    ]

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
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
