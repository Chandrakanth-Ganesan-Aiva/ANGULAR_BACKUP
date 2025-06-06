import { TestBed } from '@angular/core/testing';

import { GrnprintService } from './grnprint.service';

describe('GrnprintService', () => {
  let service: GrnprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
