import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesItemComponent } from './policies-item.component';

describe('PoliciesItemComponent', () => {
  let component: PoliciesItemComponent;
  let fixture: ComponentFixture<PoliciesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
