import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Subject,
  Observable,
} from 'rxjs';
import {
  takeUntil,
  map,
  shareReplay,
  filter,
  debounceTime,
} from 'rxjs/operators';
import { IComment } from 'src/app/shared/models/comment';
import { IFeedback } from 'src/app/shared/models/feedback';
import { EPostStatus } from 'src/app/shared/models/post-status';
import { IUser } from 'src/app/shared/models/user';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;
  commentFileIndex = 0;
  isFeedback: boolean = true;
  _feedbacksRaw$ = this.storeService.feedbacks$
  sort$ = new BehaviorSubject<{
    criteria: string;
    direction: 'asc' | 'desc';
  }>({
    criteria: 'Recency',
    direction: 'desc',
  });
  filter$ = new BehaviorSubject<{
    show: string;
    category: {
      isFeature: boolean;
      isBug: boolean;
    };
    status: {
      underReview: boolean;
      inProgress: boolean;
      planned: boolean;
      completed: boolean;
    };
  }>({
    show: 'all',
    category: {
      isFeature: false,
      isBug: false,
    },
    status: {
      underReview: false,
      inProgress: false,
      planned: false,
      completed: false,
    },
  });
  countFilters$ = this.filter$.pipe(
    map((filters) => {
      const { underReview, inProgress, planned, completed } = filters.status;
      let counter =
        (underReview ? 1 : 0) +
        (+inProgress ? 1 : 0) +
        (planned ? 1 : 0) +
        (completed ? 1 : 0);
      const { isBug, isFeature } = filters.category;
      counter +=
        (isBug ? 1 : 0) +
        (isFeature ? 1 : 0) +
        (filters.show === 'mine' ? 1 : 0);
      return counter;
    })
  );
  selectedFeedbackIndex$ = new BehaviorSubject<number>(-1);
  selectedFeedback$ = new BehaviorSubject<
    IFeedback & { newMessage?: string; newSubject?: string }
  >(undefined);
  repliesCount$ = this.selectedFeedback$.pipe(
    map((item) => {
      if (item === undefined || item.comments.length === 0) {
        return 0;
      }
      return (
        item.comments
          .map((f) => f.replies.length)
          .reduce((acc, v) => acc + v, 0) + item.comments.length
      );
    })
  );
  editMode = false;
  principal$: Observable<Partial<IUser>> = this.storeService.user$.asObservable().pipe(shareReplay())
  status = Object.keys(EPostStatus).map((key) => EPostStatus[key]);
  newComment: Partial<IComment> & { uploadedFiles: File[] } = {
    message: '',
    uploadedFiles: [],
  };
  searchTerm$ = new BehaviorSubject<string>('');
  search$ = combineLatest([this.searchTerm$.pipe(debounceTime(300))]).pipe(
    map(([res]) => res)
  );
  destroy$ = new Subject();
  visibleUI: 'ALL' | 'ONE' = 'ALL';
  addNew: Partial<IFeedback> = {};
  displayAddNew = false;
  showSidebar = false;
  repliesCount = 0;
  feedbacks$ = combineLatest([
    this._feedbacksRaw$,
    this.sort$,
    this.filter$,
    this.search$,
    this.principal$,
  ]).pipe(
    map(([items, sort, filter, search, principal]) => {
      let res: IFeedback[] = items;
      if (search && search.length > 1) {
        res = items.filter((i) =>
          i.subject.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filter.show === 'mine') {
        res = res.filter((item) => item.user_id === principal?._id);
      }
      res = res.filter(
        (f) =>
          (f.category === 'Bug / Issue' && filter.category.isBug) ||
          (f.category === 'Feature Request' && filter.category.isFeature) ||
          (!filter.category.isBug && !filter.category.isFeature)
      );
      res = res.filter(
        (f) =>
          (f.status === 'Completed' && filter.status.completed) ||
          (f.status === 'In progress' && filter.status.inProgress) ||
          (f.status === 'Planned' && filter.status.planned) ||
          (f.status === 'Under Review' && filter.status.underReview) ||
          (!filter.status.completed &&
            !filter.status.inProgress &&
            !filter.status.planned &&
            !filter.status.underReview)
      );
      res = res.sort((a, b) => {
        if (sort.criteria === 'Upvotes') {
          return (
            (a.likes.length - b.likes.length) *
            (sort.direction === 'asc' ? 1 : -1)
          );
        } else {
          return (
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()) *
            (sort.direction === 'asc' ? 1 : -1)
          );
        }
      });
      return res;
    }),
    shareReplay()
  );
  feedbackCount$ = combineLatest([this._feedbacksRaw$, this.principal$]).pipe(
    filter(([feeds, principal]) => principal != undefined),
    map(([feeds, principal]) => {
      return {
        all: feeds.length,
        mine: feeds.filter((item) => item.user_id === principal?._id).length,
        bugs: feeds.filter((item) =>
          item.category.toLowerCase().includes('bug')
        ).length,
        feature: feeds.filter((item) =>
          item.category.toLowerCase().includes('feature')
        ).length,
        planned: feeds.filter((item) =>
          item.status.toLowerCase().includes('planned')
        ).length,
        completed: feeds.filter((item) =>
          item.status.toLowerCase().includes('completed')
        ).length,
        inprogress: feeds.filter((item) =>
          item.status.toLowerCase().includes('progress')
        ).length,
        underreview: feeds.filter((item) =>
          item.status.toLowerCase().includes('review')
        ).length,
      };
    })
  );
  addNewConfig = {
    bug: false,
    feature: false,
  };
  notifier$ = this.storeService.notifier$
  pinedComment$ = this.selectedFeedback$.pipe(
    map((f) => f.comments.find((c) => c.pined))
  );
  server = environment.filepath + 'feedbacks/';
  constructor(
    private storeService: StoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.storeService.fetchFeedback()
    combineLatest([this.selectedFeedbackIndex$, this.feedbacks$])
      .pipe(
        takeUntil(this.destroy$),
        map(([index, items]) => {
          if (index >= 0 && items.length > 0) {
            return {
              ...items[index],
              newMessage: undefined,
              newSubject: undefined,
            };
          } else {
            return undefined;
          }
        })
      )
      .subscribe((res) => this.selectedFeedback$.next(res));
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe((msg) => {
      switch (msg) {
        case Notifier.FeedbackDeleteSuccessful:
          this.visibleUI = 'ALL';
          break;
        case Notifier.FeedbackAddSuccessFul:
          this.addNewConfig.bug = false;
          this.addNewConfig.feature = false;
          break;
        case Notifier.FeedbackUpdateSuccessful:
          const fd = this.selectedFeedback$.getValue();
          this.selectedFeedback$.next({
            ...fd,
            newMessage: '',
            newSubject: '',
          });
          break;
        case Notifier.CommentUpdateSuccessful:
        case Notifier.ReplyAddSuccessful:
        case Notifier.ReplyUpdateSuccessful:
        case Notifier.CommentAddSuccessful:
          this.newComment = {
            message: '',
            uploadedFiles: [],
          };
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  clearFilters() {
    this.filter$.next({
      show: 'all',
      category: {
        isFeature: false,
        isBug: false,
      },
      status: {
        underReview: false,
        inProgress: false,
        planned: false,
        completed: false,
      },
    });
  }
  openModal(index: number) {
    this.selectedFeedbackIndex$.next(index);
    this.visibleUI = 'ONE';
  }
  delete(feedback: IFeedback) {
    this.storeService.deleteFeedback(feedback._id)
  }
  addnew(feedback: Partial<IFeedback> & { uploadedFiles: File[] }) {
    feedback.status = 'Under Review';
    feedback.category = this.addNew.category;
    this.storeService.createFeedback(feedback,feedback.uploadedFiles)
  }
  save() {
    const { newMessage, _id } = this.selectedFeedback$.getValue();
    if (newMessage.length > 0) {
      this.storeService.updateFeedback({ message: newMessage },[],_id)
    }
  }

  // comment && reply section
  addFilesToComment(event: any) {
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
  likePost(post: IFeedback) {
    this.storeService.likeFeedback(post['_id'])
  }
  changeSortDir() {
    const sort = this.sort$.getValue();
    sort.direction = sort.direction == 'asc' ? 'desc' : 'asc';
    this.sort$.next(sort);
  }
  changeSortCriteria(criteria: string) {
    const sort = this.sort$.getValue();
    sort.criteria = criteria;
    this.sort$.next(sort);
  }
  changeFilterShow(value: string) {
    const filter = this.filter$.getValue();
    filter.show = value;
    this.filter$.next(filter);
  }
  changeFilterCategory(key: string, value: boolean) {
    const filter = this.filter$.getValue();
    filter.category[key] = value;
    this.filter$.next(filter);
  }
  changeFilterStatus(key: string, value: boolean) {
    const filter = this.filter$.getValue();
    filter.status[key] = value;
    this.filter$.next(filter);
  }
  openDialog(category: string): void {
    if (category === 'bug') {
      this.addNewConfig.bug = !this.addNewConfig.bug;
      this.addNewConfig.feature = false;
    } else {
      this.addNewConfig.feature = !this.addNewConfig.feature;
      this.addNewConfig.bug = false;
    }
    if (this.addNewConfig.bug) {
      this.addNew.category = 'Bug / Issue';
    } else if (this.addNewConfig.feature) {
      this.addNew.category = 'Feature Request';
    }
  }
  trackbyId(item: any) {
    return item._id;
  }
  trackbyName(item: any) {
    return item;
  }
  cleanUp() {
    this.selectedFeedbackIndex$.next(-1);
  }

  removeUploadedFileFromComment(index: number) {
    this.newComment.uploadedFiles.splice(index, 1);
    if(this.commentFileIndex*3>=this.newComment.uploadedFiles.length){
      this.commentFileIndex = Math.max(0,this.commentFileIndex-1)
    }
  }
  fireEditComment() {
    this.storeService.openCommentForEdit('new')
  }
  publishComment() {
    if(this.isFeedback){
      this.storeService.addComment( { ...this.newComment }, this.newComment.uploadedFiles,this.selectedFeedback$.getValue()._id)
    }else{
      this.storeService.addContributionComment({ ...this.newComment }, this.newComment.uploadedFiles,this.selectedFeedback$.getValue()._id)
    }
  }

  lastScroll = 0;
  defaultOffset = 0;
  hideLine = true;
  scrollPosition = () =>
    window.pageYOffset || document.documentElement.scrollTop;
  scrollReplies() {
    if (this.scrollPosition() > this.lastScroll) {
      // scroll down
      // this.hideLine = true;
    } else if (this.scrollPosition() < this.lastScroll) {
      // scroll up
      // this.hideLine = false;
    }
    this.lastScroll = this.scrollPosition();
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
