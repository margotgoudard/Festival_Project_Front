import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { PlanningComponent } from '../planning.component';
import { Espace } from 'src/app/interfaces/espace.interface';
import { HttpClient } from '@angular/common/http';
import { PlanningItem } from 'src/app/interfaces/planning-item.interface';

@Component({
  selector: 'app-animation-jeu-planning',
  templateUrl: './animation-jeu-planning.component.html',
  styleUrls: ['./animation-jeu-planning.component.scss']
})
export class AnimationJeuPlanningComponent {
  @Input() espaces: Espace[] = [];
  @Input() creneaux: Creneau[] = [];

  // Convert espaces array to MatTableDataSource<PlanningItem>
  espacesDataSource!: MatTableDataSource<PlanningItem>;

  constructor(private http: HttpClient) {}

    
  }

  