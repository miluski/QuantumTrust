import { Card } from '../types/card';

export const mastercardCardsObjectsArray: Card[] = [
  {
    id: 5,
    type: 'STANDARD',
    description:
      'Karta Mastercard z podstawowymi funkcjami płatniczymi i bezpieczeństwem.',
    image: 'mastercard-standard.webp',
    publisher: 'Mastercard',
    benefits: [
      'Globalne wsparcie w przypadku awarii',
      'Unikalny program priceless cities dający dostęp do wyjątkowych wydarzeń i ofert na całym świecie',
      'Wygodne płatności zbliżeniowej dzięki technologii Tap & Go™',
      'Bezpieczeństwo transakcji online zapewnione za pomocą technologii Mastercard secure code',
    ],
    limits: [{ internetTransactions: [10000, 5], cashTransactions: [5000, 3] }],
    backImage: 'mastercard-standard-back.webp',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 10,
    },
  },
  {
    id: 6,
    type: 'STUDENT',
    description:
      'Łatwy dostęp do środków i unikalne promocje dla aktywnych studentów.',
    image: 'mastercard-student.webp',
    publisher: 'Mastercard',
    benefits: [
      'Dostęp do specjalnych ofert edukacyjnych',
      'Zniżki na bilety do kina i teatru',
      'Możliwość uczestnictwa w programach lojalnościowych',
      'Bezpłatne wypłaty z bankomatów na terenie kraju',
    ],
    limits: [
      { internetTransactions: [15000, 10], cashTransactions: [7000, 5] },
    ],
    backImage: 'mastercard-student-back.webp',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 0,
    },
  },
  {
    id: 7,
    type: 'PODRÓŻNIK',
    description:
      'Bezproblemowe płatności wielowalutowe i wyjątkowe oferty podróży do 20 krajów.',
    image: 'mastercard-travel.webp',
    publisher: 'Mastercard',
    benefits: [
      'Bezpłatne ubezpieczenie bagażu',
      'Dostęp do ekskluzywnych ofert podróżniczych',
      'Zniżki na wynajem samochodów',
      'Całodobowa pomoc w nagłych wypadkach za granicą',
    ],
    limits: [
      { internetTransactions: [20000, 15], cashTransactions: [10000, 8] },
    ],
    backImage: 'mastercard-travel-back.webp',
    showingCardSite: 'front',
    fees: {
      release: 0,
      monthly: 5,
    },
  },
  {
    id: 8,
    type: 'BIZNES',
    description:
      'Karta Mastercard dla przedsiębiorców z dodatkowymi korzyściami biznesowymi.',
    image: 'mastercard-business.webp',
    publisher: 'Mastercard',
    benefits: [
      'Dostęp do narzędzi analitycznych dla biznesu',
      'Zniżki na usługi księgowe i prawne',
      'Programy lojalnościowe dla firm',
      'Wsparcie dedykowanego opiekuna klienta',
    ],
    limits: [
      { internetTransactions: [100000, 5], cashTransactions: [50000, 3] },
    ],
    backImage: 'mastercard-business-back.webp',
    showingCardSite: 'front',
    fees: {
      release: 100,
      monthly: 20,
    },
  },
];

