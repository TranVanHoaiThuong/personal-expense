import { NavCollapsible } from '@/components/nav-collapsible';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileChartColumn, LayoutGrid, ShieldCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { useCan } from '@/hooks/use-can';

export function AppSidebar() {

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileChartColumn,
        },
    ];

    // Item cha Role
    const roleParentItem: NavItem = {
        title: 'Role',
        href: '#',
        icon: ShieldCheck,
    };

    // Các item con cho menu Role
    const roleChildItems: NavItem[] = [
        {
            title: 'Roles',
            href: '/roles',
            icon: ShieldCheck,
        },
        {
            title: 'Users',
            href: '/users',
            icon: Users,
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
                <NavMain items={mainNavItems} />
                {hasManageUsersPermission && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel>Management</SidebarGroupLabel>
                        <SidebarMenu>
                            <NavCollapsible parentItem={roleParentItem} childItems={roleChildItems} />
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
