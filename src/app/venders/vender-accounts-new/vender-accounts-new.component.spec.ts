import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderAccountsNewComponent } from './vender-accounts-new.component';

describe('VenderAccountsNewComponent', () => {
  let component: VenderAccountsNewComponent;
  let fixture: ComponentFixture<VenderAccountsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenderAccountsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenderAccountsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
