import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFileComponent } from './current-file.component';

describe('CurrentFileComponent', () => {
  let component: CurrentFileComponent;
  let fixture: ComponentFixture<CurrentFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
