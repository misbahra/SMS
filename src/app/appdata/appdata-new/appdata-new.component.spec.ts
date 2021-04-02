import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppdataNewComponent } from './appdata-new.component';

describe('AppdataNewComponent', () => {
  let component: AppdataNewComponent;
  let fixture: ComponentFixture<AppdataNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppdataNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppdataNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
