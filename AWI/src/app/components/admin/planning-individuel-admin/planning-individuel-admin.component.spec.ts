import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningIndividuelAdminComponent } from './planning-individuel-admin.component';

describe('PlanningIndividuelAdminComponent', () => {
  let component: PlanningIndividuelAdminComponent;
  let fixture: ComponentFixture<PlanningIndividuelAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningIndividuelAdminComponent]
    });
    fixture = TestBed.createComponent(PlanningIndividuelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
