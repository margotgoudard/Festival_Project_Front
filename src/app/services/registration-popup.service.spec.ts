import { TestBed } from '@angular/core/testing';

import { RegistrationPopupService } from './registration-popup.service';

describe('RegistrationPopupService', () => {
  let service: RegistrationPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
