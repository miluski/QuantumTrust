export class Transaction {
    id!: number;
    date!: string;
    hour!: string;
    title!: string;
    accountNumber!: string | number;
    type!: 'incoming' | 'outgoing';
    category!: string;
    amount!: number;
    currency!: string;
    accountAmountAfter!: number;
    accountCurrency!: string;
    status!: 'blockade' | 'settled';
}