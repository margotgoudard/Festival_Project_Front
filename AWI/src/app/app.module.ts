import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { ModificationProfileComponent } from './components/modification-profile/modification-profile.component';
import { PlanningComponent } from './components/planning/planning.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { PosteDetailsComponent } from './components/poste-details/poste-details.component';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationComponent } from './components/registration/registration.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { PlanningIndividualComponent } from './components/edt/planning-individual/planning-individual.component';
import { ModifyDialogComponent } from './components/modify-dialog/modify-dialog.component';
import { PosteDialogComponent } from './components/poste-dialog/poste-dialog.component';
import { CreneauDialogComponent } from './components/creneau-dialog/creneau-dialog.component';
import { PlanningGeneralComponent } from './components/admin/planning-general/planning-general.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { MatSortModule } from '@angular/material/sort';
import { RegistrationPopupService } from './services/registration-popup.service';
import { InscriptionReussiDialogComponent } from './components/inscription-reussi-dialog/inscription-reussi-dialog.component';
import { InscriptionService } from './services/inscription.service';
import { InscriptionDialogEspacesComponent } from './components/inscription-dialog-espaces/inscription-dialog-espaces.component';
import { PlanningIndividuelAdminComponent } from './components/admin/planning-individuel-admin/planning-individuel-admin.component';
import { PlanningAdminComponent } from './components/admin/planning-admin/planning-admin.component';
import { InscriptionAdminComponent } from './components/admin/inscription-admin/inscription-admin.component';
import { InscriptionDialogEspacesAdminComponent } from './components/admin/inscription-dialog-espaces-admin/inscription-dialog-espaces-admin.component';
import { EspaceDialogComponent } from './components/espace-dialog/espace-dialog.component';
import { ModifierPlacesDialogComponent } from './components/modifier-places-dialog/modifier-places-dialog.component';
import { ListeBenevolesComponent } from './components/liste-benevoles/liste-benevoles.component';
import { InscriptionAttenteComponent } from './components/admin/inscription-attente/inscription-attente.component';
import { InscriptionAttenteBenevoleComponent } from './components/inscription-attente-benevole/inscription-attente-benevole.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ModificationProfileComponent,
    PlanningComponent,
    InscriptionComponent,
    PosteDetailsComponent,
    RegistrationComponent,
    NavigationComponent,
    PlanningIndividualComponent,
    ModifyDialogComponent,
    PosteDialogComponent,
    CreneauDialogComponent,
    PlanningGeneralComponent,
    InscriptionReussiDialogComponent,
    InscriptionDialogEspacesComponent,
    PlanningIndividuelAdminComponent,
    PlanningAdminComponent,
    InscriptionAdminComponent,
    InscriptionDialogEspacesAdminComponent,
    EspaceDialogComponent,
    ModifierPlacesDialogComponent,
    ListeBenevolesComponent,
    InscriptionAttenteComponent,
    InscriptionAttenteBenevoleComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatSortModule
  ],
  providers: [
    AuthService,
    UserService,
    InscriptionService,
    RegistrationPopupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
