import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderNewComponent } from './vender-new.component';

describe('VenderNewComponent', () => {
  let component: VenderNewComponent;
  let fixture: ComponentFixture<VenderNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenderNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
