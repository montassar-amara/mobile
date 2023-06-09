import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDropdownComponent } from './post-dropdown.component';

describe('PostDropdownComponent', () => {
  let component: PostDropdownComponent;
  let fixture: ComponentFixture<PostDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
