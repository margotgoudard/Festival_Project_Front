import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user: User = new User(); // Initialisez l'utilisateur avec ses données actuelles.
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService) {} // Injectez le service UserService.

  updateProfile() {
    // Appelez le service pour mettre à jour le profil de l'utilisateur.
    this.userService.updateUserProfile(this.user)
      .subscribe(
        (response) => {
          this.successMessage = 'Profil mis à jour avec succès!';
        },
        (error) => {
          this.errorMessage = 'Une erreur s\'est produite lors de la mise à jour du profil.';
        }
      );
  }
}