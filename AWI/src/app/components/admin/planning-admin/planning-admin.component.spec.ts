import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAdminComponent } from './planning-admin.component';

describe('PlanningAdminComponent', () => {
  let component: PlanningAdminComponent;
  let fixture: ComponentFixture<PlanningAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningAdminComponent]
    });
    fixture = TestBed.createComponent(PlanningAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
