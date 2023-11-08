import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { ModificationProfileComponent } from '../modification-profile/modification-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MockUserService } from 'src/app/mocks/user.service.mock';
import { MockAuthService } from 'src/app/mocks/auth.service.mock';

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

  user: User | null = null;

    constructor(private route: ActivatedRoute, private userService: MockUserService, private dialog: MatDialog, private authService: MockAuthService) { 
    
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Récupérez l'ID de l'utilisateur depuis les paramètres de l'URL
      const userId = this.authService.getLoggedInUserId();
      
      // Utilisez le service UserService pour récupérer les données de l'utilisateur par son ID
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (data: User) => {
            this.user = data;
          },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
          console.error(error);
        }
      );
      }
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