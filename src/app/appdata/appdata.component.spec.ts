import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppdataComponent } from './appdata.component';

describe('AppdataComponent', () => {
  let component: AppdataComponent;
  let fixture: ComponentFixture<AppdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
