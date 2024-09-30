import { limits } from './limits';

export class Card {
  id!: number;
  type!: string;
  description!: string;
  image!: string;
  backImage!: string;
  benefits!: string[];
  limits!: limits[];
  fees!: { release: number; monthly: number };
  assignedAccountId?: string;
  pin?: number;
  expirationDate?: string;
  publisher?: 'Visa' | 'Mastercard';
  cvcCode?: number;
  showingCardSite?: 'front' | 'back';
  status?: 'suspended' | 'unsuspended';
}
