import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSpecialCompanyComponent } from './select-special-company.component';

describe('SelectSpecialCompanyComponent', () => {
  let component: SelectSpecialCompanyComponent;
  let fixture: ComponentFixture<SelectSpecialCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSpecialCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSpecialCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
