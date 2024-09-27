export class Deposit {
  id!: string;
  assignedAccountNumber?: string;
  type!: string;
  percent!: number;
  image!: string;
  description!: string;
  shortDescription!: string;
  endDate?: string;
  benefits?: string[];
  percentFrom?: number;
  percentTo?: number;
  balance?: number;
  currency?: string;
  duration?: number = 1;
}
