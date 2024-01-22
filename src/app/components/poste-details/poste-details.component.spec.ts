import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteDetailsComponent } from './poste-details.component';

describe('PosteDetailsComponent', () => {
  let component: PosteDetailsComponent;
  let fixture: ComponentFixture<PosteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosteDetailsComponent]
    });
    fixture = TestBed.createComponent(PosteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
