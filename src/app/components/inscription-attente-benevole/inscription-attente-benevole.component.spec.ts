import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionAttenteBenevoleComponent } from './inscription-attente-benevole.component';

describe('InscriptionAttenteBenevoleComponent', () => {
  let component: InscriptionAttenteBenevoleComponent;
  let fixture: ComponentFixture<InscriptionAttenteBenevoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionAttenteBenevoleComponent]
    });
    fixture = TestBed.createComponent(InscriptionAttenteBenevoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
