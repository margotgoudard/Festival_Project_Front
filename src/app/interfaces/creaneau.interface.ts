import { Jour } from "../enumeration/jour.enum";

export interface Creneau {
    idC: number;
    heureDebut: string; // Heure de début du créneau
    heureFin: string; // Heure de fin du créneau
    jourCreneau: string;
  }