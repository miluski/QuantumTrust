import { Card } from '../types/card';

export const visaCardsObjectsArray: Card[] = [
  {
    id: 1,
    type: 'STANDARD',
    description: 'Idealna karta do zakupów z programem lojalnościowym i ubezpieczeniami.',
    image: 'visa-standard.png',
    publisher: 'Visa',
    benefits: [
      'Możliwość wygodnych płatności w ponad 200 krajach',
      'Wygodne płatności zbliżeniowe',
      'Dodatkowy poziom zabezpieczeń przy płatnościach online za pomocą technologii Verified by VISA',
      'Możliwość szybkiej wymiany i zastrzeżenia starej karty w przypadku jej zgubienia',
    ],
    limits: [{ internetTransactions: [10000, 5], cashTransactions: [5000, 3] }],
    backImage: 'visa-back.png',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 10
    }
  },
  {
    id: 2,
    type: 'STUDENT',
    description: 'Bezpieczne i wygodne płatności dla studentów z ofertami specjalnymi i zniżkami.',
    image: 'visa-student.png',
    publisher: 'Visa',
    benefits: [
      'Zniżki na zakupy w wybranych sklepach',
      'Dostęp do specjalnych ofert dla studentów',
      'Możliwość płatności zbliżeniowych',
      'Dodatkowe zabezpieczenia przy płatnościach online',
    ],
    limits: [
      { internetTransactions: [15000, 10], cashTransactions: [7000, 5] },
    ],
    backImage: 'visa-back.png',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 0
    }
  },
  {
    id: 3,
    type: 'PODRÓŻNIK',
    description: 'Wygodne płatności bez prowizji wraz z korzystną ofertą ubezpieczeń na całym świecie.',
    image: 'visa-travel.png',
    publisher: 'Visa',
    benefits: [
      'Brak prowizji za płatności zagraniczne',
      'Ubezpieczenie podróżne w pakiecie',
      'Dostęp do saloników lotniskowych',
      'Całodobowa pomoc w przypadku zgubienia karty',
    ],
    limits: [
      { internetTransactions: [20000, 15], cashTransactions: [10000, 8] },
    ],
    backImage: 'visa-back.png',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 5
    }
  },
  {
    id: 4,
    type: 'BIZNES',
    description: 'Ekskluzywna karta z dodatkowymi korzyściami i usługami premium.',
    image: 'visa-business.png',
    publisher: 'Visa',
    benefits: [
      'Dostęp do ekskluzywnych ofert i zniżek',
      'Ubezpieczenie zakupów i podróży',
      'Całodobowa pomoc concierge',
      'Wyższe limity płatności',
    ],
    limits: [
      { internetTransactions: [100000, 5], cashTransactions: [50000, 3] },
    ],
    backImage: 'visa-back.png',
    showingCardSite: 'front',
    fees: {
      release: 100,
      monthly: 20
    }
  },
];
