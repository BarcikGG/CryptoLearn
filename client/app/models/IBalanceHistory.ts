export default interface IBalanceHistory {
    id: number;
    user_id: number;
    amount: number;
    description?: string;
    operation_type: 'credit' | 'debit';
    transaction_date: string;
}