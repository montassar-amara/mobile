import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogs:any[]=[]
  deleteModal= false;
  selectedBlog = undefined;
  constructor(private blogService: BlogService,private router:Router) { }

  ngOnInit(): void {
   this.fetch()
  }
  edit(blog:any){
    this.blogService.selectedBlog$.next(blog)
    this.router.navigate(['/manager/blogs/edit'])
  }
  publish(blog:any){
    this.blogService.publish(blog._id).subscribe(res=>{
      this.fetch()
    })
  }
  delete(blog:any){
    this.blogService.delete(blog._id).subscribe(res=>{
      this.deleteModal= false;
      this.fetch()
    })
  }
  fetch(){
    this.blogService.fetch().subscribe((res:any[])=>{
      this.blogs = res;
    })
  }
}
