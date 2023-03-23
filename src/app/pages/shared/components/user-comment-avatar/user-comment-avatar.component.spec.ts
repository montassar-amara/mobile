import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCommentAvatarComponent } from './user-comment-avatar.component';

describe('UserCommentAvatarComponent', () => {
  let component: UserCommentAvatarComponent;
  let fixture: ComponentFixture<UserCommentAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCommentAvatarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCommentAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
