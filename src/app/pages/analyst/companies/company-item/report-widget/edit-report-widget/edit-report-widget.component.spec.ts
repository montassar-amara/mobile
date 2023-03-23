import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReportWidgetComponent } from './edit-report-widget.component';

describe('ReportWidgetComponent', () => {
  let component: EditReportWidgetComponent;
  let fixture: ComponentFixture<EditReportWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReportWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReportWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
