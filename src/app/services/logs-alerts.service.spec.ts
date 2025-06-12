import { TestBed } from '@angular/core/testing';

import { LogsAlertsService } from './logs-alerts.service';

describe('LogsAlertsService', () => {
  let service: LogsAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogsAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
