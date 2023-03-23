import { Component, Input, OnInit } from '@angular/core';
import { ITempCompany } from 'src/app/shared/models/tempCompany';
import { TempCompaniesService } from 'src/app/shared/services/temp-companies.service';
import { FeedbackAreaService } from 'src/app/shared/styling_services/feedback-area.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-temporary-companies',
  templateUrl: './temporary-companies.component.html',
  styleUrls: ['./temporary-companies.component.scss']
})
export class TemporaryCompaniesComponent implements OnInit {
  @Input() preview=true
  backlog:ITempCompany[] = []
  screening:ITempCompany[]  = []
  approval:ITempCompany[]  = []
  dragIndex: number;
  dropIndex: number;
  source:string;
  filepath = environment.filepath
  inScreening= false
  isExpanded = false
  company:Partial<ITempCompany> = {
    name:'',
    link:'',
    logo:'',
    state:'backlog',
    order:0,
  }
  constructor(private tmpCompaniesService: TempCompaniesService,private feedbackAreaService: FeedbackAreaService ) { }

  ngOnInit(): void {
   this.init()
  }
  init(){
    this.tmpCompaniesService.getAllCompanies().subscribe(res=>{
      this.backlog = res.filter(tmp=>tmp.state==="backlog").sort((a,b)=>a.order-b.order)
      this.screening = res.filter(tmp=>tmp.state==="screening").sort((a,b)=>a.order-b.order)
      this.approval = res.filter(tmp=>tmp.state==="approval").sort((a,b)=>a.order-b.order)
    })
  }
  onDragStart(index:number,collection:string) {
    this.dragIndex = index;
    this.source=collection;
  }
  onDragEnd(index:number,collection:string) {
    this.dropIndex = index;
    if(this.source !== collection && this.source!==undefined){
      let draggedItem = this[this.source]?.splice(this.dragIndex, 1)[0];
      this[collection].splice(this.dropIndex, 0, draggedItem);
      this.tmpCompaniesService.updateCompanies(this[this.source],this.source).subscribe()
      this.tmpCompaniesService.updateCompanies(this[collection],collection).subscribe(_=>this.init())
    }else{
      if (this.dragIndex !== this.dropIndex && this.dragIndex!==undefined) {
        let draggedItem = this[collection].splice(this.dragIndex, 1)[0];
        this[collection].splice(this.dropIndex, 0, draggedItem);
        this.tmpCompaniesService.updateCompanies(this[collection],collection).subscribe(_=>this.init())
      }
    }
    this.source = undefined
    this.dragIndex = undefined;
    this.dropIndex = undefined;
  }
  addCompany(){
    this.company.order = this.backlog.length + 1;
    this.tmpCompaniesService.addCompany(this.company).subscribe(_=>this.init());
  }
  onFileSelected(event:any) {
    this.company.logo = <any>event.target.files[0];
  }
  deleteCompany(item:ITempCompany,collection:string){
    this.tmpCompaniesService.deleteCompany(item._id).subscribe()
    this.tmpCompaniesService.updateCompanies(this[collection].filter(el=>el._id!==item._id),collection).subscribe(_=>this.init())
  }
  contribute(){
    this.feedbackAreaService.showContribute = true;
  }
  visitLink(link:string){
    window.open(link, "_blank");
  }
}
