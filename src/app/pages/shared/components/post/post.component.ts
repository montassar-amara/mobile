import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { IFeedback } from 'src/app/shared/models/feedback';
import { EPostStatus } from 'src/app/shared/models/post-status';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from 'src/app/shared/models/user';
import { StoreService } from 'src/app/shared/services/store.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnDestroy {
  showSwiperModal = false;
  likesIds: any[] = [];

  @Output() openModal = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onLike = new EventEmitter();
  @Output() onMerge = new EventEmitter();
  @Output() onPreview = new EventEmitter();
  @Output() onStateChanged = new EventEmitter();
  @Input() user!:IUser
  @Input() feedback: IFeedback & {
    newMessage?: string;
    newSubject?: string;
    uploadedFiles?: File[];
  };
  status = Object.keys(EPostStatus).map((key) => EPostStatus[key]);
  @Input() viewMode = false;
  @Input() isFeedback = true;
  @Input() isDisabled = false;
  editModeMessage = false;
  editModeSubject = false;
  displayMerge = false;
  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;
  checkedForMerge!: IFeedback;
  mergeTerm$ = new BehaviorSubject<string>('');
  items$!:Observable<any[]>;
  liked$!:Observable<boolean>;
  destroy$ = new Subject();
  server = environment.filepath;
  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    if(this.isFeedback){
      this.items$ = this.storeService.feedbacks$
    }else{
      this.items$ = this.storeService.contributions$
    }
    this.liked$ = this.items$.pipe(
      map(
        (feeds) =>
          !!feeds
            .find((feed) => feed._id === this.feedback._id)?.likes?.find((like) => like.user_id === this.user?._id)
      )
    );
    (this.feedback.likes ?? []).forEach((el) => {
      this.likesIds.push(el.user_id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  response() {
    this.openModal.emit();
  }
  like(event: Event) {
    event.stopPropagation();
    this.onLike.emit();
  }
  delete() {
    this.onDelete.emit();
  }
  save() {
    if(this.isFeedback){
      this.storeService.updateFeedback( { message: this.feedback.newMessage },this.feedback.uploadedFiles ?? [],this.feedback._id)
    }else{
      this.storeService.updateContribution( { message: this.feedback.newMessage },this.feedback.uploadedFiles ?? [],this.feedback._id)
    }
  }
  saveSubject() {
    if(this.isFeedback){
      this.storeService.updateFeedback( { subject: this.feedback.newSubject },[],this.feedback._id)
    }else{
      this.storeService.updateContribution( { subject: this.feedback.newSubject },[],this.feedback._id)
    }
  }
  cancel() {
    this.feedback.newMessage = undefined;
  }
  cancelSubject() {
    this.feedback.newSubject = undefined;
  }
  removeFile(file: string) {
    if(this.isFeedback){
      this.storeService.removeFileFeedback(file,this.feedback._id)
    }else{
      this.storeService.removeFileContribution(file,this.feedback._id)
    }
  }
  changeCheckedItem(item: IFeedback) {
    if (this.checkedForMerge && this.checkedForMerge._id === item._id) {
      this.checkedForMerge = undefined;
    } else {
      this.checkedForMerge = item;
    }
  }
  merge() {
    this.onMerge.emit({ ...this.checkedForMerge });
    this.checkedForMerge = undefined;
  }
  addFiles(event: any) {
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
      if (!this.feedback.uploadedFiles) {
        this.feedback.uploadedFiles = [];
      }
      this.feedback.uploadedFiles.push(...files)
    }
        event.target.value = null;
        return;
  }
  changeStatus(event: Event, st: string, feedback_id: string) {
    this.storeService.updateStatusFeedback(feedback_id,st)
  }
  trackbyName(item: string) {
    return item;
  }
  preview(collection: string[]) {
    this.onPreview.emit(collection);
  }
  removeFileFromUpload(index: number) {
    this.feedback.uploadedFiles.splice(index, 1);
  }
  editMessage(){
    this.editModeMessage=true
    this.feedback.newMessage = this.feedback.message;
  }
}
