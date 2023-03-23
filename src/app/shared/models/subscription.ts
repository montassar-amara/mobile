import { ICompany } from "./company";
import { IPlan } from "./plan";

export interface ISubscription {
    _id:string;
    is_active:boolean;
    plan:IPlan;
    subscriptionIn:Partial<ICompany>[];
    subscriptionOut:{
        subscriptions_period:string;
        next_payment:Date;
        name:string;
        is_active:boolean;
        auto_payment:boolean;
        amount:number;
        company_id:string;
    }[];
    trade_in:number;
    plan_next_payment:string;
    auto_payment:boolean;
    last_Date_trade_in:Date;
    plan_period_selected:string;
    plan_id:string;
    type:string;
}
