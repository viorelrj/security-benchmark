import { TestBed } from '@angular/core/testing';

import { AuditorService } from './auditor.service';

describe('AuditorService', () => {
  let service: AuditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
