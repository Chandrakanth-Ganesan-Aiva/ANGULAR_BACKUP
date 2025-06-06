import { TestBed } from '@angular/core/testing';

import { SupplierregService } from './supplierreg.service';

describe('SupplierregService', () => {
  let service: SupplierregService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierregService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
