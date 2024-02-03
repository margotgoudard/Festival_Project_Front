import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeHebergementsComponent } from './liste-hebergements.component';

describe('ListeHebergementsComponent', () => {
  let component: ListeHebergementsComponent;
  let fixture: ComponentFixture<ListeHebergementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeHebergementsComponent]
    });
    fixture = TestBed.createComponent(ListeHebergementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
