import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyImportComponent } from './policy-import.component';

describe('PolicyImportComponent', () => {
  let component: PolicyImportComponent;
  let fixture: ComponentFixture<PolicyImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
