import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Festival } from 'src/app/interfaces/festival.interface';
import { User } from 'src/app/model/user.model';
import { FestivalService } from 'src/app/services/festival.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liste-benevoles',
  templateUrl: './liste-benevoles.component.html',
  styleUrls: ['./liste-benevoles.component.scss']
})
export class ListeBenevolesComponent implements OnInit {
  benevoles: User[] = []; 
  recherche: string = '';
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'numTel'];
  selectedFestival: number = 0;
  festivals: Festival[] = []; 



  constructor(private festivalService: FestivalService, private router: Router, private benevoleService: UserService) { }

  ngOnInit() {
    this.loadFestivals();
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
  
        // Call getBenevoles inside the subscribe block
        this.getBenevoles(this.selectedFestival);
      },
      (error) => {
        console.error('Error loading festivals', error);
      }
    );
  }

  onFestivalChange(event: MatSelectChange) {
    this.selectedFestival = event.value;
    this.getBenevoles(this.selectedFestival);
  }

  

  getBenevoles(idF : number) {
    this.benevoleService.getAllUsers(idF).subscribe(
      (data: User[]) => {
        this.benevoles = data;
        this.dataSource = new MatTableDataSource(this.benevoles); 
      },
      error => {
        console.error('Erreur lors de la récupération des bénévoles', error);
      }
    );
  }

  filtrerBenevoles() {
    if (this.recherche.trim() !== '') {
      this.dataSource.data = this.benevoles.filter(benevole =>
        benevole.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
        benevole.prenom.toLowerCase().includes(this.recherche.toLowerCase())
      );
    } else {
      this.dataSource.data = this.benevoles; 
    }
  }

  afficherPlanningIndividuel(pseudo: string) {
    console.log("pseudo", pseudo)
    this.router.navigate(['planning-individuel-admin', pseudo]);
}
}
