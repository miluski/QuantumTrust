import { Account } from '../../types/account';

export const accountsObjectsArray: Account[] = [
  {
    id: 1,
    advertismentText: 'Twoje finanse pod kontrolą',
    advertismentContent:
      'Konto osobiste, które daje Ci pełną kontrolę nad swoimi finansami. Z łatwym dostępem online i zaawansowanymi funkcjami bezpieczeństwa, możesz zarządzać swoimi pieniędzmi szybko i bez problemów, gdziekolwiek jesteś.',
    image: 'first-account.png',
    type: 'personal',
  },
  {
    id: 2,
    advertismentText: 'Wystartuj z nami',
    advertismentContent:
      'Konto dla młodych zostało stworzone z myślą o młodych ludziach. Z atrakcyjnymi warunkami, dostępem do nowoczesnych technologii i dodatkowymi korzyściami, możesz rozpocząć swoją finansową przygodę z nami.',
    image: 'second-account.png',
    type: 'young',
  },
  {
    id: 3,
    advertismentText: 'Jedno konto, wiele walut',
    advertismentContent:
      'Konto wielowalutowe to Idealne rozwiązanie dla osób często podróżujących lub dokonujących transakcji międzynarodowych. Konto umożliwia zarządzanie środkami w różnych walutach bez dodatkowych opłat za przewalutowanie.',
    image: 'third-account.png',
    type: 'multiCurrency',
  },
  {
    id: 4,
    advertismentText: 'Rodzinne korzyści',
    advertismentContent:
      'Konto rodzinne posiada atrakcyjne warunki, programy oszczędnościowe i dodatkowe ubezpieczenie dzięki czemu cała rodzina może cieszyć się bezpieczeństwem finansowym.',
    image: 'fourth-account.png',
    type: 'family',
  },
  {
    id: 5,
    advertismentText: 'Bezpieczna starość',
    advertismentContent:
      'Konto dedykowane seniorom, oferujące preferencyjne warunki, brak opłat za podstawowe operacje i dodatkowe korzyści, takie jak ubezpieczenia zdrowotne. Zapewnia spokojną przyszłość i łatwy dostęp do finansów.',
    image: 'fifth-account.png',
    type: 'oldPeople',
  },
];
