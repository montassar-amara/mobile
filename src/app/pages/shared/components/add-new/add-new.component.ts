import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { IFeedback } from 'src/app/shared/models/feedback';
import { EPostCategory } from 'src/app/shared/models/post-category';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent implements OnInit {

  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;

  @Output() newPost = new EventEmitter()
  @Output() onClose = new EventEmitter()
  @Input() category!:string;
  @Input() isFeedback=true;
  @Input() isDisabled=false;
  notifier$= this.storeService.notifier$
  request:Partial<IFeedback> & {uploadedFiles:File[]} ={
    subject:'',
    message:'',
    uploadedFiles:[],
  }
  user$ = this.storeService.user$
  constructor(
    private storeService:StoreService
  ) { }

  ngOnInit(): void {
    this.notifier$.subscribe(res=>{
      if(res===Notifier.FeedbackAddSuccessFul || res===Notifier.ContributionAddSuccessFul ){
        this.request={
          subject:'',
          message:'',
          category:undefined,
          uploadedFiles:[],
        }
        this.close()
      }
    })
  }
  create(){
    this.newPost.emit({...this.request,category:this.request.category==='bug'?EPostCategory.BUG:EPostCategory.FEATURE})
  }
  addFiles(event:any){
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
      this.request.uploadedFiles.push(...files)
    }
        event.target.value = null;
        return;
  }
  removeFile(index:number):void{
    this.request.uploadedFiles.splice(index,1)
  }
  close(){
    this.onClose.emit()
  }
  updateTitle(text:string){
    if(text.length<=200){
      this.request.subject = text;
    }else{
      this.request.subject = this.request.subject+''
    }
  }
  updateDesc(text:string){
    if(text.length<=2000){
      this.request.message = text;
    }
  }
}
