import { limit } from './limit';

export class Card {
  id!: number;
  type!: string;
  description!: string;
  image!: string;
  backImage!: string;
  benefits!: string[];
  limits!: limit[];
  pin?: number;
  expirationDate?: string;
  publisher?: 'Visa' | 'Mastercard';
  cvcCode?: number;
  showingCardSite?: 'front' | 'back';
}
