// planning-individual.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-planning-individual',
  templateUrl: './planning-individual.component.html',
  styleUrls: ['./planning-individual.component.scss'],
})
export class PlanningIndividualComponent implements OnInit {
  userRegistrations: UserRegistration[] = [];
  postes: Poste[] = []; // Add this line to include the 'postes' property
  userId: number | null = 0;
  userName: string = '';
  user: User | undefined; 
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = ['nomUtilisateur', 'prenom', 'email', 'poste', 'zone', 'espace', 'jour', 'creneau'];

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.userService.getUserId();
    if (this.userId !== null) {
      this.fetchUserRegistrations(this.userId);
      this.fetchUser(this.userId);
    }
  }

  fetchUser(userId: number) {
    this.userService.getUserById(userId).subscribe(
      (userData) => {
        this.user = userData;
        this.userName = `${this.user?.nom} ${this.user?.prenom}`;
        console.log('Fetched user data:', this.user);
        // Once user data is fetched, trigger fetching user registrations
        this.fetchUserRegistrations(userId);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  fetchUserRegistrations(userId: number) {
    this.userService.getUserRegistrations(userId).subscribe(
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