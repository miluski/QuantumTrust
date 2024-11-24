export class Transaction {
  id!: number;
  date!: string;
  hour!: string;
  title!: string;
  assignedAccountNumber!: string | number;
  type!: 'incoming' | 'outgoing';
  category!: string;
  amount!: number;
  currency!: string;
  accountAmountAfter!: number;
  accountCurrency!: string;
  status!: 'blockade' | 'settled';
}
