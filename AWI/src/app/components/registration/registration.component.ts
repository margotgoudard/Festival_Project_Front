// registration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { InscriptionComponent } from '../inscription/inscription.component';
import { InscriptionReussiDialogComponent } from '../inscription-reussi-dialog/inscription-reussi-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  submitted: boolean = false;
  registrationSuccess: boolean = false;
  errorMessage: string = '';

  constructor( private dialog: MatDialog ,private authService: AuthService ,private dialogRef: MatDialogRef<RegistrationComponent>, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      pseudo: ['', Validators.required],
      associations: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Valider le numéro de téléphone
      chercheLogement: [false], // Ajouter le champ manquant
      taille: ['', Validators.required],
      vegetarian: [false],
      photoDeProfil: [''],
    });
  }

  ngOnInit() {
    // You can perform additional initialization tasks here if needed
  }

  // Helper method to check for field validity and display errors
  isFieldInvalid(field: string) {
    return this.registrationForm.get(field)?.invalid && (this.registrationForm.get(field)?.touched || this.submitted);
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
  
      this.authService.register(formData).subscribe(
        (response) => {
          // Handle successful registration response
          this.registrationSuccess = true;
  
          // Ouvre la popup avec le message d'inscription réussie
          const dialogRef = this.dialog.open(InscriptionReussiDialogComponent, {
            width: '300px', // Définissez la largeur souhaitée
            data: { message: 'Inscription réussie, veuillez vous connecter.' },
          });
  
          // Ferme la fenêtre d'inscription
          this.dialogRef.close();
        },
        (error) => {
          // Handle registration error
          if (error.status === 409) {
            this.errorMessage = 'Pseudo, email, or phone number already in use. Please choose different credentials.';
          } else {
            this.errorMessage = 'Le pseudo, email ou numéro de téléphone est déjà utilisé. Veuillez recommencer.';
          }
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}