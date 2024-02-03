import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Hebergement } from 'src/app/model/herbegement.model';
import { HebergementService } from 'src/app/services/hebergement.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liste-hebergements',
  templateUrl: './liste-hebergements.component.html',
  styleUrls: ['./liste-hebergements.component.scss']
})
export class ListeHebergementsComponent {

  displayedColumns: string[] = ['adresseHebergement', 'nbPlaces', 'pseudo', 'email', 'numTel'];
  dataSource: MatTableDataSource<Hebergement> = new MatTableDataSource<Hebergement>([]); 
  nom: string = '';
  prenom: string = '';
  mail: string = '';
  tel: number = 0;

  constructor(private hebergementService: HebergementService, private benevoleService: UserService) {}

  ngOnInit() {
    this.loadHerbergements();
  }

  loadHerbergements() {
    this.hebergementService.getAllHerbergements().subscribe(
      (herbergements: Hebergement[]) => {
        this.dataSource = new MatTableDataSource(herbergements);

        // Fetch benevoleproposant for each hebergement
        herbergements.forEach((hebergement) => {
          this.benevoleService.getUserByPseudo(hebergement.pseudo).subscribe(
            (benevoleproposantData) => {
              this.nom = benevoleproposantData.nom,
              this.prenom = benevoleproposantData.prenom,
              this.mail = benevoleproposantData.email,
              this.tel = benevoleproposantData.numTel
            },
            (error) => {
              console.error('Erreur lors de la récupération de benevoleproposant', error);
            }
          );
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des herbergements', error);
      }
    );
  }
}