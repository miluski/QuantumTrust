import { Card } from '../types/card';

export const mastercardCardsObjectsArray: Card[] = [
  {
    id: 1,
    type: 'STANDARD',
    description:
      'Karta Mastercard z podstawowymi funkcjami płatniczymi i bezpieczeństwem.',
    image: 'mastercard-standard.png',
    benefits: [
      'Globalne wsparcie w przypadku awarii',
      'Unikalny program priceless cities dający dostęp do wyjątkowych wydarzeń i ofert na całym świecie',
      'Wygodne płatności zbliżeniowej dzięki technologii Tap & Go™',
      'Bezpieczeństwo transakcji online zapewnione za pomocą technologii Mastercard secure code',
    ],
    limits: [{ internetTransactions: [10000, 5], cashTransactions: [5000, 3] }],
  },
  {
    id: 2,
    type: 'STUDENT',
    description:
      'Łatwy dostęp do środków i unikalne promocje dla aktywnych studentów.',
    image: 'mastercard-student.png',
    benefits: [
      'Dostęp do specjalnych ofert edukacyjnych',
      'Zniżki na bilety do kina i teatru',
      'Możliwość uczestnictwa w programach lojalnościowych',
      'Bezpłatne wypłaty z bankomatów na terenie kraju',
    ],
    limits: [{ internetTransactions: [15000, 10], cashTransactions: [7000, 5] }],
  },
  {
    id: 3,
    type: 'PODRÓŻNIK',
    description:
      'Bezproblemowe płatności wielowalutowe i wyjątkowe oferty podróży do 20 krajów.',
    image: 'mastercard-travel.png',
    benefits: [
      'Bezpłatne ubezpieczenie bagażu',
      'Dostęp do ekskluzywnych ofert podróżniczych',
      'Zniżki na wynajem samochodów',
      'Całodobowa pomoc w nagłych wypadkach za granicą',
    ],
    limits: [{ internetTransactions: [20000, 15], cashTransactions: [10000, 8] }],
  },
  {
    id: 4,
    type: 'BIZNES',
    description:
      'Karta Mastercard dla przedsiębiorców z dodatkowymi korzyściami biznesowymi.',
    image: 'mastercard-business.png',
    benefits: [
      'Dostęp do narzędzi analitycznych dla biznesu',
      'Zniżki na usługi księgowe i prawne',
      'Programy lojalnościowe dla firm',
      'Wsparcie dedykowanego opiekuna klienta',
    ],
    limits: [{ internetTransactions: [100000, 5], cashTransactions: [50000, 3] }],
  },
];
