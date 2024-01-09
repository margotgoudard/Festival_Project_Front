import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlanningComponent } from './components/planning/planning.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { PlanningIndividualComponent } from './components/edt/planning-individual/planning-individual.component';
import { PlanningGeneralComponent } from './components/edt/planning-general/planning-general.component';
import { PlanningIndividuelAdminComponent } from './components/edt/planning-individuel-admin/planning-individuel-admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'user-profile/:id', // You can define a route parameter like ':id' to pass the user's ID
    component: ProfileComponent,
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'planning', component: PlanningComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'planning-individual', component: PlanningIndividualComponent },
  { path: 'planning-general', component:PlanningGeneralComponent},
  { path: 'planning-individual/:pseudo', component: PlanningIndividualComponent },
  { path: 'planning-individuel-admin/:pseudo', component: PlanningIndividuelAdminComponent },
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
