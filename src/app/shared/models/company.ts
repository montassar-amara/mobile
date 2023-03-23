import { ISector } from './sectors';

export interface ICompany {
  _id: string;
  analyst_id: string;
  name: string;
  logo: string;
  prices: {
    _id: { $oid: string };
    name_period: string;
    price: number;
  }[];
  capital: number;
  created_at: Date;
  updated_at: Date;
  sector: ISector;
  ratings: any[];
  equity: number;
  overalRating: number;
  color: string;
  is_free: boolean;
  meta_description:string;
  tag_name:string;
  tag_link:string;
  listed:boolean;
  is_new:boolean;
  process:boolean;
}

export interface IPrice {
  name_period: NamePeriod;
  price: number;
  _id: string;
}
export enum NamePeriod {
  YEARLY = 'Yearly',
  QUARTERLY = 'Quarterly',
}
