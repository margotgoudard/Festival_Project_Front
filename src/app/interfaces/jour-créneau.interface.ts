import { Jour } from "../enumeration/jour.enum";
import { Creneau } from "./creaneau.interface";

export interface JourCreneau {
    id : number,
    jour : Jour,
    creneaux : Creneau[]
}