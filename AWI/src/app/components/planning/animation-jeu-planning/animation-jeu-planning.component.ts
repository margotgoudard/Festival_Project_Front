import { Component, Input } from '@angular/core';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { PlanningComponent } from '../planning.component';

@Component({
  selector: 'app-animation-jeu-planning',
  templateUrl: './animation-jeu-planning.component.html',
  styleUrls: ['./animation-jeu-planning.component.scss']
})
export class AnimationJeuPlanningComponent extends PlanningComponent {

}