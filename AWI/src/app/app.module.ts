import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { ModificationProfileComponent } from './components/modification-profile/modification-profile.component';
import { PlanningComponent } from './components/planning/planning.component';
import { MockAuthService } from './mocks/auth.service.mock';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MockUserService } from './mocks/user.service.mock';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { PosteDetailsComponent } from './components/poste-details/poste-details.component';
import { MatIconModule } from '@angular/material/icon';
import { AnimationJeuPlanningComponent } from './components/planning/animation-jeu-planning/animation-jeu-planning.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { PlanningIndividualComponent } from './components/planning/planning-individual/planning-individual.component';
import { PlanningInscriptionComponent } from './components/planning/planning-inscription/planning-inscription.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ModificationProfileComponent,
    PlanningComponent,
    InscriptionComponent,
    PosteDetailsComponent,
    AnimationJeuPlanningComponent,
    RegistrationComponent,
    NavigationComponent,
    PlanningIndividualComponent,
    PlanningInscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  providers: [
    MockAuthService,
    AuthService,
    UserService,
    MockUserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
