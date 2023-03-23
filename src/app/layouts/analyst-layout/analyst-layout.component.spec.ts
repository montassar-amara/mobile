import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystLayoutComponent } from './analyst-layout.component';

describe('AnalystLayoutComponent', () => {
  let component: AnalystLayoutComponent;
  let fixture: ComponentFixture<AnalystLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
