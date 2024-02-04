// planning-individual.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CreneauDialogComponent } from '../../creneau-dialog/creneau-dialog.component';
import { PosteDialogComponent } from '../../poste-dialog/poste-dialog.component';
import { EspaceDialogComponent } from '../../espace-dialog/espace-dialog.component';
import { ModifierPlacesDialogComponent } from '../../modifier-places-dialog/modifier-places-dialog.component';
import { Festival } from 'src/app/interfaces/festival.interface';
import { FestivalService } from 'src/app/services/festival.service';
import { MatSelectChange } from '@angular/material/select';
import { InscriptionService } from 'src/app/services/inscription.service';

@Component({
  selector: 'planning-individual',
  templateUrl: './planning-individual.component.html',
  styleUrls: ['./planning-individual.component.scss'],
})
export class PlanningIndividualComponent implements OnInit {
  @Input() user: User | undefined;
  userRegistrations: any[] = [];
  postes: Poste[] = []; 

  userName: string = '';
  dataSource = new MatTableDataSource<any>([]);
  selectedFestival: number = 0;
  festivals: Festival[] = []; 
  referents: User[] = [];

  displayedColumns: string[] = ['poste','espace', 'jour', 'creneau', 'referent', 'actions'];

  constructor(private inscriptionService: InscriptionService, private festivalService: FestivalService,private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadFestivals();
    if (this.user) {
      this.userName = `${this.user?.nom} ${this.user?.prenom}`;
      console.log('User input:', this.user);
      // Once user data is available, trigger fetching user registrations
      this.fetchUserRegistrations(this.user.pseudo, this.selectedFestival); 
    } else {
      // If user input is not provided, use the logged-in user's pseudo
      const pseudo = this.authService.getLoggedInUserPseudo() ?? '';
      this.fetchUser(pseudo);
    }

  }

  loadFestivals() {
    this.festivalService.getFestivals().subscribe(
      (festivals: Festival[]) => {
        this.festivals = festivals;
  
        // Trouver le festival dont l'année correspond à l'année actuelle
        const currentYear = new Date().getFullYear();
        const defaultFestival = this.festivals.find(festival => festival.annee === currentYear);
      
        if (defaultFestival) {
          this.selectedFestival = defaultFestival.idF;
        } else {
          // Si aucun festival correspondant n'est trouvé, utilisez le premier festival de la liste (s'il y en a un)
          this.selectedFestival = this.festivals.length > 0 ? this.festivals[0].idF : 0;
        }
      },
      (error) => {
        console.error('Error loading festivals', error);
      }
    );
  }

  onFestivalChange(event: MatSelectChange) {
    this.selectedFestival = event.value;
    this.fetchUserRegistrationsForSelectedFestival(); 
  }

  fetchUserRegistrationsForSelectedFestival() {
    if (this.user && this.selectedFestival) {
      // Clear existing user registrations
      this.userRegistrations = [];
      
      // Fetch user registrations for the selected festival
      this.fetchUserRegistrations(this.user.pseudo, this.selectedFestival);
    }
  }


  fetchUser(pseudo: string) {
    this.userService.getUserByPseudo(pseudo).subscribe(
      (userData) => {
        this.user = userData;
        this.userName = `${this.user?.nom} ${this.user?.prenom}`;
        console.log('Fetched user data:', this.user);
        console.log(this.userName);
        // Once user data is fetched, trigger fetching user registrations
        this.fetchUserRegistrations(pseudo, this.selectedFestival);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  fetchUserRegistrations(pseudo: string, idF: number) {
    this.userService.getUserRegistrations(pseudo, idF).subscribe(
      (data) => {
        this.userRegistrations = data.filter(registration => registration.isAccepted && registration.isAffected);
        console.log('Fetched user registrations:', this.userRegistrations);
        // After fetching user registrations, update the data source for the table
        this.dataSource.data = this.userRegistrations;
  
        // Iterate over each user registration to get referents
        this.userRegistrations.forEach(userRegistration => {
          this.inscriptionService.getPosteReferent(userRegistration.espaceId).subscribe(
            (referents) => {
              // Assign referents to the specific user registration
              this.referents = referents;
            }
          );
          this.inscriptionService.getEspaceById(userRegistration.espaceId).subscribe(
            (espace) => {  
              userRegistration.Espace.libelleEspace = espace.libelleEspace;
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching user registrations:', error);
      }
    );
  }
  

  deleteUserRegistration(registration: UserRegistration) {
    const confirmation = confirm('Voulez-vous vraiment supprimer cette inscription ?');
    if (confirmation) {
      this.userService.deleteUserRegistration(registration.id).subscribe(
        (response) => {
          console.log('Response from deleteUserRegistration:', response);
          // Peut-être, vous pouvez mettre à jour votre tableau local après la suppression
          const index = this.userRegistrations.findIndex(reg => reg.id === registration.id);
          if (index !== -1) {
            this.userRegistrations.splice(index, 1);
            this.dataSource.data = this.userRegistrations;
          }
        },
        (error) => {
          console.error('Error calling deleteUserRegistration:', error);
        }
      );
    }
  }
}
