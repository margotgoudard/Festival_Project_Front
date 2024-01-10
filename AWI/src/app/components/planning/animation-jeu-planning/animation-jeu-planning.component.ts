import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Creneau } from 'src/app/interfaces/creaneau.interface';
import { Espace } from 'src/app/interfaces/espace.interface';
import { Poste } from 'src/app/interfaces/poste.interface';
import { InscriptionService } from 'src/app/services/inscription.service';
import { InscriptionComponent } from '../../inscription/inscription.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-animation-jeu-planning',
  templateUrl: './animation-jeu-planning.component.html',
  styleUrls: ['./animation-jeu-planning.component.scss']
})
export class AnimationJeuPlanningComponent {
  placesDisponibles:  { [key: string]: number } = {}; 
  jours: string[] = [];
  placesInscrites:  { [key: string]: number } = {};  
  posteEspacesMapping: { [posteId: number]: Espace[] } = {};; 
  creneaux: Creneau[] = [];
  planning: { jour: string, creneaux: Creneau[] }[] = [];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private planningService: InscriptionService) { }

  ngOnInit(): void {
    const state = this.route.snapshot.data['state'];

    if (state) {
      this.placesDisponibles = state.placesDisponibles;
      this.placesInscrites = state.placesInscrites;
      this.posteEspacesMapping = state.posteEspacesMapping;
    }
    this.loadData();
  }

    private async loadData(): Promise<void> {
      this.loadCreneaux();
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
  }

  getCreneauxByJour(jour: string): Creneau[] {
    const day = this.planning.find(item => item.jour === jour);
    return day ? day.creneaux : [];
  }

  placesRestantes(creneauId: number, posteId: number): number  {
    const posteEspaces = this.posteEspacesMapping[posteId];
    const espace = posteEspaces ? posteEspaces[0] : null;
    const idEspace = espace ? espace.idEspace : null;
      const calculateTotal = this.calculateTotalPlaces(creneauId, posteId);
      const nbPlaces = calculateTotal - this.placesInscrites[`${creneauId}_${idEspace}`];
       
    return nbPlaces;
  }

  calculateTotalPlaces(creneauId: number, posteId: number): number {
    const espaces = this.posteEspacesMapping[posteId];
    let totalPlaces = 0;

    if (espaces && espaces.length > 0) {
        espaces.forEach((espace) => {
            const key = `${creneauId}_${espace.idEspace}`;
              if (this.placesDisponibles[key] !== undefined) {
                const places = this.placesDisponibles[key] as unknown;
                if (typeof places === 'object' && places !== null && 'nbPlaces' in places) {
                    totalPlaces += (places as { nbPlaces: number }).nbPlaces;
                } 
            } 
        });
    }
    return totalPlaces;
}

onButtonClick(creneau: Creneau, poste: Poste): void {
  const espaces = this.posteEspacesMapping[poste.idP];
    this.openInscriptionDialog(this.calculateTotalPlaces(creneau.idC, poste.idP), creneau, poste);
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
        },
        poste: {
          idP: poste.idP,
          libelle: poste.libellePoste,
        },
        posteEspacesMapping: this.posteEspacesMapping[poste.idP], 
      }
    });
  }
}
