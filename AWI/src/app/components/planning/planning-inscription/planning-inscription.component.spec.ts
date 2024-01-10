import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningInscriptionComponent } from './planning-inscription.component';

describe('PlanningInscriptionComponent', () => {
  let component: PlanningInscriptionComponent;
  let fixture: ComponentFixture<PlanningInscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningInscriptionComponent]
    });
    fixture = TestBed.createComponent(PlanningInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
