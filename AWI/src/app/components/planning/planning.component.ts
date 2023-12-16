import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionComponent } from '../inscription/inscription.component';
import { InscriptionService } from 'src/app/services/inscription.service';
import { AnimationJeuPlanningComponent } from './animation-jeu-planning/animation-jeu-planning.component';
import { HttpClient } from '@angular/common/http';
import { Espace } from 'src/app/interfaces/espace.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyDialogComponent } from '../modify-dialog/modify-dialog.component';
import { PlanningItem } from 'src/app/interfaces/planning-item.interface';
import { MockAuthService } from 'src/app/mocks/auth.service.mock';
import { PlanningService } from 'src/app/services/poste-creneau.service';
import { MockPlanningService } from 'src/app/mocks/poste-creneau.service.mock';
import { Jour } from 'src/app/enumeration/jour.enum';
import { Subscription } from 'rxjs';
import { Zone } from 'src/app/interfaces/zone.interface';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit, OnDestroy{
  weekend: string[] = ['Samedi', 'Dimanche'];
  private itemselect?: Espace | Poste = undefined;
  @Input() items: Poste[] | Zone[] | Espace[] = [];
  @Input() creneaux: Creneau[] = [];
  joursEnum = Jour;
  jours: Jour[] = [Jour.Samedi, Jour.Dimanche];
  
  
  userRole: string = '';
  private creneauxSubscription: Subscription | undefined;

  itemDisponibles: { [itemId: number]: { [creneau: string]: string | number } } = {};



  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpClient: HttpClient,
    private authService: MockAuthService,
    public planningService: MockPlanningService
  ) {}

  ngOnInit() {
    this.setUserRole();
    this.fetchData();
    this.organizeCreneauxParJour();
  }

  ngOnDestroy() {
    // Assurez-vous de désabonner la souscription pour éviter les fuites de mémoire
    if (this.creneauxSubscription) {
      this.creneauxSubscription.unsubscribe();
    }
  }

  initializeItemDisponibles() {
    this.items.forEach(item => {
      this.itemDisponibles[item.id] = {};
      this.creneaux.forEach(creneau => {
        this.itemDisponibles[item.id][creneau.heureDebut] = item.placedisponible;
      });
    });
  }

  fetchData() {
    this.planningService.getItems().subscribe(
      (data: Espace[] | Poste[] | Zone[]) => {
        this.items = data;
        this.initializeItemDisponibles();
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );

    
    this.planningService.getCreneaux().subscribe(
      (data: Creneau[]) => {
        console.log('PlanningComponent - Creneaux:', data);
        this.creneaux = data;
      },
      (error) => {
        console.error('Error fetching creneaux:', error);
      }
    );
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

onButtonClick(jour: string, creneau: Creneau, posteId: number, heureDebut: string, item: PlanningItem): void {
  console.log(`creneau=${JSON.stringify(creneau)}`)
  console.log(`item=${JSON.stringify(item)}`)
  this.itemselect = item
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
  if ( 'zones' in item) {
  const poste = item as Poste;
    if(poste.zones && poste.zones.length > 1) {
      // Ouvrir le composant AnimationJeuPlanningComponent avec les espaces spécifiques
      this.router.navigate(['/animation-jeu-planning']);
    } 
    else {
    // Your existing logic for handling button click
    const itemSelectionne = this.items.find(p => p.id === posteId);
    if (itemSelectionne) {
      const creneauSelectionne = creneau;
      const jourSelectionne = jour;

      const dialogRef = this.dialog.open(InscriptionComponent, {
        width: '400px',
        data: { jour: jourSelectionne, creneau: creneauSelectionne, item: itemSelectionne }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          // Update available slots and re-render the button
          itemSelectionne.placedisponible--;
        }
      });
    }
  }
}
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

setUserRole() {
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
}

openModificationDialog() {
  const dialogRef = this.dialog.open(ModifyDialogComponent, {
    width: '600px', // Adjust the width as needed
    data: {
      creneaux: this.creneaux, // Pass your current creneaux and postes data to the dialog
      postes: this.items
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle the result from the modification dialog if needed
    console.log('Modification dialog closed with result:', result);
  });
}

getWeekendDays(): string[] {
  return Object.values(this.joursEnum)
    .filter(jour => jour === Jour.Samedi || jour === Jour.Dimanche) as string[];
}

getDisplayedColumns(): string[] {
  // Implémentez la logique pour obtenir les colonnes que vous souhaitez afficher
  // Retournez-les sous forme de tableau de chaînes (par exemple, ['nom', 'Lundi', 'Mardi', ...])
  return ['nom', ...this.getWeekendDays().map(jour => jour), ...this.creneaux.map(creneau => creneau.heureDebut + '-' + creneau.heureFin)];
}

getCreneauxColumnDefs() {
  // Logique pour obtenir les noms de colonnes pour les créneaux
  // Par exemple, si vous avez une propriété creneaux dans votre composant, vous pouvez faire quelque chose comme ceci :
  return this.creneaux.map(creneau => creneau.heureDebut + '-' + creneau.heureFin);
}

// Inside your component class
creneauxParJour: { [jour: string]: Creneau[] } = {};

// Assume this method is called during data fetching or initialization
organizeCreneauxParJour(): void {
  this.creneauxParJour = {};

  // Organize creneaux by jour
  this.creneaux.forEach(creneau => {
    const jour = creneau.jour;
    if (!this.creneauxParJour[jour]) {
      this.creneauxParJour[jour] = [];
    }
    this.creneauxParJour[jour].push(creneau);
  });
}


}