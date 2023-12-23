// registration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  submitted: boolean = false;

  constructor(private authService: AuthService ,private dialogRef: MatDialogRef<RegistrationComponent>, private formBuilder: FormBuilder) {
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
      // If the form is valid, you can send the data to your backend service
      const formData = this.registrationForm.value;
      
      // Assuming you have a method in your API service to handle registration
      console.log(formData)
      this.authService.register(formData).subscribe(
        (response) => {
          // Handle successful registration response
          console.log('Registration successful:', response);
        },
        (error) => {
          // Handle registration error
          console.error('Registration error:', error);
        }
      );
    } else {
      // Mark form fields as touched to display validation errors
      this.registrationForm.markAllAsTouched();
    }
  }
}