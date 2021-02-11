import { TestBed } from '@angular/core/testing';

import { NewDataService } from './new-data.service';

describe('NewDataService', () => {
  let service: NewDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
