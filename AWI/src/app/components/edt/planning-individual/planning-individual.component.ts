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

@Component({
  selector: 'planning-individual',
  templateUrl: './planning-individual.component.html',
  styleUrls: ['./planning-individual.component.scss'],
})
export class PlanningIndividualComponent implements OnInit {
  @Input() user: User | undefined;
  userRegistrations: UserRegistration[] = [];
  postes: Poste[] = []; 

  userName: string = '';
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['poste', 'jour', 'creneau'];

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Check if the user input is provided
    if (this.user) {
      this.userName = `${this.user?.nom} ${this.user?.prenom}`;
      console.log('User input:', this.user);
      // Once user data is available, trigger fetching user registrations
      this.fetchUserRegistrations(this.user.pseudo); // Assuming 'pseudo' is the property in the User model
    } else {
      // If user input is not provided, use the logged-in user's pseudo
      const pseudo = this.authService.getLoggedInUserPseudo() ?? '';
      this.fetchUser(pseudo);
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
        this.fetchUserRegistrations(pseudo);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  fetchUserRegistrations(pseudo: string) {
    this.userService.getUserRegistrations(pseudo).subscribe(
      (data) => {
        this.userRegistrations = data.filter(registration => registration.isAccepted && registration.isAffected);
        console.log('Fetched user registrations:', this.userRegistrations);
        // After fetching user registrations, update the data source for the table
        this.dataSource.data = this.userRegistrations;
      },
      (error) => {
        console.error('Error fetching user registrations:', error);
      }
    );
  }

  deleteUserRegistration(registration: UserRegistration) {
    const confirmation = confirm('Voulez-vous vraiment supprimer cette inscription ?');
    if (confirmation) {
      this.userService.deleteUserRegistration(registration.id);
    }
  }
}
