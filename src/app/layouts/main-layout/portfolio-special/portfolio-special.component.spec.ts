import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSpecialComponent } from './portfolio-special.component';

describe('PortfolioSpecialComponent', () => {
  let component: PortfolioSpecialComponent;
  let fixture: ComponentFixture<PortfolioSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioSpecialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
