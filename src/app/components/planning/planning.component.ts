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
import { InscriptionComponent } from '../inscription/inscription.component';
import { Component, OnInit } from '@angular/core';
import { UserRegistration } from 'src/app/interfaces/user-registration.interface';
import { InscriptionDialogEspacesComponent } from '../inscription-dialog-espaces/inscription-dialog-espaces.component';
import { PosteDialogComponent } from '../poste-dialog/poste-dialog.component';
import { EspaceDialogComponent } from '../espace-dialog/espace-dialog.component';
import { ModifierPlacesDialogComponent } from '../modifier-places-dialog/modifier-places-dialog.component';
import { CandidaterService } from 'src/app/services/candidater.service';
import { InscriptionReussiDialogComponent } from '../inscription-reussi-dialog/inscription-reussi-dialog.component';
import { Festival } from 'src/app/interfaces/festival.interface';
import { MatSelectChange } from '@angular/material/select';
import { FestivalService } from 'src/app/services/festival.service';
import { CreneauDialogComponent } from '../creneau-dialog/creneau-dialog.component';
import { FestivalDialogComponent } from '../festival-dialog/festival-dialog.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
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
  admin : boolean = false;
  userRole: number = 0; 
  selectedFestival: number = 0;
  festivals: Festival[] = []; 


  constructor(private festivalService: FestivalService, private candidaterService: CandidaterService, private userService: UserService, private authService: AuthService, private router: Router, private dialog: MatDialog, private planningService: InscriptionService, private placerService: PlacerService) { }

  ngOnInit(): void {
    this.loadFestivals();
    this.loadData();
    this.estAdmin();
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
  
        this.loadData();
      },
      (error) => {
        console.error('Error loading festivals', error);
      }
    );
  }

  onFestivalChange(event: MatSelectChange) {
    this.selectedFestival = event.value;
    this.loadData();
  }


private loadEspaces(): Observable<Espace[]> {
  if (this.espaces.length > 0) {
    return of(); // Return an observable with no data if already loaded
  }

  return this.planningService.getEspaces(this.selectedFestival).pipe(
    tap(espaces => {
      // Organize espaces by posteId
      this.postes.forEach(poste => {
        const posteEspaces = espaces.filter(espace => espace.posteId === poste.idP);
        this.posteEspacesMapping[poste.idP] = posteEspaces;
      });
       this.espaces.push(...espaces);
    }),
    catchError(error => {
      console.error('Error loading Espaces:', error);
      return throwError(error);
    })
  );
}

