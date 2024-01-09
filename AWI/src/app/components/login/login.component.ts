import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';
import { RegistrationPopupService } from 'src/app/services/registration-popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String = '';
  userRole: number = 0; 


  constructor(private userService: UserService, private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private registrationPopupService: RegistrationPopupService) {
    this.loginForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { pseudo, password } = this.loginForm.value;
  
      this.authService.login(pseudo, password).subscribe(
        (response) => {
          console.log(response);

          if (response.token) {
            localStorage.setItem('jwtToken', response.token);
            this.authService.setLoggedInUserPseudo(pseudo);
            console.log("pseudo", pseudo)
            this.userService.getUserRole(pseudo).subscribe((userRoleObject: any) => {
              this.userRole = userRoleObject.firstRoleId;})
              if (this.userRole == 2 || this.userRole == 3) {
                  this.router.navigate(['/planning-individual']);
              }
              else this.router.navigate(['/planning-general'])
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