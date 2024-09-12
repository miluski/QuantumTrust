export type Deposit = {
  id: string;
  type: string;
  percent: number;
  image: string;
  description: string;
  shortDescription: string;
  percentFrom?: number;
  percentTo?: number;
  balance?: number;
  currency?: string;
};
