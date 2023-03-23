import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryCompaniesComponent } from './temporary-companies.component';

describe('TemporaryCompaniesComponent', () => {
  let component: TemporaryCompaniesComponent;
  let fixture: ComponentFixture<TemporaryCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporaryCompaniesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
