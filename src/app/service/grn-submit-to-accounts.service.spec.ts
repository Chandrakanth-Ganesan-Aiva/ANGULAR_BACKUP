import { TestBed } from '@angular/core/testing';

import { GrnSubmitToAccountsService } from './grn-submit-to-accounts.service';

describe('GrnSubmitToAccountsService', () => {
  let service: GrnSubmitToAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnSubmitToAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
