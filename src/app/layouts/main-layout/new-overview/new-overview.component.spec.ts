import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOverviewComponent } from './new-overview.component';

describe('NewOverviewComponent', () => {
  let component: NewOverviewComponent;
  let fixture: ComponentFixture<NewOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
