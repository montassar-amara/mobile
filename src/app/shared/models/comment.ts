import { IReply } from "./reply";
import { IUser } from "./user";

export interface IComment {
    _id:string;
    message:string;
    //owner:IUser;
    // user:Partial<IUser>;
    user_id:string;
    isEdited:boolean;
    created_at:any;
    updated_at:any;
    files:string[];
    replies:IReply[];
    type:string;
    pined:boolean;
    user_avatar : string;
    user_name : string;
    user_email : string;
    displayname?:string;
    fullname?:string;
}
