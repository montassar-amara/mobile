import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewComponent } from './components/add-new/add-new.component';
import { EditReplyComponent } from './components/edit-reply/edit-reply.component';
import { PostComponent } from './components/post/post.component';
import { PostDropdownComponent } from './components/post-dropdown/post-dropdown.component';
import { ReplyComponent } from './components/reply/reply.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserCommentAvatarComponent } from './components/user-comment-avatar/user-comment-avatar.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllPipesModule } from 'src/app/shared/pipes/all-pipes.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AddNewComponent,
    EditReplyComponent,
    PostComponent,
    PostDropdownComponent,
    ReplyComponent,
    UserAvatarComponent,
    UserCommentAvatarComponent,
    PortfolioComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    MatExpansionModule,
    ImageModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
  ],
  exports:[
    AddNewComponent,
    EditReplyComponent,
    PostComponent,
    PostDropdownComponent,
    ReplyComponent,
    UserAvatarComponent,
    UserCommentAvatarComponent,
    MatExpansionModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    AllPipesModule,
    MatExpansionModule,
    ImageModule,
    DialogModule,
    DragDropModule,
    PortfolioComponent,
  ]
})
export class SharedModule { }
