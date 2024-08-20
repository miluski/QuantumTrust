import { limit } from "./limit";

export type Card = {
  id: number;
  type: string;
  description: string;
  image: string;
  benefits: string[];
  limits: limit[];
};
