import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavCollapsibleProps {
    parentItem: NavItem;
    childItems: NavItem[];
}

export function NavCollapsible({ parentItem, childItems }: NavCollapsibleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const page = usePage();

    return (
        <SidebarMenuItem>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between">
                        <div className="flex items-center gap-2">
                            {parentItem.icon && <parentItem.icon className="h-4 w-4" />}
                            <span>{parentItem.title}</span>
                        </div>
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {childItems.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={item.href === page.url}
                                >
                                    <Link href={item.href} prefetch className="flex items-center gap-2">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
