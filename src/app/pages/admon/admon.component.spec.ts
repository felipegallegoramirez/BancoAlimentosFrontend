import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmonComponent } from './admon.component';

describe('AdmonComponent', () => {
  let component: AdmonComponent;
  let fixture: ComponentFixture<AdmonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
