import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export function useTranslation() {
    const { translations } = usePage<SharedData>().props;

    const t = (key: string, replacements: Record<string, string> = {}) => {
        let translation = key.split('.').reduce((obj, key) => obj?.[key], translations as any);
        if (typeof translation !== 'string') {
            console.warn(`Translation key "${key}" not found`);
            return key;
        }

        Object.entries(replacements).forEach(([key, value]) => {
            translation = translation.replace(`:${key}`, value);
        });

        return translation;
    }
    return { t };
}