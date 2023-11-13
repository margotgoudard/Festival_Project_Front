import { Espace } from "./espace.interface";

export interface Poste {
    id: number;
    nom: string; // Nom du poste
    description: string; // Description du poste
    placedisponible : number;
    espaces: Espace[];
  }