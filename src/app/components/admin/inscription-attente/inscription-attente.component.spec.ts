import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionAttenteComponent } from './inscription-attente.component';

describe('InscriptionAttenteComponent', () => {
  let component: InscriptionAttenteComponent;
  let fixture: ComponentFixture<InscriptionAttenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionAttenteComponent]
    });
    fixture = TestBed.createComponent(InscriptionAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
