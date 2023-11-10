import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PlanningComponent } from './components/planning/planning.component';
import { InscriptionComponent } from './components/inscription/inscription.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'user-profile/:id', // You can define a route parameter like ':id' to pass the user's ID
    component: ProfileComponent,
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'planning', component: PlanningComponent },
  { path: 'inscription', component: InscriptionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
