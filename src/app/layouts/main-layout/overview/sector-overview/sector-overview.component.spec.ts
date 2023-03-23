import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorOverviewComponent } from './sector-overview.component';

describe('SectorOverviewComponent', () => {
  let component: SectorOverviewComponent;
  let fixture: ComponentFixture<SectorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
