import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject, Observable } from 'rxjs';
import {
  takeUntil,
  map,
  shareReplay,
  filter,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { IComment } from 'src/app/shared/models/comment';
import { IContribution, ICycle } from 'src/app/shared/models/contribution';
import { INotification } from 'src/app/shared/models/notification';
import { EPostStatus } from 'src/app/shared/models/post-status';
import { IUser } from 'src/app/shared/models/user';
import { StoreService } from 'src/app/shared/services/store.service';
import { Notifier } from 'src/app/shared/store/states';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss'],
})
export class ContributeComponent implements OnInit, OnDestroy {
  fileSizeBig: boolean = false;
  unsupportedFileType: boolean = false;
  commentFileIndex = 0;
  isContribution: boolean = true;
  _contributionsRaw$ = this.storeService.contributions$;
  cycles$ = this.storeService.cycles$;
  currentCycle$ = this.cycles$.pipe(
    map((cs) => cs.find((c) => !c.is_enclosed))
  );
  selectedCycle$ = new BehaviorSubject<ICycle>(undefined);
  notifications$ = new BehaviorSubject<INotification[]>([]);

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
  selectedContributionIndex$ = new BehaviorSubject<number>(-1);
  selectedContribution$ = new BehaviorSubject<
    IContribution & { newMessage?: string; newSubject?: string }
  >(undefined);
  repliesCount$ = this.selectedContribution$.pipe(
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
  principal$: Observable<Partial<IUser>> = this.storeService.user$;
  isDisabled$ = combineLatest([
    this.currentCycle$,
    this.principal$,
    this.selectedCycle$,
  ]).pipe(
    map(
      ([cycle, user, selectedCycle]) =>
        !user || !cycle || selectedCycle?.is_enclosed
    )
  );
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
  addNew: Partial<IContribution> = {};
  displayAddNew = false;
  showSidebar = false;
  repliesCount = 0;
  contributions$ = combineLatest([
    this._contributionsRaw$,
    this.sort$,
    this.filter$,
    this.search$,
    this.principal$,
  ]).pipe(
    map(([items, sort, filter, search, principal]) => {
      let res: IContribution[] = [...items];
      if (search && search.length > 1) {
        res = items.filter((i) =>
          i.subject.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filter.show === 'mine') {
        res = res.filter((item) => item.user_id === principal?._id);
      }
      res = res.sort((a, b) => {
        if (sort.criteria === 'Upvotes') {
          return (
            (a.likes?.length - b.likes?.length) *
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
  contributionCount$ = combineLatest([
    this._contributionsRaw$,
    this.principal$,
  ]).pipe(
    filter(([_, principal]) => principal != undefined),
    map(([feeds, principal]) => {
      return {
        all: feeds.length,
        mine: feeds.filter((item) => item.user_id === principal?._id).length,
      };
    })
  );
  addNewConfig = false;
  notifier$ = this.storeService.notifier$;
  pinedComment$ = this.selectedContribution$.pipe(
    map((f) => f.comments.find((c) => c.pined))
  );
  server = environment.filepath + 'suggestions/';
  data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  constructor(private storeService: StoreService) {}

  async ngOnInit(): Promise<void> {
    this.selectedCycle$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.storeService.selectedCycle$.next(res?._id));
    this.storeService.selectedCycle$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.storeService.fetchContribution());
    this.cycles$.pipe(distinctUntilChanged()).subscribe((res) => {
      if (res.length > 0) {
        this.selectedCycle$.next(res.slice(-1)[0]);
        this.setSelectedCycle();
      }
    });
    this.storeService.fetchContributionsCycles();
    this._contributionsRaw$.subscribe((res) => {
      let sorted = [...res];
      sorted = sorted.sort((a, b) => b.likes?.length - a.likes?.length);
      let top5 = sorted.slice(0, 5);
      this.data = {
        labels: top5.map((res) => res.subject),
        datasets: [
          {
            data: top5.map((res) => res.likes?.length),
            backgroundColor: [
              '#42A5F5',
              '#66BB6A',
              '#FFA726',
              '#FFFF26',
              '#FFA726',
            ],
            hoverBackgroundColor: [
              '#64B5F6',
              '#81C784',
              '#FFB74D',
              '#FAA74D',
              '#FFCC4D',
            ],
          },
        ],
      };
    });
    combineLatest([this.selectedContributionIndex$, this.contributions$])
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
      .subscribe((res) => this.selectedContribution$.next(res));
    this.notifier$.pipe(takeUntil(this.destroy$)).subscribe((msg) => {
      switch (msg) {
        case Notifier.ContributionDeleteSuccessful:
          this.visibleUI = 'ALL';
          break;
        case Notifier.ContributionAddSuccessFul:
          this.addNewConfig = false;
          break;
        // case Notifier.FeedbackUpdateSuccessful:
        // const fd = this.selectedContribution$.getValue();
        // this.selectedFeedback$.next({
        //   ...fd,
        //   newMessage: '',
        //   newSubject: '',
        // });
        // break;
        case Notifier.ContributionCommentUpdateSuccessful:
        case Notifier.ContributionReplyAddSuccessful:
        case Notifier.ContributionReplyUpdateSuccessful:
        case Notifier.ContributionCommentAddSuccessful:
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
    this.selectedContributionIndex$.next(index);
    this.visibleUI = 'ONE';
  }
  delete(contribution: IContribution) {
    this.storeService.deleteContribution(contribution._id);
  }
  addnew(contribution: Partial<IContribution> & { uploadedFiles: File[] }) {
    this.storeService.createContribution(
      contribution,
      contribution.uploadedFiles
    );
  }
  save() {
    const { newMessage, _id } = this.selectedContribution$.getValue();
    if (newMessage.length > 0) {
      this.storeService.updateContribution({ message: newMessage }, [], _id);
    }
  }

  // comment && reply section
  addFilesToComment(event: any) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files);
    const size = files[0].size / 1024 / 1024;
    const isVideo = files[0].type.includes('video');
    const isImage = files[0].type.includes('image');
    if (!isImage && !isVideo) {
      this.unsupportedFileType = true;
      return;
    } else {
      this.unsupportedFileType = false;
    }
    if ((size > 2 && isImage) || (size > 20 && isVideo)) {
      this.fileSizeBig = true;
      return;
    } else {
      this.fileSizeBig = false;
    }
    if (input.files.length > 0) {
      this.newComment.uploadedFiles.push(...files);
    }
    event.target.value = null;
    return;
  }
  likePost(post: IContribution) {
    this.storeService.likeContribution(post['_id']);
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

  openDialog(): void {
    this.addNewConfig = !this.addNewConfig;
  }
  trackbyId(item: any) {
    return item._id;
  }
  trackbyName(item: any) {
    return item;
  }
  cleanUp() {
    this.selectedContributionIndex$.next(-1);
  }

  removeUploadedFileFromComment(index: number) {
    this.newComment.uploadedFiles.splice(index, 1);
    if (this.commentFileIndex * 3 >= this.newComment.uploadedFiles.length) {
      this.commentFileIndex = Math.max(0, this.commentFileIndex - 1);
    }
  }
  fireEditComment() {
    this.storeService.openContributionCommentForEdit('new');
  }
  publishComment() {
    this.storeService.addContributionComment(
      { ...this.newComment },
      this.newComment.uploadedFiles,
      this.selectedContribution$.getValue()._id
    );
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
  IndexCommentUp() {
    if (this.commentFileIndex * 3 < this.newComment.uploadedFiles.length) {
      this.commentFileIndex += 1;
    }
  }
  IndexCommentDown() {
    if (this.commentFileIndex > 0) {
      this.commentFileIndex -= 1;
    }
  }
  setSelectedCycle() {
    this.storeService.selectedCycle$.next(this.selectedCycle$.getValue()?._id);
  }

  startDate = '';
  endtDate = '';
  getDates(startDate: any, endDate: any) {
    this.startDate = startDate;
    this.endtDate = endDate;
  }
}
