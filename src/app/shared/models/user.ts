export interface IUser {
    phone: any;
    _id:string;
    name:string;
    auth_provider: string;
    displayname:string;
    phone_code:string;
    phone_number:string;
    email:string;
    avatar:string;
    role:string;
    loginType:'email'|'service';
    deleteOnDate:Date;
    isPrincipal?:string;
    new_transaction_notif:boolean;
    update_notif:boolean;

}
