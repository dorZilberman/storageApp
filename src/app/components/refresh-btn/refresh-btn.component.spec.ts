import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshBtnComponent } from './refresh-btn.component';

describe('RefreshBtnComponent', () => {
  let component: RefreshBtnComponent;
  let fixture: ComponentFixture<RefreshBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
