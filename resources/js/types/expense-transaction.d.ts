type Transaction = {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    type: string;
    note?: string;
    transaction_date: string;
    created_at?: string;
    updated_at?: string;
}

export default Transaction;