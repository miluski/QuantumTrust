import { NumberLiteralType } from "typescript";

export type Deposit = {
  id: number;
  type: string;
  percent: number;
  image: string;
  description: string;
  shortDescription: string;
  percentFrom?: number;
  percentTo?: number;
};
