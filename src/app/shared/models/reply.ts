import { IUser } from "./user";

export interface IReply {
    _id:string;
    message:string;
    //owner:IUser;
    user_id:string;
    // user:Partial<IUser>;
    isEdited:boolean;
    created_at:Date;
    updated_at:Date;
    files:string[];
    type:string;
}

