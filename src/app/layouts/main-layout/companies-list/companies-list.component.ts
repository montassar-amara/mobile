import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICompany } from 'src/app/shared/models/company';
import { StoreService } from 'src/app/shared/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss']
})
export class CompaniesListComponent implements OnInit {
  @Input() companies!:ICompany[]
  @Input() hasShadow = true;
  selectedCompanies$ = this.storeService.selectedCompanies$;
  user$ = this.storeService.user$
  subscription$ = this.storeService.subscription$;
  filepath = environment.filepath;
  @Output() onOpen = new EventEmitter<{event:Event;company:ICompany}>()
  @Output() onFadeIn = new EventEmitter<string>()
  @Output() onFadeOut = new EventEmitter()
  @Output() onSelectCompany = new EventEmitter<{event:Event;company:ICompany}>()
  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
  }
  open(event:Event,company:ICompany){
    this.onOpen.emit({event,company})
  }
  fadeIn(color:string){
    this.onFadeIn.emit(color)
  }
  fadeOut(){
    this.onFadeOut.emit()
  }
  selectCompany(event:Event,company:ICompany){
    this.onSelectCompany.emit({event,company})
  }
}
