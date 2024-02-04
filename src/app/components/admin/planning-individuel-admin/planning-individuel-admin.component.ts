// planning-individual.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Festival } from 'src/app/interfaces/festival.interface';
import { MatSelectChange } from '@angular/material/select';
import { FestivalService } from 'src/app/services/festival.service';

@Component({
  selector: 'planning-individuel-admin',
  templateUrl: './planning-individuel-admin.component.html',
  styleUrls: ['./planning-individuel-admin.component.scss'],
})
export class PlanningIndividuelAdminComponent implements OnInit {
  userRegistrations: UserRegistration[] = [];
  postes: Poste[] = []; 

  userName: string = '';
  user: User | undefined; 
  dataSource = new MatTableDataSource<any>([]);
  selectedFestival: number = 0;
  festivals: Festival[] = []; 

  displayedColumns: string[] = ['poste', 'espace', 'jour', 'creneau', 'actions'];

  constructor(private festivalService: FestivalService,private location: Location, private router: Router, private authService: AuthService, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadFestivals();
    this.route.paramMap.subscribe(params => {
      const pseudo = params.get('pseudo') || '';
      this.fetchUser(pseudo);
    });
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
        console.log (this.userName);
        // Once user data is fetched, trigger fetching user registrations
        this.fetchUserRegistrations(pseudo, this.selectedFestival);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  fetchUserRegistrations(pseudo : string, idF: number) {
    this.userService.getUserRegistrations(pseudo, idF).subscribe(
      (data) => {
        this.userRegistrations = data.filter(registration => registration.isAccepted && registration.isAffected);
        console.log('Fetched user registrations:', this.userRegistrations);
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