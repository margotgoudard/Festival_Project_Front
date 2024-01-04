import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyDialogComponent } from '../modify-dialog/modify-dialog.component';
import { Observable, Subscription, catchError, forkJoin, map, switchMap, tap, throwError } from 'rxjs';
import { PlacerService } from 'src/app/services/placerService';
import { Espace } from 'src/app/interfaces/espace.interface';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  heures: { debut: string, fin: string }[] = []; // Liste des heures de début et de fin
  creneaux: Creneau[] = [];
  espaces: Espace[] = [];
  espacesFiltres : Espace[]=[];
  postes: Poste[] = []; // Liste des postes
  jours: string[] = []; // Tableau pour stocker les jours de la semaine
  planning: { jour: string, creneaux: Creneau[] }[] = [];
  posteEspacesMapping: { [posteId: number]: { [jour: string]: Espace } } = {};

  constructor(private dialog: MatDialog, private planningService: InscriptionService, private placerService: PlacerService) { }

  ngOnInit(): void {
    

    // Call the service to retrieve postes from the database
    this.planningService.getPostes().subscribe(postes => {
      // Store the postes in your property postes
      this.postes = postes; 
    });

    console.log('Postes:', this.postes); 

    // Call the service to retrieve creneaux from the database
    this.planningService.getCreneaux().subscribe(creneaux => {
      // Organize the creneaux by day
      creneaux.forEach(creneau => {
        const existingDay = this.planning.find(item => item.jour === creneau.jourCreneau);

        if (!existingDay) {
          this.planning.push({ jour: creneau.jourCreneau, creneaux: [creneau] });
          this.jours.push(creneau.jourCreneau);
        } else {
          existingDay.creneaux.push(creneau);
        }
      });

      console.log('Planning:', this.planning);
      console.log('Jours:', this.jours);
    });
    
  }

  getCreneauxByJour(jour: string): Creneau[] {
    const day = this.planning.find(item => item.jour === jour);
    console.log(day?.creneaux);
    return day ? day.creneaux : [];
  }

  getEspaces(posteId: number): Observable<Espace[]> {
    return this.planningService.getEspaces().pipe(
      map(espaces => espaces.filter((espace) => espace.posteId === posteId))
    );
  }

  getNumberOfPlaces(creneauId: number, espaceId: number): Observable<any> {
    return this.placerService.getNombrePlacesPourEspaces([espaceId], creneauId);
  }


  // Inside PlanningComponent class
multipleSelection = false;
selectedButtons: { posteId: number, heureDebut: string }[] = [];

toggleMultipleSelection(): void {
  // Toggle the multiple selection mode
  this.multipleSelection = !this.multipleSelection;

  // Clear the selected buttons list when switching modes
  this.selectedButtons = [];
}

onButtonClick(jour: string, creneau: Creneau, posteId: number, heureDebut: string, poste: Poste): void {
  console.log(`creneau=${JSON.stringify(creneau)}`)
  console.log(`poste=${JSON.stringify(poste)}`)
  /*this.posteselect = poste
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
}*/
}

isSelected(posteId: number, heureDebut: string): boolean {
  return this.selectedButtons.some(button => button.posteId === posteId && button.heureDebut === heureDebut);
}

inscrireATousLesPostes() {

  if (this.selectedButtons.length === 0) {
    // Affichez une alerte si aucun poste n'est sélectionné
    alert('Aucun poste sélectionné');
    return;
  }
  // Logique pour inscrire à tous les postes sélectionnés
  console.log("Inscription à tous les postes :", this.selectedButtons);
}

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

openModificationDialog() {
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
}

getCreneauxColumnDefs() {
  // Logique pour obtenir les noms de colonnes pour les créneaux
  // Par exemple, si vous avez une propriété creneaux dans votre composant, vous pouvez faire quelque chose comme ceci :
  return this.creneaux.map(creneau => creneau.heureDebut + '-' + creneau.heureFin);
}
}