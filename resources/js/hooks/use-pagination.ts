import { useState } from 'react';
import PerPage from '@/types/perpage';

const DEFAULT_PAGINATION: PerPage = {
    total: 0,
    page_size: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    page_size_options: [10, 20, 30, 40, 50]
};

export function usePagination(initialState?: Partial<PerPage>) {
    const [pagination, setPagination] = useState<PerPage>({
        ...DEFAULT_PAGINATION,
        ...initialState
    });

    return {
        pagination,
        setPagination
    };
}