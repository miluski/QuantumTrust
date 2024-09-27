import { Deposit } from '../types/deposit';

export const userDeposits: Deposit[] = [
  {
    id: 'PL 49 1020 2892 2276 3005 0000 0005',
    type: 'timely',
    percent: 3,
    image: '',
    description: '',
    shortDescription: '',
    balance: 100000,
    currency: 'PLN',
    endDate: '2024-12-26',
    assignedAccountNumber: 'PL 49 1020 2892 2276 3005 0000 0001',
    duration: 0
  },
  {
    id: 'PL 49 1020 2892 2276 3005 0000 0006',
    type: 'progressive',
    percent: 4,
    image: '',
    description: '',
    shortDescription: '',
    balance: 100000,
    currency: 'PLN',
    endDate: '2025-01-26',
    assignedAccountNumber: 'PL 49 1020 2892 2276 3005 0000 0002',
    duration: 0
  },
  {
    id: 'PL 49 1020 2892 2276 3005 0000 0007',
    type: 'family',
    percent: 3,
    image: '',
    description: '',
    shortDescription: '',
    balance: 100000,
    currency: 'PLN',
    endDate: '2025-09-26',
    assignedAccountNumber: 'PL 49 1020 2892 2276 3005 0000 0003',
    duration: 0
  },
];
