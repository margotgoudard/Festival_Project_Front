import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationJeuPlanningComponent } from './animation-jeu-planning.component';

describe('AnimationJeuPlanningComponent', () => {
  let component: AnimationJeuPlanningComponent;
  let fixture: ComponentFixture<AnimationJeuPlanningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimationJeuPlanningComponent]
    });
    fixture = TestBed.createComponent(AnimationJeuPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
