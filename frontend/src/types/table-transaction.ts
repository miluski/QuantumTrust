export class TableTransaction {
  title!: string;
  dateAndHour!: { date: string; hour: string };
  accountNumber!: string;
  amountWithCurrency!: string;
  type!: 'incoming' | 'outgoing';
  status!: 'blockade' | 'settled';
}
