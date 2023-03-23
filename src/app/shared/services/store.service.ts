import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, take, tap } from 'rxjs/operators';
import { ICard } from '../models/card';
import { IComment } from '../models/comment';
import { ICompany } from '../models/company';
import { IContribution, ICycle } from '../models/contribution';
import { IFeedback } from '../models/feedback';
import { IPlan } from '../models/plan';
import { IReply } from '../models/reply';
import { ISubscription } from '../models/subscription';
import { IUser } from '../models/user';
import { Notifier } from '../store/states';
import { AuthService } from './authentication/auth.service';
import { ContributionService } from './contribution.service';
import { FeedbackService } from './feedback.service';
import { SubscriptionsService } from './subscriptions.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  user$ = new BehaviorSubject<IUser>(undefined);
  plans$ = new BehaviorSubject<IPlan[]>([]);
  companies$ = new BehaviorSubject<ICompany[]>([]);
  feedbacks$ = new BehaviorSubject<IFeedback[]>([]);
  contributions$ = new BehaviorSubject<IContribution[]>([]);
  cycles$ = new BehaviorSubject<ICycle[]>([])
  selectedCycle$ = new BehaviorSubject<string>('')
  subscription$ = new BehaviorSubject<ISubscription>(undefined)
  cards$ = new BehaviorSubject<ICard[]>([])
  addCardErrorMessage$ = new BehaviorSubject<string>('')
  openedComment$ = new BehaviorSubject<string>('')
  openedContribution$ = new BehaviorSubject<string>('')
  private _notifier$ = new BehaviorSubject<Notifier>(Notifier.NONE)
  notifier$ = this._notifier$.asObservable()
  isLoggedIn$ = new BehaviorSubject<boolean>(false)
  selectedCompanies$ = new BehaviorSubject<ICompany[]>([]);
  filterCompany$ = new BehaviorSubject<{ name: string; checked: boolean }[]>(
    []
  );
  companyPreview$ = new BehaviorSubject<boolean>(false)
  startPlanSubs$ = new Subject<boolean>()
  searchTerm$ = new BehaviorSubject<string>('');
  search_word$ = new BehaviorSubject<string>('')
  onSerch$ = new BehaviorSubject<boolean>(false);
  search_elements$ = new BehaviorSubject<any[]>([]);
  moveNext$= new BehaviorSubject<boolean>(false)
  moveBack$= new BehaviorSubject<boolean>(false)
  search_index$ = new BehaviorSubject<number>(1)
  constructor(
    private subscriptionService: SubscriptionsService,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private contributionService: ContributionService,
  ) { }
  fetchCompanies(){
    this.subscriptionService.getCompanies().pipe(take(1),map((result:ICompany[])=> this.companies$.next(result))).subscribe()
  }
  fetchUser(){
    this.authService.getLoggedInUser().pipe(
      take(1),
      map((result:IUser)=> this.user$.next(result)),
      catchError(err=>{
        this.user$.next(undefined);
        return of(err)
      }),).subscribe()
  }
  fetchCardList(){
    this.subscriptionService.getCardList().pipe(
      take(1),
      map((result:ICard[])=> this.cards$.next(result)
  )).subscribe()
  }
  fetchSubscription(){
    this.subscriptionService.getSubscription().pipe(
      take(1),
      map((result:ISubscription)=> this.subscription$.next(result)
  )).subscribe()
  }
  subscriptionFreeCompany(id:string){
    this.subscriptionService.subscriptionFreeCompany(id).pipe(
      take(1),tap(()=>{
          this._notifier$.next(Notifier.SubscriptionFreeCompanySuccessful)
      })).subscribe()
  }
  verifyEmail(email:string){
    this.authService.verifEmail(email).pipe(tap(res=>{
      this._notifier$.next(!res?Notifier.verifyEmailSuccessfullExist:Notifier.verifyEmailSuccessfullNotExist)
  }),take(1)).subscribe()
  }
  verifyCode(email:string,code:string){
    this.authService.verifCode(email,code).pipe(tap(res=>{
      this._notifier$.next(res?Notifier.verifyCodeSuccessful:Notifier.verifyCodeFail)
  }),take(1)).subscribe()
  }
  resendCode(email:string){
    this.authService.verifEmail(email).pipe(tap(res=>{
      this._notifier$.next(!res?Notifier.resendCodeFail:Notifier.resendCodeSuccessful)
  }),take(1)).subscribe()
  }
  subscriptionAutopaymentPlan(){
    this.subscriptionService.updateAutoPaymentPlan().pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionAutoPaymentPlanSuccessful)
      }
  )).subscribe()
  }
  updateCompanyPeriod(id:string,period:string){
    this.subscriptionService.updateSubscriptionsPeriod(id, period /*.name*/).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.updateCompanyPeriodSuccessful)
      }
  )).subscribe()
  }
  updateSubscriptionPeriod(period:string){
    this.subscriptionService.updatePeriodSubscription(
      period
    ).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionPeriodPlanSuccessful)
      }
  )).subscribe()
  }
  updateNotifier(value:Notifier){
    this._notifier$.next(value)
  }
  updateCompanyAutopayment(id:string,status:boolean){
    this.subscriptionService.updateSubscriptionsAutopayment(id, status).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.updateCompanyAutopaymentSuccessful)
      }
  )).subscribe()
  }
  subscriptionUpgradePlan(planId:string,cardId:string){
    this.subscriptionService.upgradePlan(
      planId,
      cardId
    ).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionUpgradePlanSuccessful)
      }
  )).subscribe()
  }
  subscriptionSelectPlan(planId:string,period:string,cardId:string){
    this.subscriptionService.selectPlan(
      planId,
      period,
      cardId
    ).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionSelectPlanSuccessful)
      }
  )).subscribe()
  }
  downgradeReactivate(planId:string,period:string,cardId:string,toRemove:string[]){
    this.subscriptionService.downgradeReactivate(
      planId,
      period,
      cardId,
      toRemove
    ).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionSelectPlanSuccessful)
      }
  )).subscribe()
  }
  downgradePlan(toRemove:{company_id: string;}[],planId:string,period:string){
    this.subscriptionService.downgradePlan(
      toRemove,
      planId,
      period
    ).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionDowngradePlanSuccessful)
      }
  )).subscribe()
  }
  addCompaniesOutToSubSpecial(companies:ICompany[]){
    this.subscriptionService.addCompaniesOutToSubSpecial(companies).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.SubscriptionAddOutSpecialSuccessful)
      }
  )).subscribe()
  }
  addCompaniesInToSub(companies:ICompany[]){
    this.subscriptionService.addCompaniesInToSub(companies).subscribe(res=>{
      this.fetchSubscription()
      this._notifier$.next(Notifier.SubscriptionAddInSuccessful)
    })
  }
  SubscriptionAddCompaniesOut(cmpsOut:{cId: string;period: string;}[],cmpsIn:ICompany[],cardId:string){
    this.subscriptionService.addCompaniesOutToSub(cmpsOut,cardId).pipe(
      take(1),
      map(()=> {
          if(cmpsIn && cmpsIn.length>0)this.addCompaniesInToSub(cmpsIn)
          else {
            this.fetchSubscription()
            this._notifier$.next(Notifier.SubscriptionAddOutSuccessful)
          }
      }
  )).subscribe()
  }
  AddCard(card:Partial<ICard>){
    this.subscriptionService.addNewCard(card).pipe(
      take(1),
      catchError((err:any)=>{
        this.addCardErrorMessage$.next(err.error.message)
        this._notifier$.next(Notifier.AddCardFailed)
        return of(false)
      }),
      map((res:any)=> {
          if(res){
            this.fetchCardList()
            this._notifier$.next(Notifier.AddCardSuccessful)
          }
      }
  )).subscribe()
  }
  fetchFeedback(){
    this.feedbackService.getFeedbacks().pipe(
      take(1),
      map((result:{feedBack:IFeedback[]})=> {
          this.feedbacks$.next(result.feedBack)
          this._notifier$.next(Notifier.FeedbackFetchSuccessful)
      }
  )).subscribe()
  }
  deleteFeedback(feedbackId:string){
    this.feedbackService.deleteFeedback(feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.FeedbackDeleteSuccessful)
      }
  )).subscribe()
  }
  createFeedback(feedback:Partial<IFeedback>,files:File[]){
    this.feedbackService.addFeedback(feedback,files).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.FeedbackAddSuccessFul)
      }
  )).subscribe()
  }
  updateFeedback(feedback:Partial<IFeedback>,files:File[],feedbackId:string){
    this.feedbackService.partialUpdateFeedback(feedback,files,feedbackId).pipe(
      take(1),
      map(()=> {
        this.fetchFeedback()
        this._notifier$.next(Notifier.FeedbackUpdateSuccessful)
      }
  )).subscribe()
  }
  likeFeedback(id:string){
    this.feedbackService.likePost(id).pipe(
      take(1),
      map(()=> {
        this.fetchFeedback()
      }
  )).subscribe()
  }
  openCommentForEdit(name:string){
    this.openedComment$.next(name)
  }
  addComment(comment:Partial<IComment>,files:File[],feedbackId:string){
    this.feedbackService.publishComment(comment,files,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.CommentAddSuccessful)
      }
  )).subscribe()
  }
  addContributionComment(comment:Partial<IComment>,files:File[],contributionId:string){
    this.contributionService.publishComment(comment,files,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionCommentAddSuccessful)
      }
  )).subscribe()
  }
  fetchContribution(){
    this.contributionService.getContributions(this.selectedCycle$.getValue()).pipe(
      take(1),
      map((result:{suggestions:IContribution[]})=> {
          this.contributions$.next(result.suggestions)
          this._notifier$.next(Notifier.ContributionFetchSuccessful)
      }
  )).subscribe()
  }
  fetchContributionsCycles(){
    this.contributionService.fetchCycles().pipe(
      take(1),
      map((cycles:ICycle[])=> {
          this.cycles$.next(cycles)
          this._notifier$.next(Notifier.ContributionCycleFetchSuccessful)
      }
  )).subscribe()
  }
  deleteContribution(id:string){
    this.contributionService.deleteContribution(id).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionDeleteSuccessful)
      }
  )).subscribe()
  }
  createContribution(contribution:Partial<IContribution>,files:File[]){
    this.contributionService.addContribution(contribution,files).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionAddSuccessFul)
      }
  )).subscribe()
  }
  updateContribution(contribution:Partial<IContribution>,files:File[],id:string){
    this.contributionService.partialUpdateContribution(contribution,files,id).pipe(
      take(1),
      map(()=> this.fetchContribution()
  )).subscribe()
  }
  likeContribution(id:string){
    this.contributionService.likePost(id).pipe(
      take(1),
      map(()=> this.fetchContribution()
  )).subscribe()
  }
  openContributionCommentForEdit(name:string){
    this.openedContribution$.next(name)
  }
  deleteReply(commentId:string,replyId:string,feedbackId:string){
    this.feedbackService.deleteReply(commentId,replyId,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.ReplyDeleteSuccessful)
      }
  )).subscribe()
  }
  deleteReplyContribution(commentId:string,replyId:string,contributionId:string){
    this.contributionService.deleteReply(commentId,replyId,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionReplyDeleteSuccessful)
      }
  )).subscribe()
  }
  deleteComment(commentId:string,feedbackId:string){
    this.feedbackService.deleteComment(commentId,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.CommentDeleteSuccessful)
      }
  )).subscribe()
  }
  deleteCommentContribution(commentId:string,contributionId:string){
    this.contributionService.deleteComment(commentId,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionCommentDeleteSuccessful)
      }
  )).subscribe()
  }
  removeFileReply(file:string,replyId:string,commentId:string,feedbackId:string){
    this.feedbackService.removeFileFromReply(file,replyId,commentId,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.ReplyRemoveFileSuccessful)
      }
  )).subscribe()
  }
  removeFileReplyContribution(file:string,replyId:string,commentId:string,contributionId:string){
    this.contributionService.removeFileFromReply(file,replyId,commentId,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionReplyRemoveFileSuccessful)
      }
  )).subscribe()
  }
  removeFileComment(file:string,commentId:string,feedbackId:string){
    this.feedbackService.removeFileFromComment(file,commentId,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.CommentRemoveFileSuccessful)
      }
  )).subscribe()
  }
  removeFileCommentContribution(file:string,commentId:string,contributionId:string){
    this.contributionService.removeFileFromComment(file,commentId,contributionId).pipe(
      take(1),
      map(()=> {
        this.fetchContribution()
        this._notifier$.next(Notifier.ContributionCommentRemoveFileSuccessful)
      }
  )).subscribe()
  }
  updateComment(comment:Partial<IComment>,files:File[],feedbackId:string){
    this.feedbackService.partialUpdateComment(comment,files,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.CommentUpdateSuccessful)
      }
  )).subscribe()
  }
  updateCommentContribution(comment:Partial<IComment>,files:File[],contributionId:string){
    this.contributionService.partialUpdateComment(comment,files,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionCommentUpdateSuccessful)
      }
  )).subscribe()
  }
  updateReply(reply:Partial<IReply>,files:File[],commentId:string,feedbackId:string){
    this.feedbackService.partialUpdateReply(reply,files,feedbackId,commentId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.ReplyUpdateSuccessful)
      }
  )).subscribe()
  }
  updateReplyContribution(reply:Partial<IReply>,files:File[],commentId:string,contributionId:string){
    this.contributionService.partialUpdateReply(reply,files,contributionId,commentId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution();
          this._notifier$.next(Notifier.ContributionReplyUpdateSuccessful)
      }
  )).subscribe()
  }
  addReply(reply:Partial<IReply>,files:File[],commentId:string,feedbackId:string){
    this.feedbackService.publishReply(reply,files,feedbackId,commentId).pipe(
      take(1),
      map(()=> {
        this.fetchFeedback()
          this._notifier$.next(Notifier.ReplyAddSuccessful)
      }
  )).subscribe()
  }
  addReplyContribution(reply:Partial<IReply>,files:File[],commentId:string,contributionId:string){
    this.contributionService.publishReply(reply,files,contributionId,commentId).pipe(
      take(1),
      map(()=> {
        this.fetchContribution()
          this._notifier$.next(Notifier.ContributionReplyAddSuccessful)
      }
  )).subscribe()
  }
  pinComment(commentId:string,feedbackId:string){
    this.feedbackService.pinComment(commentId,feedbackId).pipe(
      take(1),
      map(()=> {
          this.fetchFeedback()
          this._notifier$.next(Notifier.CommentPinSuccessful)
      }
  )).subscribe()
  }
  pinCommentContribution(commentId:string,contributionId:string){
    this.contributionService.pinComment(commentId,contributionId).pipe(
      take(1),
      map(()=> {
          this.fetchContribution()
          this._notifier$.next(Notifier.ContributionCommentPinSuccessful)
      }
  )).subscribe()
  }
  removeFileFeedback(file:string,id:string){
    this.feedbackService.removeFileFromFeedback(file,id).pipe(
      take(1),
      map(()=> this.fetchFeedback()
  )).subscribe()
  }
  removeFileContribution(file:string,id:string){
    this.contributionService.removeFileFromContribution(file,id).pipe(
      take(1),
      map(()=> this.fetchContribution()
  )).subscribe()
  }
  updateStatusFeedback(id:string,status:string){
    this.feedbackService.changeFeedbackStatus(id,status).pipe(
      take(1),
      map(()=>this.fetchFeedback()
  )).subscribe()
  }
  fetchPlans(){
    this.subscriptionService.getplans().pipe(
      take(1),
      map((result)=> {
          this.plans$.next(result)
          this._notifier$.next(Notifier.ContributionReplyRemoveFileSuccessful)
      }
  )).subscribe()
  }
  subscriptionTradIn(cmp:string){
    this.subscriptionService.tradeIn(cmp).pipe(
      take(1),
      map(()=> {
          this.fetchSubscription()
          this._notifier$.next(Notifier.TradeInSuccessful)
      }
  )).subscribe()
  }
  updateNotification(index:number){
    if(index===0){
      this.authService.EnabledUpdateNotification().pipe(take(1)).subscribe(res=>{
        this.fetchUser()
      })
    }else{
      this.authService.EnabledNewTransactionNotification().pipe(take(1)).subscribe(res=>{
        this.fetchUser()
      })
    }
  }
  cleanUp(){
    this.user$.next(undefined)
    this.subscription$.next(undefined)
    this.cards$.next([])
  }
}
