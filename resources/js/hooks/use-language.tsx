import { useCallback, useEffect, useState } from "react";

export type Language = 'en' | 'vi';

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
}

export const initializeLanguage = () => {
    const savedLanguage = (localStorage.getItem('language') as Language) || 'en';
    document.documentElement.lang = savedLanguage;
}

export const useLanguage = () => {
    const [language, setLanguage] = useState<Language>('en');

    const updateLanguage = useCallback((lang: Language) => {
        setLanguage(lang);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('language', lang);

        // Store in cookie for SSR...
        setCookie('language', lang);

        document.documentElement.lang = lang;

        window.location.reload();
    }, []);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language | 'en';
        if(savedLanguage) {
            setLanguage(savedLanguage);
            document.documentElement.lang = savedLanguage;
        }
    }, []);

    return { language, updateLanguage } as const;
}