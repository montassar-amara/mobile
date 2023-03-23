import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNewPlanScenarioComponent } from './select-new-plan-scenario.component';

describe('SelectNewPlanScenarioComponent', () => {
  let component: SelectNewPlanScenarioComponent;
  let fixture: ComponentFixture<SelectNewPlanScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectNewPlanScenarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectNewPlanScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
