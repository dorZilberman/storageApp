import { TestBed } from '@angular/core/testing';

import { PostgresService } from './postgres.service';

describe('PostgresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostgresService = TestBed.get(PostgresService);
    expect(service).toBeTruthy();
  });
});
