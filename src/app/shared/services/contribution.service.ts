import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IComment } from '../models/comment';
import { IContribution, ICycle } from '../models/contribution';
import { IReply } from '../models/reply';

@Injectable({
  providedIn: 'root'
})
export class ContributionService {
  constructor(
    private http: HttpClient,
    // private fake:FakerService
    ) { }

  getContributions(cycleId:string){
    return this.http.get<{suggestions:IContribution[]}>(environment.api+'suggestions/filter/'+cycleId,{});
  }

  addContribution(post:Partial<IContribution>,files: File[]): Observable<IContribution> {
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json; *');
    const form = new FormData()
    form.append('subject',post.subject)
    form.append('message',post.message)
    files.map(file=>form.append('images[]',file))
    return this.http.post<IContribution>(environment.api+'suggestions/store', form, {});
  }

  deleteContribution(id:string){
    //this.fake.deleteContribution(id)
    return this.http.delete<IContribution>(environment.api+'suggestions/delete/'+id,{});
  }

  partialUpdateContribution(contribution:Partial<IContribution>,files:File[],contributionId:string){
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    if(contribution.message){
      form.append('message',contribution.message)
    }
    if(contribution.subject){
      form.append('subject',contribution.subject)
    }
    if(files && files.length>0){
      files.map(file=>form.append('images[]',file))
    }
    return this.http.post<IContribution>(environment.api+'suggestions/update/'+contributionId, form,{});
    //this.fake.partialUpdateContribution(contribution,contributionId)
  }

  deleteComment(commentId:string, contributionId:string){
    //this.fake.deleteComment(commentId,contributionId)
    return this.http.delete<IContribution>(environment.api+'suggestions/comments/delete/'+commentId+'/'+contributionId,{});
  }
  deleteReply(commentId: string, replyId:string,contributionId:string){
    //this.fake.deleteReply(replyId,commentId,contributionId)
    return this.http.delete<IContribution>(environment.api+'suggestions/replies/delete/'+commentId+'/'+replyId+'/'+contributionId,{});
  }
  publishComment(comment:Partial<IComment>,files:File[],contributionId:string):Observable<Comment>{
    //return this.http.post<Comment>(environment.api+'comments/store/'+contributionId, comment)
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    form.append('message',comment.message)
    form.append('type', 'comment');
    files.map(file=>form.append('images[]',file))
    return this.http.post<Comment>(environment.api+'suggestions/comment/'+contributionId, form, {});
  }
  publishReply(reply:Partial<IReply>,files:File[],contributionId:string,selectedCommentId:string):Observable<IReply>{
    //reply.owner = this.fake.getPrincipal()
    //this.fake.publishReply(reply,uploadedFiles,contributionId,selectedCommentId)
    //this.http.post<IReply>(environment.api+'comments/store/'+contributionId, {...reply,image:files, replie_id_comment: selectedCommentId});
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');
    const form = new FormData()
    form.append('message',reply.message)
    form.append('type', 'reply');
    form.append('replie_id_comment', selectedCommentId);
    files.map(file=>form.append('images[]',file))
    return this.http.post<IReply>(environment.api+'suggestions/comment/'+contributionId, form, {});
  }
  partialUpdateComment(comment:Partial<IComment>,uploadedFiles:File[],contributionId:string){

    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');

    const form = new FormData()
    form.append("message",comment.message)
    uploadedFiles.forEach(file=>form.append("images[]",file))

    return this.http.post<Comment>(environment.api+'suggestions/updateComment/'+comment._id+'/'+contributionId, form, {})
  }
  partialUpdateReply(reply:Partial<IReply>,uploadedFiles:File[],contributionId:string,commentId:string){
    //const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    //headers.append('Accept', 'application/json');

    const form = new FormData()
    form.append("message",reply.message)
    uploadedFiles.forEach(file=>form.append("images[]",file))
    return this.http.post<Comment>(environment.api+'suggestions/updateReply/'+reply._id+'/'+commentId+'/'+contributionId, form, {})
  }
  likePost(id:string){
    return this.http.post(environment.api+'suggestions/like/'+id, {}, {})
  }

  removeFileFromContribution(file:string,contributionId:string){
    return this.http.delete<any>(environment.api+'suggestions/delete_image/'+contributionId+'/'+file,{})
  }
  removeFileFromComment(file:string,commentId:string,contributionId:string){
    return this.http.delete<any>(environment.api+'suggestions/'+commentId+'/'+contributionId+'/'+file,{})
  }
  removeFileFromReply(file:string,replyId:string,commentId:string,contributionId:string){
    return this.http.delete<any>(environment.api+'suggestions/'+replyId+'/'+commentId+'/'+contributionId+'/'+file,{})
  }
  pinComment(commentId:string,contributionId:string){
    return this.http.get<any>(environment.api+`suggestions/marked_pined/${commentId}/${contributionId}`,{})
  }
  fetchCycles(){
    return this.http.get<ICycle[]>(environment.api+'periodCycles',{})
  }
  addCycles(start:Date,end:Date){
    const data = new FormData()
    data.append("start_date",start.toISOString());
    data.append("end_date",end.toISOString());
    return this.http.post<string>(environment.api+'periodCycles/store',data)
  }
  updateCycles(end:Date,id:string){
    const data = new FormData()
    data.append("end_date",end.toISOString());
    return this.http.post<string>(environment.api+'periodCycles/update/'+id,data)
  }
  endCycle(id:string){
    return this.http.get<string>(environment.api+'periodCycles/enclose/'+id,{})
  }
}

