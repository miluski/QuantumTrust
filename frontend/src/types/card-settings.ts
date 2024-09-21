import { Card } from './card';
import { Currency } from './currency';
import { Limit } from './limit';

export class CardSettings {
  limitType: 'min' | 'max' = 'min';
  limits: Limit = {
    internetTransactionsLimit: 500,
    cashTransactionsLimit: 500,
  };
  transactionType!: 'cash' | 'internet';
  currency!: Currency;
  card!: Card;
}
