import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSalDetailsComponent } from './new-sal-details.component';

describe('NewSalDetailsComponent', () => {
  let component: NewSalDetailsComponent;
  let fixture: ComponentFixture<NewSalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
