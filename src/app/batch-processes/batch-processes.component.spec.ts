import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchProcessesComponent } from './batch-processes.component';

describe('BatchProcessesComponent', () => {
  let component: BatchProcessesComponent;
  let fixture: ComponentFixture<BatchProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchProcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
