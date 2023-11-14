import { TestBed } from '@angular/core/testing';

import { PosteCreneauService } from './poste-creneau.service';

describe('PosteCreneauService', () => {
  let service: PosteCreneauService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosteCreneauService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
