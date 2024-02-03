import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogementDialogComponent } from './add-logement-dialog.component';

describe('AddLogementDialogComponent', () => {
  let component: AddLogementDialogComponent;
  let fixture: ComponentFixture<AddLogementDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLogementDialogComponent]
    });
    fixture = TestBed.createComponent(AddLogementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
