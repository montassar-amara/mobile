import { Component, OnInit } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { ICycle } from 'src/app/shared/models/contribution';
import { IUser } from 'src/app/shared/models/user';
import { ContributionService } from 'src/app/shared/services/contribution.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { SubscriptionsService } from 'src/app/shared/services/subscriptions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ThemeService } from 'src/app/shared/styling_services/theme.service';

@Component({
  selector: 'app-manager-layout',
  templateUrl: './manager-layout.component.html',
  styleUrls: ['./manager-layout.component.scss']
})
export class ManagerLayoutComponent implements OnInit {
  startDate= new Date()
  portfolio = false;
  blogs = false;
  endDate= new Date(+(new Date())+30*24*60*60*1000)
  cycles$ = this.storeService.cycles$
  currentCycle$ = this.cycles$.pipe(map((cs)=>cs.find(c=>!c.is_enclosed)))
  users = []
  showConfirmModal = false;
  selectedUser!:IUser;
  constructor(
    public themeService: ThemeService,
    private contributionService: ContributionService,
    private storeService: StoreService,
    private userService: UserService,
    private subscriptionService: SubscriptionsService,
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(res=>{
      this.users=[...res];
    })
    this.storeService.fetchContributionsCycles()
    this.currentCycle$.pipe(withLatestFrom(this.cycles$)).subscribe(([res,cycles]:[ICycle,ICycle[]])=>{
      if(res && !(res?.is_enclosed)){
        this.startDate = new Date(res.start_date)
        this.endDate = new Date(res.end_date)
      }else{
        if(cycles.length>0){
          const d =cycles.slice(-1)[0]
          this.startDate = new Date(d.end_date)
          this.endDate = new Date(+(new Date(d.end_date))+30*24*60*60*1000)
        }else{
          this.startDate= new Date()
          this.endDate= new Date(+(new Date())+30*24*60*60*1000)
        }
      }
    })
  }
  startCycle(){
    this.contributionService.addCycles(this.startDate,this.endDate).subscribe(()=>this.storeService.fetchContributionsCycles())
  }
  EndCycle(id:string){
    this.contributionService.endCycle(id).subscribe(()=>this.storeService.fetchContributionsCycles())
  }
  updateCycle(id:string){
    this.contributionService.updateCycles(this.endDate,id).subscribe(()=>this.storeService.fetchContributionsCycles())
  }
  deleteUser(user:IUser){
   this.selectedUser = user
    this.showConfirmModal = true;
   
  }

  confirmDelete(){
    this.userService.deleteUser(this.selectedUser._id).subscribe(()=>this.userService.getUsers().subscribe(res=>{
      this.users=[...res];
      this.selectedUser = undefined
      this.showConfirmModal = false
    }))
  }
  cancelDelete(){
    this.selectedUser = undefined;
    this.showConfirmModal = false
  }
  addMasterPlan(user:IUser){
    this.subscriptionService.addMasterPlan(user._id).subscribe()
  }
  removeMasterPlan(user:IUser){
    this.subscriptionService.deleteMasterPlan(user._id).subscribe()
  }
}