getSortedCreneauxByJour(jour: string) {
  // Assuming getCreneauxByJour returns an array of time slots for the given day
  const creneaux = this.getCreneauxByJour(jour);

  // Sort the time slots based on heureDebut (assuming it's in HH:mm format)
  return creneaux.slice().sort((a, b) => {
    const timeA = a.heureDebut.split(':').map(Number);
    const timeB = b.heureDebut.split(':').map(Number);

    // Compare hours first, then minutes
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    } else {
      return timeA[1] - timeB[1];
    }
  });
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
      this.creneaux.push(...creneaux);
    });
  }

  private organizeCreneauxByDay(creneaux: Creneau[]): void {
    creneaux.forEach(creneau => {
      const existingDay = this.planning.find(item => item.jour === creneau.jourCreneau);

      if (!existingDay) {
        this.planning.push({ jour: creneau.jourCreneau, creneaux: [creneau] });
        this.jours.push(creneau.jourCreneau);
        this.jours.sort((a, b) => {
          const joursOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
          return joursOrder.indexOf(a) - joursOrder.indexOf(b);
        });
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
  const dialogRef = this.dialog.open(InscriptionComponent, {
    width: '600px',
    data: {
      totalPlaces: totalPlaces,
      creneau: {
        idC: creneau.idC,
        jour: creneau.jourCreneau,
        heureDebut: creneau.heureDebut,
        heureFin: creneau.heureFin,
        idF: creneau.idF,
      },
      poste: {
        idP: poste.idP,
        libelle: poste.libellePoste,
      },
      posteEspacesMapping: this.posteEspacesMapping[poste.idP], 
    }
  });
}

placesDejaInscrites(creneauId: number, posteId: number): void {
  const posteEspaces = this.posteEspacesMapping[posteId];
  const espace = posteEspaces ? posteEspaces[0] : null;
  const idEspace = espace ? espace.idEspace : null;
  const key = `${creneauId}_${idEspace}`;
  
  this.userService.getUsersRegistration(this.selectedFestival).subscribe(userRegistrations => {
    const filteredRegistrations = userRegistrations.filter(registration =>
      registration.creneauId === creneauId && registration.espaceId === idEspace
    );

    this.placesInscrites[key] = filteredRegistrations.length;
  });
}

placesDejaInscritesEspaces(creneauId: number, espaceId: number): number {
  const key = `${creneauId}_${espaceId}`;

  // Check if placesInscrites already has the information
  if (this.placesInscrites[key] !== undefined) {
    return this.placesInscrites[key];
  }

  // Make the API call only if the information is not available
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
    const dialogRef = this.dialog.open(InscriptionDialogEspacesComponent, {
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
      }
    });
  }

  openCreneauDialog() {
    const dialogRef = this.dialog.open(CreneauDialogComponent, {
      width: '600px', 
      data: {
        creneaux: this.creneaux,
        selectedFestival: this.selectedFestival,
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Creneau dialog closed with result:', result);
      }
    });
  }
  
  openPosteDialog(): void {
   const dialogRef = this.dialog.open(PosteDialogComponent, { 
    width: '600px',
    data: {
      postes: this.postes,
      espaces: this.espaces,
      idF: this.selectedFestival
    },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('Modification dialog closed with result:', result);
    });
  }
  
  
  openModifierPlacesDialog(): void {
      const dialogRef = this.dialog.open(ModifierPlacesDialogComponent, {
        width: '600px',
        data: {
          espaces: this.espaces,
          creneaux: this.creneaux
        }
      });
      console.log("creneaux", this.creneaux);
      console.log("espaces", this.espaces);

      dialogRef.afterClosed().subscribe(result => {
        console.log('Modification dialog closed with result:', result);
      });
    }

    estAdmin(): boolean {
      
      const pseudo = this.authService.getLoggedInUserPseudo() ?? '';

      this.userService.getUserRole(pseudo).subscribe((userRoleObject: any) => {
        this.userRole = userRoleObject.firstRoleId;
  
        if (this.userRole == 1) {
            this.admin = true;
        }
      })
      return this.admin;
  }

selectedCreneaux: Creneau[] = []; // Track selected creneaux

onCreneauSelect(creneau: Creneau): void {
  // Toggle the selection status
  const index = this.selectedCreneaux.findIndex(selected => selected.idC === creneau.idC);

  if (index !== -1) {
    // Creneau is already selected, remove it
    this.selectedCreneaux.splice(index, 1);
  } else {
    // Creneau is not selected, add it to the selectedCreneaux array
    this.selectedCreneaux.push(creneau);
  }

  // Handle the insertion to the database
  this.candidaterVolunteers();
}

candidaterVolunteers(): void {
  const benevolePseudo = this.authService.getLoggedInUserPseudo() || '';
  this.selectedCreneaux.forEach(creneau => {
    // Assuming candidaterService.candidaterVolunteer method exists
    this.candidaterService.candidaterVolunteer(benevolePseudo, creneau.idC, creneau.idF).subscribe(
      () => {
        console.log('Volunteer candidated successfully for creneau', creneau);
        console.log(creneau.idF)

        // Open the existing MatDialog with your component after successful candidature
        this.openInscriptionReussiDialog(creneau);
      },
      error => {
        console.error('Error candidating volunteer:', error);
      }
    );
  });

  // Clear the selected creneaux array after candidating
  this.selectedCreneaux = [];
}

// Fonction pour ouvrir le MatDialog existant avec votre composant
openInscriptionReussiDialog(creneau: Creneau): void {
  const dialogRef = this.dialog.open(InscriptionReussiDialogComponent, {
    data: {
      message: `Vous venez de vous déclarez flexible pour le créneau ${creneau.heureDebut} - ${creneau.heureFin} le ${creneau.jourCreneau}`
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed with result:', result);
    // Handle any logic after the dialog is closed
  });
}

openFestivalDialog(): void {
  const dialogRef = this.dialog.open(FestivalDialogComponent, { 
   width: '600px',
   data: {
     festivals: this.festivals,
   },
     });
     dialogRef.afterClosed().subscribe(result => {
       console.log('Modification dialog closed with result:', result);
   });
 }
 

}

