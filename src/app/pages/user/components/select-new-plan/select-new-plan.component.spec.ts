import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNewPlanComponent } from './select-new-plan.component';

describe('SelectNewPlanComponent', () => {
  let component: SelectNewPlanComponent;
  let fixture: ComponentFixture<SelectNewPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectNewPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectNewPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
