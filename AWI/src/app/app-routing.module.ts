import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlanningComponent } from './components/planning/planning.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { AnimationJeuPlanningComponent } from './components/planning/animation-jeu-planning/animation-jeu-planning.component';
import { PlanningIndividualComponent } from './components/planning/planning-individual/planning-individual.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'user-profile/:id', // You can define a route parameter like ':id' to pass the user's ID
    component: ProfileComponent,
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'planning', component: PlanningComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'animation-jeu-planning', component: AnimationJeuPlanningComponent},
  { path: 'planning-individual', component: PlanningIndividualComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
