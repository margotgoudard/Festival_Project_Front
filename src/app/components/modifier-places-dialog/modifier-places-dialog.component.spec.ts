import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPlacesDialogComponent } from './modifier-places-dialog.component';

describe('ModifierPlacesDialogComponent', () => {
  let component: ModifierPlacesDialogComponent;
  let fixture: ComponentFixture<ModifierPlacesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierPlacesDialogComponent]
    });
    fixture = TestBed.createComponent(ModifierPlacesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
