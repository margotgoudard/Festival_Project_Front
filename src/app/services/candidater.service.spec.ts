import { TestBed } from '@angular/core/testing';

import { CandidaterService } from './candidater.service';

describe('CandidaterService', () => {
  let service: CandidaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
