import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestivalDialogComponent } from './festival-dialog.component';

describe('FestivalDialogComponent', () => {
  let component: FestivalDialogComponent;
  let fixture: ComponentFixture<FestivalDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FestivalDialogComponent]
    });
    fixture = TestBed.createComponent(FestivalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
