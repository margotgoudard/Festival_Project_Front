import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Observable, Subscription, catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { PlacerService } from 'src/app/services/placerService';
import { Espace } from 'src/app/interfaces/espace.interface';
import { InscriptionComponent } from '../../inscription/inscription.component';
import { Component, Input, OnInit } from '@angular/core';
import { InscriptionDialogEspacesComponent } from '../../inscription-dialog-espaces/inscription-dialog-espaces.component';
import { User } from 'src/app/model/user.model';
import { InscriptionAdminComponent } from '../inscription-admin/inscription-admin.component';
import { InscriptionDialogEspacesAdminComponent } from '../inscription-dialog-espaces-admin/inscription-dialog-espaces-admin.component';
import { CreneauDialogComponent } from '../../creneau-dialog/creneau-dialog.component';
import { PosteDialogComponent } from '../../poste-dialog/poste-dialog.component';
import { EspaceDialogComponent } from '../../espace-dialog/espace-dialog.component';
import { ModifierPlacesDialogComponent } from '../../modifier-places-dialog/modifier-places-dialog.component';
import { Festival } from 'src/app/interfaces/festival.interface';
import { MatSelectChange } from '@angular/material/select';
import { FestivalService } from 'src/app/services/festival.service';

@Component({
  selector: 'app-planning-admin',
  templateUrl: './planning-admin.component.html',
  styleUrls: ['./planning-admin.component.scss']
})
export class PlanningAdminComponent {
  @Input() user: User | undefined;
  creneaux: Creneau[] = [];
  selectedPoste: Poste | null = null;
  espaces: Espace[] = [];
  espacesPostes: Espace[] = [];
  postes: Poste[] = []; // Liste des postes
  jours: string[] = []; // Tableau pour stocker les jours de la semaine
  planning: { jour: string, creneaux: Creneau[] }[] = [];
  posteEspacesMapping: { [posteId: number]: Espace[] } = {};
  placesDisponibles: { [key: string]: number } = {};
  placesInscrites: { [key: string]: number } = {};
  aPlusieursEspaces : boolean = false;
  posteId: number | null = null;
  selectedFestival: number = 0;
  festivals: Festival[] = []; 

  constructor(private festivalService: FestivalService,private userService: UserService, private authService: AuthService, private router: Router, private dialog: MatDialog, private planningService: InscriptionService, private placerService: PlacerService) { }

