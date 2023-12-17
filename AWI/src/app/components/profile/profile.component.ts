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
  email: string = '';
  associations: string[] = [];
  pseudo: string = '';
  taille: string = '';
  vegetarian: boolean = false;

    constructor(private route: ActivatedRoute, private userService: UserService, private dialog: MatDialog, private router: Router) { 
    
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Récupérez l'ID de l'utilisateur depuis les paramètres de l'URL
      const userId = params['id'];
      
      // Utilisez le service UserService pour récupérer les données de l'utilisateur par son ID
      this.userService.getUserById(userId).subscribe(
        (data: User) => {
          // Mettez à jour les données de l'utilisateur dans le composant
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

  redirectToPlanning(): void {
    // Ici, vous pouvez utiliser le router pour naviguer vers la page du planning.
    this.router.navigate(['/planning']); // Assurez-vous d'ajuster la route en fonction de votre configuration de routes.
  }

}