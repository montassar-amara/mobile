import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationWidgetComponent } from './valuation-widget.component';

describe('ValuationWidgetComponent', () => {
  let component: ValuationWidgetComponent;
  let fixture: ComponentFixture<ValuationWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuationWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
