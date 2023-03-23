import { TestBed } from '@angular/core/testing';

import { OnmobileGuard } from './onmobile.guard';

describe('OnmobileGuard', () => {
  let guard: OnmobileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnmobileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
