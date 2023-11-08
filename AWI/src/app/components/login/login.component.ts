import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String = '';

  constructor(private formBuilder: FormBuilder, ) { // private authService: AuthService, private router: Router mettre dans le constructeur
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      /*this.authService.login(username, password).subscribe(
          (response) => {
            // Connexion réussie, stockez le token JWT côté client (exemple hypothétique)
            const jwtToken = response.token;
        
            // Vous pouvez stocker le token JWT dans le local storage ou un cookie
            localStorage.setItem('jwtToken', jwtToken);
        
            // Redirection vers la page d'accueil ou une autre action souhaitée
            // Exemple de redirection vers la page du profil utilisateur :
            this.router.navigate(['/profile']); 
        
            // Autres actions à exécuter après une connexion réussie
          },
          (error) => {
            // Erreurs d'authentification
            const errorMessage = "Échec de la connexion. Vérifiez vos informations d'identification.";
        
            // Affichez un message d'erreur à l'utilisateur, par exemple en utilisant une variable d'erreur dans le template HTML
            this.errorMessage = errorMessage;
        
            // Vous pouvez également réinitialiser le formulaire si vous le souhaitez
            this.loginForm.reset();
        
            // Autres actions à exécuter en cas d'échec de connexion
          }
        );
    }*/
  }
} 
}