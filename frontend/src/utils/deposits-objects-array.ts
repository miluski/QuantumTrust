import { Deposit } from "../types/deposit";

export const depositsObjectArray: Deposit[] = [
  {
    id: "1",
    type: 'timely',
    percent: 3,
    image: 'timely-deposit.png',
    description:
      'Ciesz się gwarantowanym zyskiem na określony czas. Nasza oferta zapewnia pewność i bezpieczeństwo Twoich oszczędności, bez niespodzianek.',
    shortDescription: 'Oszczędzaj i żyj lepiej!'
  },
  {
    id: "2",
    type: 'mobile',
    percent: 5,
    image: 'mobile-deposit.png',
    description:
      'Zakładaj i zarządzaj lokatą mobilną bez wychodzenia z domu. Korzystaj z wyższego oprocentowania i pełnej wygody, którą oferuje nasza nowoczesna bankowość mobilna.',
    shortDescription: 'Zyskaj więcej z lokatą mobilną!'
  },
  {
    id: "3",
    type: 'family',
    percent: 2.5,
    image: 'family-deposit.png',
    description:
      'Zadbaj o finansową przyszłość całej rodziny dzięki lokacie rodzinnej. Oferujemy atrakcyjne warunki i dodatkowe korzyści, które pozwolą Wam wspólnie oszczędzać i realizować marzenia.',
    shortDescription: 'Oszczędzaj dla całej rodziny!'
  },
  {
    id: "4",
    type: 'progressive',
    percent: 4,
    image: 'progressive-deposit.png',
    description:
      'Skorzystaj z lokaty progresywnej, która oferuje rosnące oprocentowanie w miarę upływu czasu. Im dłużej oszczędzasz, tym więcej zyskujesz. Idealne rozwiązanie dla tych, którzy planują długoterminowe oszczędzanie.',
    shortDescription: 'Więcej czasu, większy zysk!'
  }
];
