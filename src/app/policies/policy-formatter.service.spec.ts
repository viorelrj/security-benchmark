import { TestBed } from '@angular/core/testing';

import { PolicyFormatterService } from './policy-formatter.service';

describe('PolicyFormatterService', () => {
  let service: PolicyFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
