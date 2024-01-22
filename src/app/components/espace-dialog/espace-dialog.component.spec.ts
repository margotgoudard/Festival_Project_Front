import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceDialogComponent } from './espace-dialog.component';

describe('EspaceDialogComponent', () => {
  let component: EspaceDialogComponent;
  let fixture: ComponentFixture<EspaceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EspaceDialogComponent]
    });
    fixture = TestBed.createComponent(EspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
