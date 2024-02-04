// votre-composant.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Festival } from 'src/app/interfaces/festival.interface';
import { Inscription } from 'src/app/interfaces/inscription.interfaces';
import { Poste } from 'src/app/interfaces/poste.interface';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { User } from 'src/app/model/user.model';
import { FestivalService } from 'src/app/services/festival.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-planning-general',
  templateUrl: './planning-general.component.html',
  styleUrls: ['./planning-general.component.scss']
})


  export class PlanningGeneralComponent implements OnInit {
    dataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatSort) sort!: MatSort;
  
    displayedColumns: string[] = ['prenom', 'nom', 'email', 'tel','poste', 'espace', 'jour', 'creneau'];
    selectedSearchField: string = 'prenom';
    selectedFestival: number = 0;
    festivals: Festival[] = []; 
    selectedEspace: number = 0;
    selectedPoste: number = 0;
    selectedJour: string = '';
    selectedCreneau: number = 0;
    poste: Poste = {idP: 0, libellePoste:'', espaces:[]}
    postes: any[] = [];
    espaces: any[] = [];
    jours: any[] = []; 
    creneaux: any[] = [];
    recherche: any = {
      festival: 0,
      espace: 0,
      jour: '',
      creneau: 0,
      nom: '',
    };


  
    constructor(private festivalService: FestivalService, private planningService: InscriptionService, private userService: UserService, private router: Router) {}
  
    ngOnInit(): void {
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
    
          // Charger les creneaux pour le festival sélectionné par défaut
          this.planningService.getCreneaux(this.selectedFestival).subscribe(
            (creneaux: any[]) => {
              // Extract distinct jours from creneaux
              const distinctJours = Array.from(new Set(creneaux.map(creneau => creneau.jourCreneau)));
    
              // Assign distinct jours to the component property
              this.jours = distinctJours;

              this.creneaux = creneaux;
    
              // Charger les espaces pour le festival sélectionné par défaut
              this.planningService.getEspaces(this.selectedFestival).subscribe(
                (espaces: any[]) => {
                  this.espaces = espaces;
    
                  // Charger les données pour le festival sélectionné par défaut
                  this.loadData();
                },
                (error) => {
                  console.error('Error loading espaces', error);
                }
              );
              this.planningService.getPostes(this.selectedFestival).subscribe(
                (postes: any[]) => {
                  this.postes = postes;
    
                  // Charger les données pour le festival sélectionné par défaut
                  this.loadData();
                },
                (error) => {
                  console.error('Error loading espaces', error);
                }
              );
            },
            (error) => {
              console.error('Error loading creneaux', error);
            }
          );
        },
        (error) => {
          console.error('Error loading festivals', error);
        }
      );
    }
    
  
    onFestivalChange(event: MatSelectChange) {
      this.recherche.festival = event.value;
      this.loadData(); 
    }

    onPosteChange(event: MatSelectChange) {
      this.recherche.poste = event.value;
      this.loadData(); 
    }
  
    onCreneauChange(event: MatSelectChange) {
      this.recherche.creneau = event.value;
      this.loadData();
    }
  
    onJourChange(event: MatSelectChange) {
      this.recherche.jour = event.value;
      this.loadData();
    }
  
    onEspaceChange(event: MatSelectChange) {
      this.recherche.espace = event.value;
      this.loadData();
    }
  
    loadData() {
      this.userService.getUsersRegistration(this.selectedFestival).subscribe(
        (userRegistrations) => {
          const mappedUsers = userRegistrations.map((registration) => ({
            benevolePseudo: registration.benevolePseudo,
            espaceId: registration.espaceId,
            creneauId: registration.creneauId,
            isAffected: registration.isAffected,
            isAccepted: registration.isAccepted,
          }));
    
          forkJoin(
            mappedUsers.map((user) =>
              forkJoin({
                benevoleInfo: this.userService.getUserByPseudo(user.benevolePseudo),
                creneauInfo: this.planningService.getCreneauById(user.creneauId),
                espaceInfo: this.planningService.getEspaceById(user.espaceId),
              })
            )
          ).subscribe(
            (results) => {
              // Filter users based on the criteria defined in filterUser function
              const filteredUsers = results.filter((result, index) => this.filterUser({
                ...result,
                ...mappedUsers[index]
              }));
    
              this.dataSource.data = filteredUsers.map((result, index) => {
                this.planningService.getPosteById(result.espaceInfo.posteId).subscribe(
                  (poste) => {
                    this.poste = poste;
              
                    // Move the assignment here to ensure it runs after the asynchronous operation is complete
                    this.dataSource.data = filteredUsers.map((result, index) => ({
                      benevoleInfo: result.benevoleInfo,
                      creneauInfo: result.creneauInfo,
                      espaceInfo: result.espaceInfo,
                      posteInfo: this.poste,
                      ...mappedUsers[index],
                    }));
                  }
                );
              
                // You can leave this return statement here if needed for the map function
                return {
                  benevoleInfo: result.benevoleInfo,
                  creneauInfo: result.creneauInfo,
                  espaceInfo: result.espaceInfo,
                  posteInfo: this.poste,  // This will be updated asynchronously inside the subscribe block
                  ...mappedUsers[index],
                };
              });
              
            },
            (error) => {
              console.error('Error loading additional user info', error);
            }
          );
        },
        (error) => {
          console.error('Error loading user registrations', error);
        }
      );
    }

  afficherPlanningIndividuel(pseudo: string) {
    console.log("pseudo", pseudo)
    this.router.navigate(['planning-individuel-admin', pseudo]);
}

filterUser(registration: any): boolean {
  const result =
    (this.recherche.espace === 0 || registration.espaceId === this.recherche.espace) &&
    (!this.recherche.jour || this.recherche.jour === registration.creneauInfo?.jourCreneau) &&
    (this.recherche.poste === 0 || this.recherche.poste === registration.posteId) &&
    (this.recherche.creneau === 0 || registration.creneauId === this.recherche.creneau);

  console.log('Filter Result:', result);
  return result;
}

generatePDF() {
  const element = document.getElementById('table-to-pdf');
  
  html2canvas(element!).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    // Adjust the scale factor (e.g., 1.0 for no scaling, 0.75 for 75% scaling, etc.)
    const scaleFactor = 0.12;
    
    // Calculate the width and height based on the scale factor
    const imgWidth = canvas.width * scaleFactor;
    const imgHeight = canvas.height * scaleFactor;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('planning.pdf');
  });
}


}
