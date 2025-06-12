import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsalertComponent } from './logsalert.component';

describe('LogsalertComponent', () => {
  let component: LogsalertComponent;
  let fixture: ComponentFixture<LogsalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsalertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
