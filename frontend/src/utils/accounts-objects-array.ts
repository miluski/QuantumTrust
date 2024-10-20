import { Account } from '../types/account';

export const accountsObjectsArray: Account[] = [
  {
    id: '1',
    advertismentText: 'Twoje finanse pod kontrolą',
    advertismentContent:
      'Konto osobiste, które daje Ci pełną kontrolę nad swoimi finansami. Z łatwym dostępem online i zaawansowanymi funkcjami bezpieczeństwa, możesz zarządzać swoimi pieniędzmi szybko i bez problemów, gdziekolwiek jesteś.',
    image: 'first-account.webp',
    type: 'personal',
    benefits: [
      '<b>0 PLN</b> jakichkolwiek opłat',
      '<b>Szybkie</b> i bezpieczne przelewy',
      '<b>Korzystne</b> programy lojalnościowe',
    ],
  },
  {
    id: '2',
    advertismentText: 'Wystartuj z nami',
    advertismentContent:
      'Konto dla młodych zostało stworzone z myślą o młodych ludziach. Z atrakcyjnymi warunkami, dostępem do nowoczesnych technologii i dodatkowymi korzyściami, możesz rozpocząć swoją finansową przygodę z nami.',
    image: 'second-account.webp',
    type: 'young',
    benefits: [
      '<b>Brak opłat</b> za prowadzenie konta',
      '<b>Dostęp</b> do nowoczesnych technologii',
      '<b>Atrakcyjne</b> warunki dla młodych',
    ],
  },
  {
    id: '3',
    advertismentText: 'Jedno konto, wiele walut',
    advertismentContent:
      'Konto wielowalutowe to Idealne rozwiązanie dla osób często podróżujących lub dokonujących transakcji międzynarodowych. Konto umożliwia zarządzanie środkami w różnych walutach bez dodatkowych opłat za przewalutowanie.',
    image: 'third-account.webp',
    type: 'multiCurrency',
    benefits: [
      '<b>Brak opłat</b> za przewalutowanie',
      '<b>Łatwe</b> zarządzanie wieloma walutami',
      '<b>Bezpieczne</b> transakcje międzynarodowe',
    ],
  },
  {
    id: '4',
    advertismentText: 'Rodzinne korzyści',
    advertismentContent:
      'Konto rodzinne posiada atrakcyjne warunki, programy oszczędnościowe i dodatkowe ubezpieczenie dzięki czemu cała rodzina może cieszyć się bezpieczeństwem finansowym.',
    image: 'fourth-account.webp',
    type: 'family',
    benefits: [
      '<b>Atrakcyjne</b> warunki dla rodzin',
      '<b>Programy</b> oszczędnościowe',
      '<b>Dodatkowe</b> ubezpieczenie',
    ],
  },
  {
    id: '5',
    advertismentText: 'Bezpieczna starość',
    advertismentContent:
      'Konto dedykowane seniorom, oferujące preferencyjne warunki, brak opłat za podstawowe operacje i dodatkowe korzyści, takie jak ubezpieczenia zdrowotne. Zapewnia spokojną przyszłość i łatwy dostęp do finansów.',
    image: 'fifth-account.webp',
    type: 'oldPeople',
    benefits: [
      '<b>Preferencyjne</b> warunki dla seniorów',
      '<b>Brak opłat</b> za podstawowe operacje',
      '<b>Dodatkowe</b> ubezpieczenia zdrowotne',
    ],
  },
];
