import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-modification-profil',
  templateUrl: './modification-profile.component.html',
  styleUrls: ['./modification-profile.component.scss']
})
export class ModificationProfileComponent {
  user: any = {}; // Déclarez un objet pour stocker les données de l'utilisateur

  constructor(private userService: UserService, private dialogRef: MatDialogRef<ModificationProfileComponent>) { }

  onSubmit() {
    // Appelez le service pour mettre à jour les informations du profil dans la base de données
    this.userService.updateUserProfile(this.user).subscribe(
      (response) => {
        // Traitement de la réponse (par exemple, affichage d'un message de succès)
        console.log('Profil mis à jour avec succès', response);
      },
      (error) => {
        // Gérez les erreurs (par exemple, affichage d'un message d'erreur)
        console.error('Erreur lors de la mise à jour du profil', error);
      }
    );

    this.dialogRef.close();
  }
}