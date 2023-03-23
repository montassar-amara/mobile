import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsPlanComponent } from './payment-details-plan.component';

describe('PaymentDetailsPlanComponent', () => {
  let component: PaymentDetailsPlanComponent;
  let fixture: ComponentFixture<PaymentDetailsPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailsPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
