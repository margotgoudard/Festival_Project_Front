import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { ModificationProfileComponent } from '../modification-profile/modification-profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';

  nom: string = '';
  prenom: string = '';
  mail: string = '';
  associations: string[] = [];
  pseudo: string = '';
  tailleTShirt: string = '';
  isVegetarian: boolean = false;

  user: User = new User(); // Initialisez l'utilisateur avec des données par défaut, ou laissez-le vide.

  constructor(private route: ActivatedRoute, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Récupérez l'ID de l'utilisateur depuis les paramètres de l'URL
      const userId = params['id'];
      
      // Utilisez le service UserService pour récupérer les données de l'utilisateur par son ID
      this.userService.getUserById(userId).subscribe(
        (data: User) => {
          // Mettez à jour les données de l'utilisateur dans le composant
          this.user = data;
          this.nom = data.nom;
          this.prenom = data.prenom;
          this.mail = data.mail;
          this.associations = data.associations;
          this.pseudo = data.pseudo;
          this.tailleTShirt = data.tailleTShirt;
          this.isVegetarian = data.isVegetarian;
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
          console.error(error);
        }
      );
    });
  }

  navigateToModificationProfile(): void {
    const dialogRef = this.dialog.open(ModificationProfileComponent, {
      width: '400px', // Définissez la largeur de la modale en fonction de vos besoins
    });
  
    // Gérez les événements de fermeture de la modale si nécessaire
    dialogRef.afterClosed().subscribe(result => {
      console.log('La modale a été fermée', result);
    });
  }

}