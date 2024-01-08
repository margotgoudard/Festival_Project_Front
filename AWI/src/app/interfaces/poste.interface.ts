import { Espace } from "./espace.interface";


export interface Poste {
    idP: number;
    libellePoste: string;
    espaces: Espace[];
  }