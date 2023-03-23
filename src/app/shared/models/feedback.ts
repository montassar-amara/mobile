import { IComment } from "./comment";
import { EPostCategory } from "./post-category";
import { EPostStatus } from "./post-status";
import { IUser } from "./user";

export interface IFeedback {
    _id:string;
    subject:string;
    message:string;
    // user:Partial<IUser>;
    user_id: string;
    status: EPostStatus| string;
    category:EPostCategory|string;
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
    displayname?:string;
    fullname?:string;
}
