import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalWidgetComponent } from './historical-widget.component';

describe('HistoricalWidgetComponent', () => {
  let component: HistoricalWidgetComponent;
  let fixture: ComponentFixture<HistoricalWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
