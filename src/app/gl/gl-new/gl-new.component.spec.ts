import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlNewComponent } from './gl-new.component';

describe('GlNewComponent', () => {
  let component: GlNewComponent;
  let fixture: ComponentFixture<GlNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
