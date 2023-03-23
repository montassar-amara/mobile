import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystHeaderComponent } from './analyst-header.component';

describe('AnalystHeaderComponent', () => {
  let component: AnalystHeaderComponent;
  let fixture: ComponentFixture<AnalystHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
