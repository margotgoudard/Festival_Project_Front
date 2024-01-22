import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
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



  constructor(private router: Router, private benevoleService: UserService) { }

  ngOnInit() {
    this.getBenevoles();
  }

  getBenevoles() {
    this.benevoleService.getAllUsers().subscribe(
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
