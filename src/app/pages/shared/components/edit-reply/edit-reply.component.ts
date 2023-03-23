import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IComment } from 'src/app/shared/models/comment';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-edit-reply',
  templateUrl: './edit-reply.component.html',
  styleUrls: ['./edit-reply.component.scss']
})
export class EditReplyComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() reply!:IComment;
  @Input() commentId!: string;
  @Input() feedbackId!: string;
  @Input() editMode=false;
  @Input() isFeedback=true;
  newComment:Partial<IComment> & {uploadedFiles:File[]} = {
    message:"",
    uploadedFiles:[]
  }
  commentFileIndex = 0;
  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;
  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit(): void {
    this.newComment.message = this.reply?.message ?? ''
  }
  cancelReply(){
    this.newComment={
      message:"",
      uploadedFiles:[]
    }
    this.close.emit()
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
  publishComment(){
    if(this.isFeedback){
      this.storeService.updateComment({...this.reply,...this.newComment},this.newComment.uploadedFiles,this.feedbackId)
    }else{
      this.storeService.updateCommentContribution({...this.reply,...this.newComment},this.newComment.uploadedFiles,this.feedbackId)
    }
  }
  publishReply(){
    if(this.isFeedback){
      this.storeService.updateReply({...this.reply,...this.newComment},this.newComment.uploadedFiles,this.commentId,this.feedbackId)
    }else{
      this.storeService.updateReplyContribution({...this.reply,...this.newComment},this.newComment.uploadedFiles,this.commentId,this.feedbackId)
    }
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
  removeFileFromComment(index:number){
    this.newComment.uploadedFiles.splice(index,1)
    if(this.commentFileIndex*3>=this.newComment.uploadedFiles.length){
      this.commentFileIndex = Math.max(0,this.commentFileIndex-1)
    }
  }
}
