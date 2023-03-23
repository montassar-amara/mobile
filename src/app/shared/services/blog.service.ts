import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  selectedBlog$ = new BehaviorSubject<any>(undefined)
  blogs = []
  constructor(private http: HttpClient) { }
  create(blog:any){
    return this.http.post(environment.api + `news/store`, blog);
  }
  update(blog:any){
    return this.http.post(environment.api + `news/update/${blog._id}`, blog);
  }
  fetch(){
    return this.http.get(environment.api + `news`);
  }
  newsList(){
    return this.http.get(environment.api+'news/newslist');
  }
  publish(id:string){
    return this.http.get(environment.api+'news/publish/'+id);
  }
  fetchOne(id:string){
    return this.http.get(environment.api + `news/fetch/`+id);
  }
  delete(id:string){
    return this.http.delete(environment.api + `news/delete/`+id);
  }
  updateCover(id:string,form:any){
    return this.http.post(environment.api + `news/upload_image/${id}`, form);
  }
}
