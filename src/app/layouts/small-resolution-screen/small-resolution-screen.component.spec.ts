import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallResolutionScreenComponent } from './small-resolution-screen.component';

describe('SmallResolutionScreenComponent', () => {
  let component: SmallResolutionScreenComponent;
  let fixture: ComponentFixture<SmallResolutionScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallResolutionScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallResolutionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
