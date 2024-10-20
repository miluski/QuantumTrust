import { Deposit } from '../types/deposit';

export const depositsObjectArray: Deposit[] = [
  {
    id: '1',
    type: 'timely',
    percent: 3,
    image: 'timely-deposit.webp',
    description:
      'Ciesz się gwarantowanym zyskiem na określony czas. Nasza oferta zapewnia pewność i bezpieczeństwo Twoich oszczędności, bez niespodzianek.',
    benefits: ['Stałe oprocentowanie', 'Gwarancja bezpieczeństwa'],
    shortDescription: 'Oszczędzaj i żyj lepiej!',
  },
  {
    id: '2',
    type: 'mobile',
    percent: 5,
    image: 'mobile-deposit.webp',
    description:
      'Zakładaj i zarządzaj lokatą mobilną bez wychodzenia z domu. Korzystaj z wyższego oprocentowania i pełnej wygody, którą oferuje nasza nowoczesna bankowość mobilna.',
    benefits: [
      'Idealne rozwiązanie dla osób w ruchu',
      'Wysokie oprocentowanie',
    ],
    shortDescription: 'Zyskaj więcej z lokatą mobilną!',
  },
  {
    id: '3',
    type: 'family',
    percent: 2.5,
    image: 'family-deposit.webp',
    description:
      'Zadbaj o finansową przyszłość całej rodziny dzięki lokacie rodzinnej. Oferujemy atrakcyjne warunki i dodatkowe korzyści, które pozwolą Wam wspólnie oszczędzać i realizować marzenia.',
    benefits: ['Elastyczne warunki', 'Dodatkowe bonusy za regularne wpłaty'],
    shortDescription: 'Oszczędzaj dla całej rodziny!',
  },
  {
    id: '4',
    type: 'progressive',
    percent: 4,
    image: 'progressive-deposit.webp',
    description:
      'Skorzystaj z lokaty progresywnej, która oferuje rosnące oprocentowanie w miarę upływu czasu. Im dłużej oszczędzasz, tym więcej zyskujesz. Idealne rozwiązanie dla tych, którzy planują długoterminowe oszczędzanie.',
    benefits: ['Zmienne oprocentowanie', 'Efektywny obrót kapitałem'],
    shortDescription: 'Więcej czasu, większy zysk!',
  },
];
