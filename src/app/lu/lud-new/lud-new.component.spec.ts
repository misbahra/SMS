import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LudNewComponent } from './lud-new.component';

describe('LudNewComponent', () => {
  let component: LudNewComponent;
  let fixture: ComponentFixture<LudNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LudNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LudNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
