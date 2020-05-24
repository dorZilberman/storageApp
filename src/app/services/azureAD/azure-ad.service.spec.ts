import { TestBed } from '@angular/core/testing';

import { userService } from './azure-ad.service';

describe('AzureADService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: userService = TestBed.get(userService);
    expect(service).toBeTruthy();
  });
});
