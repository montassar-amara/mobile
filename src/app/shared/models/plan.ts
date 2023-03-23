export interface IPlan {
    _id: string;
    name:string;
    number_companies:number;
    number_day_to_update:number;
    description:string;
    prices:{_id:{$oid:string},name_period:string,price:number}[];
    number_companies_trade:number;
    is_master:boolean;
}
