import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPlanScenarioComponent } from './select-plan-scenario.component';

describe('SelectPlanScenarioComponent', () => {
  let component: SelectPlanScenarioComponent;
  let fixture: ComponentFixture<SelectPlanScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPlanScenarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPlanScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
