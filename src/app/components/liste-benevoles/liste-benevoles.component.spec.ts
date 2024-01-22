import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBenevolesComponent } from './liste-benevoles.component';

describe('ListeBenevolesComponent', () => {
  let component: ListeBenevolesComponent;
  let fixture: ComponentFixture<ListeBenevolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeBenevolesComponent]
    });
    fixture = TestBed.createComponent(ListeBenevolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
