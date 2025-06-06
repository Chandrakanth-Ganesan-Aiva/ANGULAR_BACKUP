import { TestBed } from '@angular/core/testing';

import { SuppliergstService } from './suppliergst.service';

describe('SuppliergstService', () => {
  let service: SuppliergstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuppliergstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
