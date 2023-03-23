import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IComment } from 'src/app/shared/models/comment';
import { IUser } from 'src/app/shared/models/user';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit,OnDestroy {
  @Input() reply!:IComment
  @Input() showPin = false;
  @Input() pinMenu = true;
  @Input() isFeedback = true;
  @Input() isDisabled = false;

  @Input() showReply: boolean;
  @Input() feedbackId!: string;
  @Input() commentId!: string;

  @Input() last: any;
  @Input() first: any;
  @Input() msg = "Comment"
  @Input() user!:IUser;
  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;
  replyEmpty: boolean = true;
  commentFileIndex = 0
  server = environment.filepath;
  newComment:Partial<IComment> & {uploadedFiles:File[]} = {
    message:"",
    uploadedFiles:[]
  }
  isImage = ['.gif','.jpg','.jpeg','.png'];
  replyMode=false;

  openedComment: boolean = false;

  editMode=false;
  openedComment$ = this.storeService.openedComment$
  openedCommentContribution$ = this.storeService.openedContribution$
  notifier$ = this.storeService.notifier$
  destroy$ = new Subject()
  constructor(
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.openedComment$.subscribe(res=>{
      if(res!==this.reply._id){
        this.cancelReply()
      }
    })
    this.openedCommentContribution$.subscribe(res=>{
      if(res!==this.reply._id){
        this.cancelReply()
      }
    })
    
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe(msg=>{
      switch (msg) {
        case Notifier.CommentUpdateSuccessful:
          case Notifier.ContributionCommentUpdateSuccessful:
        case Notifier.ReplyAddSuccessful:
          case Notifier.ContributionReplyAddSuccessful:
        case Notifier.ReplyUpdateSuccessful:
          case Notifier.ContributionReplyUpdateSuccessful:
        case Notifier.CommentAddSuccessful:
          case Notifier.ContributionCommentAddSuccessful:
          this.newComment={
            message:"",
            uploadedFiles:[]
          }
          this.editMode=false
          break;
        default:
          break;
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)

  }
  delete(){
    if(this.commentId){
      if(this.isFeedback){
        this.storeService.deleteReply(this.commentId,this.reply._id,this.feedbackId)
      }else{
        this.storeService.deleteReplyContribution(this.commentId,this.reply._id,this.feedbackId)
      }
    }else{
      if(this.isFeedback){
        this.storeService.deleteComment(this.reply._id,this.feedbackId)
      }else{
        this.storeService.deleteCommentContribution(this.reply._id,this.feedbackId)
      }
    }
  }
  addFilesToComment(event:any){
    const input = event.target as HTMLInputElement
    const files =  Array.from(input.files)
    const size =  files[0].size / 1024 /1024
    const isVideo = files[0].type.includes('video')
    const isImage = files[0].type.includes('image')
    if(!isImage && !isVideo){
      this.unsupportedFileType = true;
      return
    } else {
      this.unsupportedFileType = false;
    }
    if(size>2 && isImage || size>20 && isVideo){
      this.fileSizeBig = true;
      return
    } else {
      this.fileSizeBig = false;
    }
    if(input.files.length>0){
      this.newComment.uploadedFiles.push(...files)
    }
        event.target.value = null;
        return;
  }
  removeFile(file:string):void{
    if(this.commentId){
      if(this.isFeedback){
        this.storeService.removeFileReply(file,this.reply._id,this.commentId,this.feedbackId)
      }else{
        this.storeService.removeFileReplyContribution(file,this.reply._id,this.commentId,this.feedbackId)
      }
    }else{
      if(this.isFeedback){
        this.storeService.removeFileComment(file,this.commentId,this.feedbackId)
      }else{
        this.storeService.removeFileCommentContribution(file,this.commentId,this.feedbackId)
      }
    }
  }

  publishComment(){
    if(this.isFeedback){
      this.storeService.updateComment({...this.newComment},this.newComment.uploadedFiles,this.feedbackId)
    }else{
      this.storeService.updateCommentContribution({...this.newComment},this.newComment.uploadedFiles,this.feedbackId)
    }
  }
  publishReply(){
    if(this.editMode){
      if(this.isFeedback){
        this.storeService.updateReply({...this.newComment},this.newComment.uploadedFiles,this.openedComment$.getValue(),this.feedbackId)
      }else{
        this.storeService.updateReplyContribution({...this.newComment},this.newComment.uploadedFiles,this.openedComment$.getValue(),this.feedbackId)
      }
    }else{
      if(this.isFeedback){
        this.storeService.addReply({...this.newComment},this.newComment.uploadedFiles,this.openedComment$.getValue(),this.feedbackId)
      }else{
        this.storeService.addReplyContribution({...this.newComment},this.newComment.uploadedFiles,this.openedComment$.getValue(),this.feedbackId)
      }
    }
    this.replyMode = true;
  }
  cancelReply(){
    this.cancelEdit()
    this.newComment={
      message:"",
      uploadedFiles:[]
    }
    this.replyMode=false
  }
  cancelEdit(){
    this.replyEmpty = true;
    this.editMode=false
  }
  startEdit(){
    if(this.isFeedback){
      this.storeService.openedComment$.next(this.reply._id)
    }else{
      this.storeService.openedContribution$.next(this.reply._id)
    }

    this.newComment={
      ...this.reply,
      uploadedFiles:[]
    }
    this.replyEmpty = false;
    this.editMode=true
  }
  pin(){
    if(this.isFeedback){
      this.storeService.pinComment(this.reply._id,this.feedbackId)
    }else{
      this.storeService.pinCommentContribution(this.reply._id,this.feedbackId)
    }
  }
  trackbyName(item:string){
    return item
  }
  removeFileFromComment(index:number){
    this.newComment.uploadedFiles.splice(index,1)
    if(this.commentFileIndex*3>=this.newComment.uploadedFiles.length){
      this.commentFileIndex = Math.max(0,this.commentFileIndex-1)
    }
  }
  registerNewReplyStart(){
    this.replyMode=true;
    this.openedComment$.next(this.reply._id)
    // setTimeout(() => {
    //   document.getElementById('commentarea'+this.reply._id).focus()
    // });
  }
 toggleReplies(){
    const item = document.getElementById(this.reply._id)
    if(item){
      return item.classList.contains('show')
    }
    return false
  }
  IndexCommentUp(){
    if(this.commentFileIndex*3<this.newComment.uploadedFiles.length){
      this.commentFileIndex += 1
    }
  }
  IndexCommentDown(){
    if(this.commentFileIndex>0){
      this.commentFileIndex -= 1
    }
  }
}
