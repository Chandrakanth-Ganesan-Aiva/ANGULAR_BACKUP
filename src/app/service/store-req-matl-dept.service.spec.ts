import { TestBed } from '@angular/core/testing';

import { StoreReqMatlDeptService } from './store-req-matl-dept.service';

describe('StoreReqMatlDeptService', () => {
  let service: StoreReqMatlDeptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreReqMatlDeptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
