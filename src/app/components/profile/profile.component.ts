import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { ModificationProfileComponent } from '../modification-profile/modification-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Festival } from 'src/app/interfaces/festival.interface';
import { FormsModule } from '@angular/forms';
import { Role } from 'src/app/model/role.model';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  isNomEditMode: boolean = false;
  isPrenomEditMode: boolean = false;
  isEditMode: boolean = false;
  isEmailEditMode: boolean = false;
  isAssociationEditMode: boolean = false;
  isTailleEditMode: boolean = false;




  nom: string = '';
  prenom: string = '';
  email: string = '';
  associations: string = '';
  pseudo: string = '';
  password: string = '';
  taille: string = '';
  numTel: number = 0;
  chercheLogement: boolean = false;
  photoDeProfil:string = '';
  vegetarian: boolean = false;
  role: number = 0;
  roleUser: number = 0;
  festivals: Number[] = [];


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    const loggedInPseudo = this.authService.getLoggedInUserPseudo() ?? '';
    this.userService.getUserRole(loggedInPseudo).subscribe((userRoleObject: any) => {
      this.role = userRoleObject.firstRoleId;
      },
      (error) => {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur', error);
      }
    );
    this.route.params.subscribe((params) => {
      const requestedPseudo = params['pseudo']; // Get the username from the route params

      if (requestedPseudo) {
        // If a username is provided, fetch and display the profile for that user
        this.userService.getUserByPseudo(requestedPseudo).subscribe((data: User) => {
            this.updateLocalProfileFields(data);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
            console.error(error);
          }
        );
        this.userService.getUserRole(requestedPseudo).subscribe((userRoleObject: any) => {
          this.roleUser = userRoleObject.firstRoleId;
          },
          (error) => {
            console.error('Erreur lors de la récupération du rôle de l\'utilisateur', error);
          }
        );
        this.userService.getUserFestivals(requestedPseudo).subscribe(
          (festivalsResponse: any) => {
            // Assuming festivalsResponse is an array of festivals with 'annee' property
            this.festivals = festivalsResponse.map((festival: any) => festival.annee);
          },
          (error) => {
            console.error('Erreur lors de la récupération des festivals de l\'utilisateur', error);
          }
        );
      } else {
        this.userService.getUserByPseudo(loggedInPseudo).subscribe(
          (data: User) => {
            this.updateLocalProfileFields(data);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la récupération des données de l\'utilisateur.';
            console.error(error);
          }
        );
        this.userService.getUserRole(loggedInPseudo).subscribe((userRoleObject: any) => {
          this.roleUser = userRoleObject.firstRoleId;
          },
          (error) => {
            console.error('Erreur lors de la récupération du rôle de l\'utilisateur', error);
          }
        );
        this.userService.getUserFestivals(loggedInPseudo).subscribe(
          (festiavelResponse: { festivals: Festival[] } | any) => {
            if (festiavelResponse && Array.isArray(festiavelResponse.festivals)) {
              this.festivals = festiavelResponse.festivals.map((festival: Festival) => festival.annee);
            } else {
              console.error('Invalid response format. Expected an object with a property "festivals" that is an array.');
            }
          },
          (error) => {
            console.error('Erreur lors de la récupération des festivals de l\'utilisateur', error);
          }
        );
      }
    });
  }

  updateLocalProfileFields(data: User): void {
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.email = data.email;
    this.associations = data.associations;
    this.pseudo = data.pseudo;
    this.taille = data.taille;
    this.vegetarian = data.vegetarian;
    this.password = data.password;
    this.numTel = data.numTel;
    this.chercheLogement = data.chercheLogement;
    this.photoDeProfil = data.photoDeProfil;
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

  updateUserRoleReferent() {
    // Vous pouvez appeler la méthode du userService pour mettre à jour le rôle
    this.userService.updateRoleReferent(this.pseudo).subscribe(
      (response) => {
        console.log('Rôle de l\'utilisateur mis à jour avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur', error);
      }
    );
  }

  updateUserRoleGestionnaire() {
    // Vous pouvez appeler la méthode du userService pour mettre à jour le rôle
    this.userService.updateRoleGestionnaire(this.pseudo).subscribe(
      (response) => {
        console.log('Rôle de l\'utilisateur mis à jour avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur', error);
      }
    );
  }

  onCheckboxChange(event: any): void {
    if (event.target.checked) {
      this.updateUserRoleReferent(); // Appel à la méthode correspondant à la mise à jour du rôle
      this.roleUser = 3; // Mettez à jour roleUser selon vos besoins
    } else {
      this.NonReferentRole(); // Appel à la méthode correspondant à la mise à jour du rôle
      this.roleUser = 0; // Mettez à jour roleUser selon vos besoins
    }
  }

  NonReferentRole() {
    this.userService.nonReferentRole(this.pseudo).subscribe(
      (response) => {
        console.log('Rôle de l\'utilisateur mis à jour avec succès', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur', error);
      }
    );
  }

  toggleNomEditMode(): void {
    this.isNomEditMode = !this.isNomEditMode;
  }

  togglePrenomEditMode(): void {
    this.isPrenomEditMode = !this.isPrenomEditMode;
  }

  toggleEmailEditMode(): void {
    this.isEmailEditMode = !this.isEmailEditMode;
  }

  toggleAssociationEditMode(): void {
    this.isAssociationEditMode = !this.isAssociationEditMode;
  }

  toggleTailleEditMode(): void {
    this.isTailleEditMode = !this.isTailleEditMode;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.toggleNomEditMode(); 
    this.togglePrenomEditMode();
    this.toggleEmailEditMode();
    this.toggleAssociationEditMode();
    this.toggleTailleEditMode();

  }

  onConfirmClick(): void {

    // Créez un objet avec les propriétés mises à jour
    const updatedUserData: User = new User(
      this.prenom,
      this.nom,
      this.pseudo,
      this.associations,
      this.email,
      this.password,
      this.numTel,
      this.chercheLogement,
      this.taille,
      this.vegetarian,
      this.photoDeProfil,
      new Role(this.role),
    );

    // Envoyez les données mises à jour au service pour la mise à jour
    this.userService.updateUserProfile(updatedUserData).subscribe(
      (response) => {
        console.log('Profil mis à jour avec succès', response);
        this.isEditMode = false; // Désactiver le mode d'édition après confirmation
        this.isNomEditMode = false; 
        this.isPrenomEditMode = false;
        this.isEmailEditMode = false;
        this.isAssociationEditMode = false;
        this.isTailleEditMode = false;
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil', error);
        // Gérez les erreurs si nécessaire
      }
    );
    
  }

  onCancelClick(): void {
    // Réinitialisez les valeurs éditées et désactivez le mode d'édition
    this.isEditMode = false; // Désactivez le mode d'édition après annulation
    this.isNomEditMode = false;
    this.isPrenomEditMode = false;
    this.isEmailEditMode = false;
    this.isAssociationEditMode = false;
    this.isTailleEditMode = false;
  }

  onCheckboxChangeGestionnaire(event: any): void {
    if (event.target.checked) {
      this.updateUserRoleGestionnaire(); // Appel à la méthode correspondant à la mise à jour du rôle
      this.roleUser = 4; // Mettez à jour roleUser selon vos besoins
    } else {
      this.NonGestionnaireRole(); // Appel à la méthode correspondant à la mise à jour du rôle
      this.roleUser = 0; // Mettez à jour roleUser selon vos besoins
    }
  }

NonReferentRole() {
  this.userService.nonReferentRole(this.pseudo).subscribe(
    (response) => {
      console.log('Rôle de l\'utilisateur mis à jour avec succès', response);
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur', error);
    }
  );
}

NonGestionnaireRole() {
  this.userService.nonGestionnaireRole(this.pseudo).subscribe(
    (response) => {
      console.log('Rôle de l\'utilisateur mis à jour avec succès', response);
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur', error);
    }
  );
}
}
