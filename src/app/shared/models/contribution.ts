import { IComment } from "./comment";

export interface IContribution {
    _id:string;
    subject:string;
    message:string;
    // user:Partial<IUser>;
    user_id: string;
    is_edit:boolean;
    created_at:Date;
    modified_at:Date;
    comments:IComment[];
    pinnedComment:string;
    files:string[];
    likes:{user_id:string}[];
    user_email:string;
    user_name:string;
    user_avatar: string;
}
export interface ICycle{
    _id:string;
    start_date:Date;
    end_date:Date;
    is_enclosed:boolean;
}