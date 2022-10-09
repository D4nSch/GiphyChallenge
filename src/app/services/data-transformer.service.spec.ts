import { TestBed } from '@angular/core/testing';

import { DataTransformerService } from './data-transformer.service';

describe('DataTransformerService', () => {
  let service: DataTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
