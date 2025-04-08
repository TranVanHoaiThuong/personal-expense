import { HTMLAttributes } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useLanguage } from "@/hooks/use-language";

export default function LanguageToggleDropdown({className = '', ...props} : HTMLAttributes<HTMLDivElement>) {
    const {language, updateLanguage} = useLanguage();

    const getCurrentLanguage = () => {
        switch (language) {
            case 'en':
                return 'ENG';
            case 'vi':
                return 'VIE';
            default:
                return 'ENG';
        }
    }
    return (
        <div className={className} {...props}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md bg-gray-50 dark:bg-gray-700">
                        {getCurrentLanguage()}
                        <span className="sr-only">Toggle language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateLanguage('vi')} className={language === 'vi' ? 'bg-gray-200 dark:bg-gray-700' : ''}>
                        <span className="flex items-center gap-2">
                            Việt Nam
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateLanguage('en')} className={language === 'en' ? 'bg-gray-200 dark:bg-gray-700' : ''}>
                        <span className="flex items-center gap-2">
                            English
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
