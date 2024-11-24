import { Transaction } from '../types/transaction';

export const mockTransactions: Transaction[] = [
  {
    id: 0,
    date: '2024-01-01',
    hour: '12:34',
    title: 'Mega długi tytuł przelewu, który przekracza 50 znaków',
    assignedAccountNumber: 'PL 49 1020 2892 2276 3005 0000 0001',
    type: 'incoming',
    amount: 15000000,
    currency: 'USD',
    accountAmountAfter: 11000,
    category: 'Artykuły spożywcze',
    accountCurrency: 'PLN',
    status: 'blockade',
  },
  {
    id: 1,
    date: '2024-01-01',
    hour: '12:34',
    title: 'Mega długi tytuł przelewu, który przekracza 50 znaków',
    assignedAccountNumber: 'PL 49 1020 2892 2276 3005 0000 0002',
    type: 'incoming',
    amount: 15000000,
    currency: 'USD',
    accountAmountAfter: 11000,
    category: 'Artykuły spożywcze',
    accountCurrency: 'PLN',
    status: 'blockade',
  },
];
