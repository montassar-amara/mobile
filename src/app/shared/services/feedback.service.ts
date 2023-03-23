import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IComment } from '../models/comment';
import { IFeedback } from '../models/feedback';
import { IReply } from '../models/reply';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    // private fake:FakerService
    ) { }

  getFeedbacks(){
    return this.http.get<{feedBack:IFeedback[]}>(environment.api+'feedbacks',{});
  }

  addFeedback(post:Partial<IFeedback>,files: File[]): Observable<IFeedback> {
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json; *');
    const form = new FormData()
    form.append('subject',post.subject)
    form.append('message',post.message)
    form.append('status',post.status)
    form.append('category',post.category)
    files.map(file=>form.append('images[]',file))
    return this.http.post<IFeedback>(environment.api+'feedbacks/store', form, {});
  }

  deleteFeedback(id:string){
    //this.fake.deleteFeedback(id)
    return this.http.delete<IFeedback>(environment.api+'feedbacks/delete/'+id,{});
  }

  partialUpdateFeedback(feedback:Partial<IFeedback>,files:File[],feedbackId:string){
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    if(feedback.message){
      form.append('message',feedback.message)
    }
    if(feedback.subject){
      form.append('subject',feedback.subject)
    }
    if(files && files.length>0){
      files.map(file=>form.append('images[]',file))
    }
    return this.http.post<IFeedback>(environment.api+'feedbacks/update/'+feedbackId, form,{});
    //this.fake.partialUpdateFeedback(feedback,feedbackId)
  }

  deleteComment(commentId:string, feedbackId:string){
    //this.fake.deleteComment(commentId,feedbackId)
    return this.http.delete<IFeedback>(environment.api+'comments/delete/'+commentId+'/'+feedbackId,{});
  }
  deleteReply(commentId: string, replyId:string,feedbackId:string){
    //this.fake.deleteReply(replyId,commentId,feedbackId)
    return this.http.delete<IFeedback>(environment.api+'comments/deletereply/'+commentId+'/'+replyId+'/'+feedbackId,{});
  }
  publishComment(comment:Partial<IComment>,files:File[],feedbackId:string):Observable<Comment>{
    //return this.http.post<Comment>(environment.api+'comments/store/'+feedbackId, comment)
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    form.append('message',comment.message)
    form.append('type', 'comment');
    files.map(file=>form.append('images[]',file))
    return this.http.post<Comment>(environment.api+'comments/store/'+feedbackId, form, {});
  }
  publishReply(reply:Partial<IReply>,files:File[],feedbackId:string,selectedCommentId:string):Observable<IReply>{
    //reply.owner = this.fake.getPrincipal()
    //this.fake.publishReply(reply,uploadedFiles,feedbackId,selectedCommentId)
    //this.http.post<IReply>(environment.api+'comments/store/'+feedbackId, {...reply,image:files, replie_id_comment: selectedCommentId});
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    form.append('message',reply.message)
    form.append('type', 'reply');
    form.append('replie_id_comment', selectedCommentId);
    files.map(file=>form.append('images[]',file))
    return this.http.post<IReply>(environment.api+'comments/store/'+feedbackId, form, {});
  }
  partialUpdateComment(comment:Partial<IComment>,uploadedFiles:File[],feedbackId:string){

    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');

    const form = new FormData()
    form.append("message",comment.message)
    uploadedFiles.forEach(file=>form.append("images[]",file))

    return this.http.post<Comment>(environment.api+'comments/update/'+comment._id+'/'+feedbackId, form, {})
  }
  partialUpdateReply(reply:Partial<IReply>,uploadedFiles:File[],feedbackId:string,commentId:string){
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');

    const form = new FormData()
    form.append("message",reply.message)
    uploadedFiles.forEach(file=>form.append("images[]",file))
    return this.http.post<Comment>(environment.api+'comments/update/'+reply._id+'/'+commentId+'/'+feedbackId, form, {})
  }
  likePost(id:string){
    return this.http.post(environment.api+'likeDislikes/'+id+'/store', {}, {})
  }

  changeFeedbackStatus(id: string, status: string):Observable<IFeedback> {
    return this.http.post<IFeedback>(environment.api+'feedbacks/changeFeedbackStatus/'+id, {status: status},{});
  }
  removeFileFromFeedback(file:string,feedbackId:string){
    return this.http.delete<any>(environment.api+'feedbacks/'+feedbackId+'/'+file,{})
  }
  removeFileFromComment(file:string,commentId:string,feedbackId:string){
    return this.http.delete<any>(environment.api+'comments/'+commentId+'/'+feedbackId+'/'+file,{})
  }
  removeFileFromReply(file:string,replyId:string,commentId:string,feedbackId:string){
    return this.http.delete<any>(environment.api+'comments/'+replyId+'/'+commentId+'/'+feedbackId+'/'+file,{})
  }
  pinComment(commentId:string,feedbackId:string){
    return this.http.get<any>(environment.api+`comments/marked_pined/${commentId}/${feedbackId}`,{})
  }
  mergeFeedbacks(oldFeed:string,newFeed:string){
    return this.http.get(environment.api+`feedbacks/${oldFeed}/${newFeed}/storemerge`,{});
  }
}
