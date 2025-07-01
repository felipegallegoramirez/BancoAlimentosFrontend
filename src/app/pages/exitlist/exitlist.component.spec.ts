import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitlistComponent } from './exitlist.component';

describe('ExitlistComponent', () => {
  let component: ExitlistComponent;
  let fixture: ComponentFixture<ExitlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExitlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
