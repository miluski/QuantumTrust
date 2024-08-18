import { Step } from '../types/step';

export const singleAccountStepsArray: Step[] = [
  {
    id: 1,
    instruction: 'Przejdź do otwierania konta',
    description: 
    'Naciśnij przycisk “Otwórz konto” aby przejść do formularza rejestracji.',
  },
  {
    id: 2,
    instruction: 'Uzupełnij formularz',
    description:
      'Podaj swoje dane żeby system mógł zweryfikować twoją tożsamość.',
  },
  {
    id: 3,
    instruction: 'Sprawdź skrzynkę pocztową',
    description:
      'Zapisz swój identyfikator otrzymany w emailu do przyszłych logowań.',
  },
];
