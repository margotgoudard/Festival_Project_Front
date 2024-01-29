import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningInscriptionZoneComponent } from './planning-inscription-zone.component';

describe('PlanningInscriptionZoneComponent', () => {
  let component: PlanningInscriptionZoneComponent;
  let fixture: ComponentFixture<PlanningInscriptionZoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningInscriptionZoneComponent]
    });
    fixture = TestBed.createComponent(PlanningInscriptionZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
