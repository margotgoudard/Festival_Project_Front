import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { ModificationProfileComponent } from '../modification-profile/modification-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

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
  email: string = '';
  associations: string = '';
  pseudo: string = '';
  taille: string = '';
  vegetarian: boolean = false;

    constructor(private authService: AuthService, private route: ActivatedRoute, private userService: UserService, private dialog: MatDialog, private router: Router) { 
    
  }

  ngOnInit() {
    const pseudo = this.authService.getLoggedInUserPseudo() ?? '';
    this.route.params.subscribe((params) => {
      this.userService.getUserByPseudo(pseudo).subscribe(
        (data: User) => {
          this.nom = data.nom;
          this.prenom = data.prenom;
          this.email = data.email;
          this.associations = data.associations;
          this.pseudo = data.pseudo;
          this.taille = data.taille;
          this.vegetarian = data.vegetarian;
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
          console.error(error);
        }
      );
    });
    
    this.userService.getUserAssociations(pseudo).subscribe(
      (associationsObject: any) => {
        this.associations = associationsObject.firstAssociationName;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des associations de l\'utilisateur.';
        console.error(error);
      }
    );
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