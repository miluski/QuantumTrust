import { Card } from '../types/card';

export const visaCardsObjectsArray: Card[] = [
  {
    id: 1,
    type: 'STANDARD',
    description:
      'Idealna karta do zakupów z programem lojalnościowym i ubezpieczeniami.',
    image: 'visa-standard.png',
  },
  {
    id: 2,
    type: 'STUDENT',
    description:
      'Bezpieczne i wygodne płatności dla studentów z ofertami specjalnymi i zniżkami.',
    image: 'visa-student.png',
  },
  {
    id: 3,
    type: 'PODRÓŻNIK',
    description:
      'Wygodne płatności bez prowizji wraz z korzystną ofertą ubezpieczeń na całym świecie.',
    image: 'visa-travel.png',
  },
  {
    id: 4,
    type: 'BIZNES',
    description:
      'Karta biznesowa Visa oferująca korzyści i nagrody dostosowane do wydatków firmowych.',
    image: 'visa-business.png',
  },
];
