import { Card } from '../types/card';

export const mockCards: Card[] = [
  {
    id: 1234567890123456,
    assignedAccountId: 'PL 49 1020 2892 2276 3005 0000 0001',
    type: 'STANDARD',
    publisher: 'Visa',
    description: '',
    image: 'visa-standard.png',
    benefits: [],
    limits: [{ internetTransactions: [10000, 5], cashTransactions: [5000, 3] }],
    pin: 7890,
    cvcCode: 123,
    expirationDate: '12/25',
    showingCardSite: 'front',
    backImage: 'visa-back.png',
    fees: {
      release: 0,
      monthly: 0,
    },
    status: 'suspended',
  },
];
