import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = new User(); // Initialisez l'utilisateur avec des données par défaut, ou laissez-le vide.
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Récupérez l'ID de l'utilisateur depuis les paramètres de l'URL
      const userId = params['id'];
      
      // Utilisez le service UserService pour récupérer les données de l'utilisateur par son ID
      this.userService.getUserById(userId).subscribe(
        (userData: User) => {
          // Mettez à jour les données de l'utilisateur dans le composant
          this.user = userData;
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
          console.error(error);
        }
      );
    });
  }

  navigateToModificationProfile() {
    // Utilisez le routeur Angular pour naviguer vers le composant ModificationProfile
    this.router.navigate(['/modification-profile']);
  }

}