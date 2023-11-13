// registration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  submitted: boolean = false;

  constructor(private dialogRef: MatDialogRef<RegistrationComponent>, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      pseudo: [''], // Add other registration form fields with default validations
      associations: [''],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      tailleTShirt: [''],
      isVegetarian: [false],
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
    this.submitted = true;

    if (this.registrationForm.valid) {
      const userData: User = {
        role: 'benevole', // Set the default role to 'benevole'
        ...this.registrationForm.value,
      };

      // Close the dialog and pass the user data as the result
      this.dialogRef.close(userData);
    }
  }

  // ...
}