import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteDialogComponent } from './poste-dialog.component';

describe('PosteDialogComponent', () => {
  let component: PosteDialogComponent;
  let fixture: ComponentFixture<PosteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosteDialogComponent]
    });
    fixture = TestBed.createComponent(PosteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
