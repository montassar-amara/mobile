import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailUpgradeComponent } from './payment-detail-upgrade.component';

describe('PaymentDetailUpgradeComponent', () => {
  let component: PaymentDetailUpgradeComponent;
  let fixture: ComponentFixture<PaymentDetailUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDetailUpgradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDetailUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
