import { SharedData, Wallet } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { router, usePage } from '@inertiajs/react';
import { Wallet as WalletIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BalanceHeading() {
    const { wallet, auth, isadmin } = usePage<SharedData>().props;
    const [balance, setBalance] = useState<number>(0);
    const [showSetupWallet, setShowSetupWallet] = useState<boolean>(false);
    const [showBalance, setShowBalance] = useState<boolean>(false);

    useEffect(() => {
        if(wallet === null) {
            setShowSetupWallet(true);
        } else {
            setBalance(wallet.amount);
            setShowBalance(true);
        }
    }, [wallet]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: auth.user.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleSaveBalance = () => {
        if(!balance) {
            toast.error('Please enter a balance');
            return;
        }
        router.post(route('wallet.store'), {
            amount: balance
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const wallet = page.props.wallet as Wallet;
                toast.success('Setup wallet successfully');
                setShowSetupWallet(false);
                setShowBalance(true);
                if (wallet) {
                    setBalance(wallet?.amount);
                }
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => {
                    toast.error(error);
                });
            }
        });
    }
    return (
        <div className='px-4 w-full'>
            <div className='flex flex-col w-full'>
                {(!isadmin && showSetupWallet) && (
                    <div className="w-full flex justify-center mt-4 md:justify-end">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2 w-full md:w-auto gradient-button">
                                    <WalletIcon className="w-4 h-4" />
                                    Enter balance
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[280px] p-4"
                                align="end"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <WalletIcon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Enter initial balance
                                        </span>
                                    </div>
                                    <input 
                                        type="number" 
                                        step="any"
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Amount"
                                        onChange={(e) => setBalance(Number(e.target.value))}
                                    />
                                    <Button 
                                        variant="default" 
                                        className="w-full" 
                                        onClick={handleSaveBalance}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                {showBalance && (
                    <div className="w-full mt-4">
                        <div className="bg-secondary/50 dark:bg-secondary/20 border border-border rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3">
                                <div className="hidden md:block" />
                                
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20">
                                        <WalletIcon className="w-5 h-5 text-primary dark:text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">
                                            Current Balance
                                        </span>
                                        <span className="text-xl font-semibold text-primary dark:text-primary">
                                            {formatCurrency(balance)}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden md:block" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}