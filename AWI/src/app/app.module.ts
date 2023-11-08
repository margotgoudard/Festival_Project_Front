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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ModificationProfileComponent,
    PlanningComponent,
    InscriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
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
