export interface INotification {
    _id: string;
    created_at:Date;
    is_show:boolean;
    subject_from:string;
    subject_send:string;
    type:string;
    from:string;
}
