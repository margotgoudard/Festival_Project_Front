import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionReussiDialogComponent } from './inscription-reussi-dialog.component';

describe('InscriptionReussiDialogComponent', () => {
  let component: InscriptionReussiDialogComponent;
  let fixture: ComponentFixture<InscriptionReussiDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionReussiDialogComponent]
    });
    fixture = TestBed.createComponent(InscriptionReussiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
