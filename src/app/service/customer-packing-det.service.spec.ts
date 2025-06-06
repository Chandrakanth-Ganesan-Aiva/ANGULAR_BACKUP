import { TestBed } from '@angular/core/testing';

import { CustomerPackingDetService } from './customer-packing-det.service';

describe('CustomerPackingDetService', () => {
  let service: CustomerPackingDetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerPackingDetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
