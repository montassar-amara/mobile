import { TestBed } from '@angular/core/testing';

import { SharesApiService } from './shares-api.service';

describe('SharesApiService', () => {
  let service: SharesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
