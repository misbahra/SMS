import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuhNewComponent } from './luh-new.component';

describe('LuhNewComponent', () => {
  let component: LuhNewComponent;
  let fixture: ComponentFixture<LuhNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuhNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuhNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