  ngOnInit(): void {
    this.loadFestivals();
    this.loadData();
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
  
        // Charger les données pour le festival sélectionné par défaut
        this.loadData();
      },
      (error) => {
        console.error('Error loading festivals', error);
      }
    );
  }
  onFestivalChange(event: MatSelectChange) {
    // Reload data when the selected festival changes
    this.selectedFestival = event.value;
    this.loadData();
  }


  private async loadData(): Promise<void> {
    this.loadPostes();
    this.loadCreneaux();
    this.loadEspaces().subscribe(() => {
      this.initPlacesDisponibles();
      for (const [numericPosteId, espaces] of Object.entries(this.posteEspacesMapping)) {
        const posteId = +numericPosteId;
        if (!isNaN(posteId)) {
          espaces.forEach((espace) => {
            this.jours.forEach(jour => {
              const creneaux = this.getCreneauxByJour(jour);
  
              creneaux.forEach((creneau) => {
                this.getNumberOfPlaces(creneau.idC, espace.idEspace);
                this.placesDejaInscrites(creneau.idC, espace.idEspace);
              });
            });
          });
        }
      }
    });
  }

  private loadEspaces(): Observable<Espace[]> {
    if (this.espaces.length > 0) {
      return of(this.espaces); // Return an observable with already loaded data
    }
  
    return this.planningService.getEspaces(this.selectedFestival).pipe(
      tap(espaces => {
        // Organize espaces by posteId
        this.postes.forEach(poste => {
          const posteEspaces = espaces.filter(espace => espace.posteId === poste.idP);
          this.posteEspacesMapping[poste.idP] = posteEspaces;
        });
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
    this.planningService.getPostes(this.selectedFestival).subscribe(postes => {
      this.postes = postes;
    });
  }

  private loadCreneaux(): void {
    this.planningService.getCreneaux(this.selectedFestival).subscribe(creneaux => {
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
  }

  getCreneauxByJour(jour: string): Creneau[] {
    const day = this.planning.find(item => item.jour === jour);
  
    if (day) {
      // Fonction de comparaison pour trier les créneaux par heure de début
      const comparaison = (creneauA: Creneau, creneauB: Creneau) => {
        const heureDebutA = this.convertirHeureEnNombre(creneauA.heureDebut);
        const heureDebutB = this.convertirHeureEnNombre(creneauB.heureDebut);
        return heureDebutA - heureDebutB;
      };
  
      // Trier les créneaux par ordre chronologique
      return day.creneaux.sort(comparaison);
    } else {
      return [];
    }
  }
  
  // Fonction utilitaire pour convertir l'heure de format "10h" en nombre
  convertirHeureEnNombre(heure: string): number {
    const heureSansH = heure.replace('h', '');
    return parseInt(heureSansH, 10);
  }

  
  private getNumberOfPlaces(creneauId: number, espaceId: number): void {
    const key = `${creneauId}_${espaceId}`;
    this.placerService.getNombrePlacesPourEspaces(espaceId, creneauId).subscribe(nbPlaces => {
      this.placesDisponibles[key] = nbPlaces;
    });
  }
  

  calculateTotalPlaces(creneauId: number, posteId: number): number {
    const espaces = this.posteEspacesMapping[posteId];
    let totalPlaces = 0;

    if (espaces && espaces.length > 0) {
        espaces.forEach((espace) => {
            const key = `${creneauId}_${espace.idEspace}`;
            
            // Check if the key exists in this.placesDisponibles
            if (this.placesDisponibles[key] !== undefined) {
                // Use type assertion to inform TypeScript
                const places = this.placesDisponibles[key] as unknown;

                // Ensure that places is an object before accessing the nbPlaces property
                if (typeof places === 'object' && places !== null && 'nbPlaces' in places) {
                    totalPlaces += (places as { nbPlaces: number }).nbPlaces;
                } 
            } 
        });
    }
    return totalPlaces;
}
  


onButtonClick(creneau: Creneau, poste: Poste): void {
  this.posteId = poste.idP;
  this.espacesPostes = this.posteEspacesMapping[poste.idP];
  if (  this.espacesPostes &&   this.espacesPostes.length > 1) {
    this.aPlusieursEspaces = true;
  } else if (this.espacesPostes && this.espacesPostes.length === 1) {
    this.openInscriptionDialog(this.placesRestantes(creneau.idC, poste.idP), creneau, poste);
    this.aPlusieursEspaces = false;
  }
}

openInscriptionDialog(totalPlaces: number, creneau: Creneau, poste: Poste) {
  const dialogRef = this.dialog.open(InscriptionAdminComponent, {
    width: '600px',
    data: {
      totalPlaces: totalPlaces,
      creneau: {
        idC: creneau.idC,
        jour: creneau.jourCreneau,
        heureDebut: creneau.heureDebut,
        heureFin: creneau.heureFin,
        idF: creneau.idF
      },
      poste: {
        idP: poste.idP,
        libelle: poste.libellePoste,
      },
      posteEspacesMapping: this.posteEspacesMapping[poste.idP], 
      user: this.user
    }
  });
}

placesDejaInscrites(creneauId: number, espaceId: number): void {
  const key = `${creneauId}_${espaceId}`;
  
  this.userService.getUsersRegistration(this.selectedFestival).subscribe(userRegistrations => {
    const filteredRegistrations = userRegistrations.filter(registration =>
      registration.creneauId === creneauId && registration.espaceId === espaceId
    );

    this.placesInscrites[key] = filteredRegistrations.length;
  });
}

placesDejaInscritesEspaces(creneauId: number, espaceId: number): number {
  const key = `${creneauId}_${espaceId}`;

  if (this.placesInscrites[key] !== undefined) {
    return this.placesInscrites[key];
  }
  
  this.userService.getUsersRegistration(this.selectedFestival).subscribe(userRegistrations => {
    const filteredRegistrations = userRegistrations.filter(registration =>
      registration.creneauId === creneauId && registration.espaceId === espaceId
    );

    this.placesInscrites[key] = filteredRegistrations.length;
  });

  return this.placesInscrites[key];
}


placesRestantes(creneauId: number, posteId: number): number  {
  const posteEspaces = this.posteEspacesMapping[posteId];
  const espace = posteEspaces ? posteEspaces[0] : null;
  const idEspace = espace ? espace.idEspace : null;
    const calculateTotal = this.calculateTotalPlaces(creneauId, posteId);
    const nbPlaces = calculateTotal - this.placesInscrites[`${creneauId}_${idEspace}`];
     
  return nbPlaces;
}

placesRestantesEspaces(creneauId: number, espaceId: number): number  {
  
  let nbPlacesDisponibles = 0;
  let nbPlacesInscrites = 0;
  let nbPlaces = 0;
   if (this.placesDisponibles[`${creneauId}_${espaceId}`] !== undefined) {
    const places = this.placesDisponibles[`${creneauId}_${espaceId}`] as unknown;

    if (typeof places === 'object' && places !== null && 'nbPlaces' in places) {
      nbPlacesDisponibles = (places as { nbPlaces: number }).nbPlaces;
    } 
} 

  nbPlacesInscrites = this.placesDejaInscritesEspaces(creneauId, espaceId);
  
    nbPlaces = nbPlacesDisponibles - nbPlacesInscrites;
  return nbPlaces;
}

onButtonClickEspace(creneau: Creneau, espace: Espace): void {
    this.openInscriptionDialogEspaces(this.placesRestantesEspaces(creneau.idC, espace.idEspace), creneau, espace);
    this.aPlusieursEspaces = false;
  }

openInscriptionDialogEspaces(totalPlaces: number, creneau: Creneau, espace: Espace) {
    const dialogRef = this.dialog.open(InscriptionDialogEspacesAdminComponent, {
      width: '600px',
      data: {
        totalPlaces: totalPlaces,
        creneau: {
          idC: creneau.idC,
          jour: creneau.jourCreneau,
          heureDebut: creneau.heureDebut,
          heureFin: creneau.heureFin,
          idF: creneau.idF
        },
        espace: {
          idEspace: espace.idEspace,
          libelle: espace.libelleEspace,
        },
        user: this.user,
      }
    });
  }

  openCreneauDialog() {
    const dialogRef = this.dialog.open(CreneauDialogComponent, {
      width: '600px', 
      data: {
        creneau: this.creneaux,
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Creneau dialog closed with result:', result);
      }
    });
  }
  
  openPosteDialog() {
   this.dialog.open(PosteDialogComponent, { /* dialog configuration */ });
  }
  
  openEspaceDialog() {
    this.dialog.open(EspaceDialogComponent, { /* dialog configuration */ });
  }
  
  openModifierPlacesDialog() {
     this.dialog.open(ModifierPlacesDialogComponent, { /* dialog configuration */ });
  }
}




