import { TestBed } from '@angular/core/testing';

import { StackVertDataService } from './stack-vert-data.service';

describe('StackVertDataService', () => {
  let service: StackVertDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackVertDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
