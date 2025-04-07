import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export const useCan = (permission: string): boolean => {
    const {props} = usePage<SharedData>();
    const userPermissions: string[] = props.auth?.permissions ?? [];
    return userPermissions.includes(permission);
}