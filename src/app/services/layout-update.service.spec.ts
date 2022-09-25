import { TestBed } from '@angular/core/testing';

import { LayoutUpdateService } from './layout-update.service';

describe('LayoutUpdateService', () => {
  let service: LayoutUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
