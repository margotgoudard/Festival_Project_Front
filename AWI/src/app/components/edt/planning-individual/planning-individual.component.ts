// planning-individual.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'planning-individual',
  templateUrl: './planning-individual.component.html',
  styleUrls: ['./planning-individual.component.scss'],
})
export class PlanningIndividualComponent implements OnInit {
  userRegistrations: UserRegistration[] = [];
  postes: Poste[] = []; 

  userName: string = '';
  user: User | undefined; 
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['poste', 'espace', 'jour', 'creneau'];

  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
     const pseudo = this.authService.getLoggedInUserPseudo() ?? '';
      this.fetchUserRegistrations(pseudo);
      this.fetchUser(pseudo);

  }

  fetchUser(pseudo: string) {
    this.userService.getUserByPseudo(pseudo).subscribe(
      (userData) => {
        this.user = userData;
        this.userName = `${this.user?.nom} ${this.user?.prenom}`;
        console.log('Fetched user data:', this.user);
        // Once user data is fetched, trigger fetching user registrations
        this.fetchUserRegistrations(pseudo);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  fetchUserRegistrations(pseudo : string) {
    this.userService.getUserRegistrations(pseudo).subscribe(
      (data) => {
        this.userRegistrations = data;
        console.log('Fetched user registrations:', this.userRegistrations);
        // After fetching user registrations, update the data source for the table
        this.dataSource.data = this.userRegistrations;
      },
      (error) => {
        console.error('Error fetching user registrations:', error);
      }
    );
  }


}