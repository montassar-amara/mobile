import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCompanyScenarioComponent } from './select-company-scenario.component';

describe('SelectCompanyScenarioComponent', () => {
  let component: SelectCompanyScenarioComponent;
  let fixture: ComponentFixture<SelectCompanyScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCompanyScenarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCompanyScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
