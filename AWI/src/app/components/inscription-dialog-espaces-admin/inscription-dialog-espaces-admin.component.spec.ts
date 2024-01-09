import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionDialogEspacesAdminComponent } from './inscription-dialog-espaces-admin.component';

describe('InscriptionDialogEspacesAdminComponent', () => {
  let component: InscriptionDialogEspacesAdminComponent;
  let fixture: ComponentFixture<InscriptionDialogEspacesAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionDialogEspacesAdminComponent]
    });
    fixture = TestBed.createComponent(InscriptionDialogEspacesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
