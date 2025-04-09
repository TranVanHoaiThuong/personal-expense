import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTranslation } from '@/lib/i18n';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface SidebarBlockProps {
    items: NavItem[];
    heading?: string;
}

export function SidebarBlock({ items = [], heading }: SidebarBlockProps) {
    const page = usePage();
    const { t } = useTranslation();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{heading}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
