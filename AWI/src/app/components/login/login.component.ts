import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from 'src/app/mocks/auth.service.mock'; // Importez le service de mock
import { RegistrationComponent } from '../registration/registration.component';
import { RegistrationPopupService } from 'src/app/services/registration-popup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String = '';

  constructor(private formBuilder: FormBuilder, private authService: MockAuthService, private router: Router, private registrationPopupService: RegistrationPopupService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password).subscribe(
        (response) => {
          // Connexion réussie, utilisez le token JWT simulé ici.
          const jwtToken = response.token;

          // Extract user role from the JWT token payload
          const userRole = response.user.role;
  
          // Store JWT token in local storage (if available in the response)
          if (response.token) {
            localStorage.setItem('jwtToken', response.token);
          }
  
          // Redirect based on user role
          if (userRole === 'admin') {
            this.router.navigate(['/planning-inscription']);
          } else {
            this.router.navigate(['/planning-individual']);
          }
  
          // Autres actions à exécuter après une connexion réussie
        },
        (error) => {
          // Erreurs d'authentification (simulées)
          const errorMessage = 'Échec de la connexion. Vérifiez vos informations d\'identification.';
  
          // Affichez un message d'erreur à l'utilisateur, par exemple en utilisant une variable d'erreur dans le template HTML
          this.errorMessage = errorMessage;
  
          // Vous pouvez également réinitialiser le formulaire si vous le souhaitez
          this.loginForm.reset();
  
          // Autres actions à exécuter en cas d'échec de connexion
        }
      );
    }
  }

  openRegistrationPopup() {
    this.registrationPopupService.openRegistrationPopup();
  }

}