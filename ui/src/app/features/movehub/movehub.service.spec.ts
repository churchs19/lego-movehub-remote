import { TestBed, inject } from '@angular/core/testing';

import { MovehubService } from './movehub.service';

describe('MovehubService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovehubService]
    });
  });

  it('should be created', inject([MovehubService], (service: MovehubService) => {
    expect(service).toBeTruthy();
  }));
});
