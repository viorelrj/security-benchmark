import { TestBed } from '@angular/core/testing';

import { PerlRegexService } from './perl-regex.service';

describe('PerlRegexService', () => {
  let service: PerlRegexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerlRegexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
