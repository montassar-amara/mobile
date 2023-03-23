import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  @Input() blogs:any[];
  @Output() select= new EventEmitter();
  filepath = environment.filepath;
  
  constructor(private store:StoreService) { }

  ngOnInit(): void {
  }
  openLink(blog:any){
    this.select.emit(blog);
  }
  find(id:string){
    return this.store.companies$.getValue().find(c=>c._id===id)?.logo
  }
}
