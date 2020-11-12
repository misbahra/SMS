import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSalComponent } from './new-sal.component';

describe('NewSalComponent', () => {
  let component: NewSalComponent;
  let fixture: ComponentFixture<NewSalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
