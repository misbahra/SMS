import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuComponent } from './lu.component';

describe('LuComponent', () => {
  let component: LuComponent;
  let fixture: ComponentFixture<LuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
