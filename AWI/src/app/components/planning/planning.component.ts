import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyDialogComponent } from '../modify-dialog/modify-dialog.component';
import { Observable, Subscription, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { PlacerService } from 'src/app/services/placerService';
import { Espace } from 'src/app/interfaces/espace.interface';
import { InscriptionComponent } from '../inscription/inscription.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  creneaux: Creneau[] = [];
  espaces: Espace[] = [];
  postes: Poste[] = []; // Liste des postes
  jours: string[] = []; // Tableau pour stocker les jours de la semaine
  planning: { jour: string, creneaux: Creneau[] }[] = [];
  posteEspacesMapping: { [posteId: number]: Espace[] } = {};
  placesDisponibles: { [key: string]: number } = {};

  constructor(private dialog: MatDialog, private planningService: InscriptionService, private placerService: PlacerService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loadPostes();
    this.loadCreneaux();
    this.loadEspaces().subscribe(() => {
      this.initPlacesDisponibles();
      for (const [numericPosteId, espaces] of Object.entries(this.posteEspacesMapping)) {
        // Parse the key as a number, and check if it's a valid number
        const posteId = +numericPosteId;
        if (!isNaN(posteId)) {
          espaces.forEach((espace) => {
            this.jours.forEach(jour => {
              const creneaux = this.getCreneauxByJour(jour);
      
              creneaux.forEach((creneau) => {
                this.getNumberOfPlaces(creneau.idC, espace.idEspace);
                
              });
            });
          });
        }
      }
    });
  }

private loadEspaces(): Observable<Espace[]> {
  if (this.espaces.length > 0) {
    return of(); // Return an observable with no data if already loaded
  }

  return this.planningService.getEspaces().pipe(
    tap(espaces => {
      // Organize espaces by posteId
      this.postes.forEach(poste => {
        const posteEspaces = espaces.filter(espace => espace.posteId === poste.idP);
        this.posteEspacesMapping[poste.idP] = posteEspaces;
      });
      console.log('Espaces loaded:', this.posteEspacesMapping);
    }),
    catchError(error => {
      console.error('Error loading Espaces:', error);
      return throwError(error);
    })
  );
}

private initPlacesDisponibles(): void {
  // Initialize the placesDisponibles object based on the number of creneaux and espaces
  this.creneaux.forEach((creneau) => {
    this.espaces.forEach((espace) => {
      const key = `${creneau.idC}_${espace.idEspace}`;
      this.placesDisponibles[key] = 0;
    });
  });
}
  private loadPostes(): void {
    this.planningService.getPostes().subscribe(postes => {
      this.postes = postes;
    });
  }

  private loadCreneaux(): void {
    this.planningService.getCreneaux().subscribe(creneaux => {
      this.organizeCreneauxByDay(creneaux);
    });
  }

  private organizeCreneauxByDay(creneaux: Creneau[]): void {
    creneaux.forEach(creneau => {
      const existingDay = this.planning.find(item => item.jour === creneau.jourCreneau);

      if (!existingDay) {
        this.planning.push({ jour: creneau.jourCreneau, creneaux: [creneau] });
        this.jours.push(creneau.jourCreneau);
      } else {
        existingDay.creneaux.push(creneau);
      }
    });
    console.log(this.creneaux)
  }

  getCreneauxByJour(jour: string): Creneau[] {
    const day = this.planning.find(item => item.jour === jour);
    return day ? day.creneaux : [];
  }

  
  private getNumberOfPlaces(creneauId: number, espaceId: number): void {
    const key = `${creneauId}_${espaceId}`;
    this.placerService.getNombrePlacesPourEspaces(espaceId, creneauId).subscribe(nbPlaces => {
      this.placesDisponibles[key] = nbPlaces;
    });
    console.log(this.placesDisponibles)
  }
  

  calculateTotalPlaces(creneauId: number, posteId: number): number {
    const espaces = this.posteEspacesMapping[posteId];
    console.log("espaces", espaces)
    let totalPlaces = 0;

    if (espaces && espaces.length > 0) {
        espaces.forEach((espace) => {
            const key = `${creneauId}_${espace.idEspace}`;
            console.log("key", key)
            
            // Check if the key exists in this.placesDisponibles
            if (this.placesDisponibles[key] !== undefined) {
                // Use type assertion to inform TypeScript
                const places = this.placesDisponibles[key] as unknown;

                // Ensure that places is an object before accessing the nbPlaces property
                if (typeof places === 'object' && places !== null && 'nbPlaces' in places) {
                    console.log("places", places)
                    totalPlaces += (places as { nbPlaces: number }).nbPlaces;
                } else {
                    console.error(`La clé ${key} n'a pas de propriété nbPlaces valide.`);
                }
            } else {
                console.error(`La clé ${key} n'existe pas dans placesDisponibles.`);
            }
        });
    }
    console.log("VALEUR", totalPlaces);
    return totalPlaces;
}
  



/*  // Inside PlanningComponent class
multipleSelection = false;
selectedButtons: { posteId: number, heureDebut: string }[] = [];
*/
/*toggleMultipleSelection(): void {
  // Toggle the multiple selection mode
  this.multipleSelection = !this.multipleSelection;

  // Clear the selected buttons list when switching modes
  this.selectedButtons = [];
}*/

/*onButtonClick(creneauId: number, creneauId: number, espaceId: number): void {

  this.posteselect = poste
  if (this.multipleSelection) {
    // Multiple selection mode is active, add the button to the selected list
    const isSelected = this.isSelected(posteId, heureDebut);
    if (isSelected) {
      // Button is already selected, remove it from the list
      this.selectedButtons = this.selectedButtons.filter(button => !(button.posteId === posteId && button.heureDebut === heureDebut));
    } else {
      // Button is not selected, add it to the list
      this.selectedButtons.push({ posteId, heureDebut });
    }

    // Log the selected buttons to the console
    console.log('Selected Buttons:', this.selectedButtons);
  } 
  if ( 'espaces' in poste) {
  const poste = poste as Poste;
    // s'il y a des espaces on ouvre planning animation jeu
    if(poste.espaces && poste.espaces.length > 1) {
      // Ouvrir le composant AnimationJeuPlanningComponent avec les espaces spécifiques
      this.router.navigate(['/animation-jeu-planning']);
    } 
    else {
    // Your existing logic for handling button click
    const posteselectionne = this.postes.find(p => p.id === posteId);
    if (posteselectionne) {
      const creneauSelectionne = creneau;
      const jourSelectionne = jour;

      const dialogRef = this.dialog.open(InscriptionComponent, {
        width: '400px',
        data: { jour: jourSelectionne, creneau: creneauSelectionne, poste: posteselectionne }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          // Update available slots and re-render the button
          posteselectionne.placedisponible--;
        }
      });
    }
  }
}
}*/

/*isSelected(posteId: number, heureDebut: string): boolean {
  return this.selectedButtons.some(button => button.posteId === posteId && button.heureDebut === heureDebut);
}*/

/*inscrireATousLesPostes() {

  if (this.selectedButtons.length === 0) {
    // Affichez une alerte si aucun poste n'est sélectionné
    alert('Aucun poste sélectionné');
    return;
  }
  // Logique pour inscrire à tous les postes sélectionnés
  console.log("Inscription à tous les postes :", this.selectedButtons);
}*/

/*setUserRole() {
  // Subscribe to the observable to get the user information
  this.authService.getCurrentUser().subscribe(
    (user) => {
      // Handle the user information here
      this.userRole = user ? user.role : '';
    },
    (error) => {
      console.error('Error fetching user information:', error);
    }
  );
}*/

/*openModificationDialog() {
  const dialogRef = this.dialog.open(ModifyDialogComponent, {
    width: '600px', // Adjust the width as needed
    data: {
      creneaux: this.creneaux, // Pass your current creneaux and postes data to the dialog
      postes: this.postes
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle the result from the modification dialog if needed
    console.log('Modification dialog closed with result:', result);
  });
}*/

}