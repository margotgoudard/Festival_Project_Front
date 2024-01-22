import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningIndividualComponent } from './planning-individual.component';

describe('PlanningIndividualComponent', () => {
  let component: PlanningIndividualComponent;
  let fixture: ComponentFixture<PlanningIndividualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningIndividualComponent]
    });
    fixture = TestBed.createComponent(PlanningIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
