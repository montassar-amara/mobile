import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../shared.module';
import { BlogComponent } from './blog.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { NgxWigModule } from 'ngx-wig';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DropdownModule } from 'primeng/dropdown';
import { MatGridListModule } from '@angular/material/grid-list';
import { DialogModule } from 'primeng/dialog';
import { PreviewComponent } from './preview/preview.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

@NgModule({
  declarations: [
    BlogComponent,
    CreateBlogComponent,
    EditBlogComponent,
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ImageCropperModule,
    NgxWigModule,
    NgbModule,
    DragDropModule,
    DropdownModule,
    MatGridListModule,
    DialogModule,
    ImageCropperModule,
    SharedModule,
  ]
})
export class BlogModule { }
